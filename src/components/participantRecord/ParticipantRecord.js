import React, {Component} from 'react';
import {CONVERTED} from '../../utils/constants';
import ReactPlayer from 'react-player';

class ParticipantRecord extends Component {
    render() {
        const {user, participantRecord} = this.props;
        return (<>{((!user && participantRecord.state == CONVERTED) || user) && <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="card-title">{participantRecord.email}</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">{participantRecord.firstName}</li>
                                <li className="list-group-item">{participantRecord.lastName}</li>
                                <li className="list-group-item">{participantRecord.createdAt}</li>
                                {user && <li className="list-group-item">{participantRecord.state}</li>}
                            </ul>
                            <div className="btn btn-group">
                                {user &&
                                    <a href={`${process.env.REACT_APP_ROOT_URL}/participantRecords/${participantRecord.id}/originalFile/download`} 
                                    className="btn btn-danger">Download Original audio file</a>}
                                {user && participantRecord.state === CONVERTED && 
                                    <a href={`${process.env.REACT_APP_ROOT_URL}/participantRecords/${participantRecord.id}/convertedFile/download`}
                                    className="btn btn-primary">Download Converted audio file</a>}
                            </div>
                            {participantRecord.state === CONVERTED &&
                                <div className="col-md-12">
                                    <audio controls controlsList="nodownload">
                                    <source src={`${process.env.REACT_APP_ROOT_URL}${participantRecord.convertedFile.split('server')[1]}`}
                                            type="audio/mp3"/>
                                    Your browser does not support the audio element
                                    </audio>
                                </div>}
                            </div>
                        </div>
                    </div>}</>
        );
    }
}

export default ParticipantRecord;