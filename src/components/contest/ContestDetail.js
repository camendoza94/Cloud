import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ParticipantRecords from '../participantRecord/ParticipantRecords';
import {participantRecordService} from '../../utils/participantRecord-service';
import ReactLoading from 'react-loading';
import { contestService } from '../../utils/contest-service';

class ContestDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            participantRecords: [],
            loading: true
        }
        this.deleteContest = this.deleteContest.bind(this);
    }

    componentDidMount(){
        const url = this.props.match.params.url;
        participantRecordService.getParticipantRecords(url).then(response => {
            console.log(response);
            this.setState({participantRecords: response.data.participantRecords,
                           loading: false});
        }).catch((err)=> console.log(err));
    }

    deleteContest(){
        const { contest } = this.props;
        contestService.deleteContest(contest.id).then(response => {
            console.log(response);
            this.props.history.push('/');            
        });
    }

    render() {
        const {user, contest} = this.props.location.state;
        const {participantRecords, loading} = this.state;
        return <div className="card">
                    <img className="card-img-top" src={contest.image} alt={contest.name}/>
                    <div className="card-body">
                        <h5 className="card-title">{contest.name}</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li class="list-group-item">{contest.startDate}</li>
                        <li class="list-group-item">{contest.endDate}</li>
                        <li class="list-group-item">{contest.text}</li>
                        <li class="list-group-item">{contest.recommendations}</li>
                        <li class="list-group-item">{contest.payment}</li>
                        <li class="list-group-item">{contest.url}</li>
                    </ul>
                    {loading ?
                    <ReactLoading type="bars" color="#000000"/>
                    :
                    <ParticipantRecords user={user}
                                        participantRecords={participantRecords} />}
                    {!user &&
                        <Link className="btn btn-primary" to={`/contests/${contest.url}/addParticipantRecord`} >Add a record</Link>}
                    {user &&
                        <div className="btn btn-group">
                            <Link className="btn btn-primary" to={`/contests/${contest.id}/edit`} >
                                Edit contest
                            </Link>
                            <button onClick={this.deleteContest}>Delete contest</button>
                        </div>}
               </div>;
    }
}

export default ContestDetail;