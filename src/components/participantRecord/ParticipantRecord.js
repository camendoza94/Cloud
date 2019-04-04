import React, {Component} from 'react';
import {CONVERTED} from '../../utils/constants';

class ParticipantRecord extends Component {
    render() {
        const {user, participantRecord} = this.props;
        return (<>{((!user && participantRecord.state === CONVERTED) || user) && <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="card-title">{participantRecord.email}</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">{participantRecord.firstName}</li>
                                <li className="list-group-item">{participantRecord.lastName}</li>
                                <li className="list-group-item">{participantRecord.createdAt.substr(0, 10)}</li>
                                {user && <li className="list-group-item">{participantRecord.state}</li>}
                            </ul>
                            <div className="btn btn-group">
                                {user &&
                                    <a href={participantRecord.originalFile} 
                                    className="btn btn-danger" download>Download Original audio file</a>}
                                {user && participantRecord.state === CONVERTED && 
                                    <a href={participantRecord.convertedFile}
                                    className="btn btn-primary" download>Download Converted audio file</a>}
                            </div>
                            {participantRecord.state === CONVERTED &&
                                <div className="col-md-12">
                                    <audio controls controlsList="nodownload" preload="none" >
                                    <source src={participantRecord.convertedFile}
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
