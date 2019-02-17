import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ParticipantRecords from '../participantRecord/ParticipantRecords';
import {participantRecordService} from '../../utils/participantRecord-service';
import ReactLoading from 'react-loading';
import {contestService} from '../../utils/contest-service';

class ContestDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            participantRecords: [],
            loading: true
        };
        this.deleteContest = this.deleteContest.bind(this);
    }


    componentDidMount() {
        let contestId = this.props.location.state && this.props.location.state.contest.id;
        if (!contestId) {
            //TODO Show 404 page when error
            const url = this.props.match.params.url;
            contestService.getByURL(url).then(response => {
                contestId = response.data.contest.id;
                this.setState({contest: response.data.contest}, this.getParticipantRecords(contestId))
            }).catch((err) => console.log(err))
        } else {
            this.getParticipantRecords(contestId);
        }

    }

    getParticipantRecords(contestId) {
        participantRecordService.getParticipantRecords(contestId).then(response => {
            this.setState({
                participantRecords: response.data.participantRecords,
                loading: false
            });
        }).catch((err) => console.log(err));
    }

    deleteContest() {
        const contest = (this.props.location.state && this.props.location.state.contest) || this.state.contest;
        contestService.deleteContest(contest.id).then(response => {
            console.log(response);
            this.props.history.push('/');
        });
    }

    render() {
        const user = this.props.location.state && this.props.location.state.user;
        const contest = (this.props.location.state && this.props.location.state.contest) || this.state.contest;
        const {participantRecords, loading} = this.state;
        return (
            <div className="card">
                {contest ? <div>
                    <img className="card-img-top" src={contest.image} alt={contest.name}/>
                    <div className="card-body">
                        <h5 className="card-title">{contest.name}</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">{contest.startDate}</li>
                        <li className="list-group-item">{contest.endDate}</li>
                        <li className="list-group-item">{contest.text}</li>
                        <li className="list-group-item">{contest.recommendations}</li>
                        <li className="list-group-item">{contest.payment}</li>
                        <li className="list-group-item">{contest.url}</li>
                    </ul>
                </div> : ''}
                {loading ?
                    <ReactLoading type="bars" color="#000000"/>
                    :
                    <ParticipantRecords user={user}
                                        participantRecords={participantRecords}/>}
                {!user && contest &&
                <Link className="btn btn-primary" to={`/contests/${contest.url}/addParticipantRecord`}>Add a
                    record</Link>}
                {user && contest &&
                <div className="btn btn-group">
                    <Link className="btn btn-primary" to={`/contests/${contest.id}/edit`}>
                        Edit contest
                    </Link>
                    <button className="btn btn-danger" onClick={this.deleteContest}>Delete contest</button>
                </div>}
            </div>
        );
    }
}

export default ContestDetail;