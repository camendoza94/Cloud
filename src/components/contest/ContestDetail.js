import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import ParticipantRecords from '../participantRecord/ParticipantRecords';
import {participantRecordService} from '../../utils/participantRecord-service';
import ReactLoading from 'react-loading';
import {contestService} from '../../utils/contest-service';

class ContestDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            participantRecords: [],
            page: 1,
            totalPages: 1,
            loading: true
        };
        this.deleteContest = this.deleteContest.bind(this);
        this.getParticipantRecords = this.getParticipantRecords.bind(this);
    }


    componentDidMount() {
        let contestId = this.props.location.state && this.props.location.state.contest.url.S;
        if (!contestId) {
            const url = this.props.match.params.url;
            contestService.getByURL(url).then(response => {
                if (!response.data.contest) {
                    this.setState({notFound: true})
                }
                contestId = response.data.contest.url.S;
                this.setState({contest: response.data.contest}, this.getParticipantRecords(contestId, this.state.page))
            }).catch((err) => console.log(err))
        } else {
            this.getParticipantRecords(contestId);
        }

    }

    getParticipantRecords(contestId, page) {
        page = page || 1;
        participantRecordService.getParticipantRecords(contestId, page).then(response => {
            this.setState({
                participantRecords: response.data.participantRecords,
                page: page,
                loading: false
            });
        }).catch((err) => console.log(err));
    }

    deleteContest() {
        const contest = (this.props.location.state && this.props.location.state.contest) || this.state.contest;
        contestService.deleteContest(contest.url.S).then(() => {
            this.props.history.push('/');
        });
    }

    render() {
        const user = this.props.location.state && this.props.location.state.user;
        const contest = (this.props.location.state && this.props.location.state.contest) || this.state.contest;
        const {participantRecords, loading, page, totalPages, notFound} = this.state;
        return (
            <div>
                {notFound ? <Redirect to={{pathname: '/404Page', state: {from: this.props.location}}}/>:
                    <div className="card col-md-12">
                        {contest ? <div>
                            <img className="card-img-top" style={{width: '500px'}}
                                 src={contest.image.S} alt={contest.name.S}/>
                            <div className="card-body">
                                <h5 className="card-title">{contest.name.S}</h5>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><b>Fecha de
                                    inicio:</b> {contest.startDate.S.substr(0, 10)}</li>
                                <li className="list-group-item"><b>Fecha de
                                    finalización:</b> {contest.endDate.S.substr(0, 10)}</li>
                                <li className="list-group-item"><b>Texto:</b> {contest.text.S}</li>
                                <li className="list-group-item"><b>Recomendaciones: </b> {contest.recommendations.S}</li>
                                <li className="list-group-item"><b>Pago: </b>{contest.payment.N}</li>
                                <li className="list-group-item"><b>URL de acceso:</b> <Link to={'/contests/' + contest.url.S}>{contest.url.S}</Link></li>
                            </ul>
                        </div> : ''}
                        {loading ?
                            <div align="center"><ReactLoading type="bars" color="#000000"/></div>
                            :
                            <ParticipantRecords user={user}
                                                participantRecords={participantRecords}/>}
                        {!user && contest &&
                        <Link className="btn btn-primary" to={`/contests/${contest.url.S}/addParticipantRecord`}>Add a
                            record</Link>}
                        {user && contest &&
                        <div className="btn btn-group">
                            <Link className="btn btn-primary"
                                  to={{
                                      pathname: `/contests/${contest.url.S}/edit`, state: {
                                          edit: true,
                                          name: contest.name,
                                          image: contest.image,
                                          url: contest.url,
                                          startDate: contest.startDate,
                                          endDate: contest.endDate,
                                          payment: contest.payment,
                                          text: contest.text,
                                          recommendations: contest.recommendations
                                      }
                                  }}>
                                Edit contest
                            </Link>
                            <button className="btn btn-danger" onClick={this.deleteContest}>Delete contest</button>
                        </div>}
                        <div className="container">
                            <ul className="pagination">
                                {page !== 1 &&
                                <li className="page-item">
                                    <button className="page-link" onClick={() => {
                                        this.getParticipantRecords(contest.url.S, page - 1)
                                    }}>
                                        &#x3C;
                                    </button>
                                </li>}
                                {page < totalPages &&
                                <li className="page-item">
                                    <button className="page-link" onClick={() => {
                                        this.getParticipantRecords(contest.url.S, page + 1)
                                    }}>
                                        &#x3E;
                                    </button>
                                </li>}
                            </ul>
                        </div>
                        {user &&
                        <Link to="/contests">Back</Link>}
                    </div>
                }
            </div>
        );
    }
}

export default ContestDetail;