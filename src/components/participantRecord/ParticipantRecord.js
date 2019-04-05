import React, {Component} from 'react';
import {CONVERTED} from '../../utils/constants';

class ParticipantRecord extends Component {
    render() {
        const {user, participantRecord} = this.props;
        return (<>{((!user && participantRecord.state.S === CONVERTED) || user) && <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="card-title">{participantRecord.email.S}</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">{participantRecord.firstName.S}</li>
                                <li className="list-group-item">{participantRecord.lastName.S}</li>
                                <li className="list-group-item">{participantRecord.createdAt.S.substr(0, 10)}</li>
                                {user && <li className="list-group-item">{participantRecord.state.S}</li>}
                            </ul>
                            <div className="btn btn-group">
                                {user &&
                                    <a href={participantRecord.originalFile.S} 
                                    className="btn btn-danger" download>Download Original audio file</a>}
                                {user && participantRecord.state.S === CONVERTED && 
                                    <a href={participantRecord.convertedFile.S}
                                    className="btn btn-primary" download>Download Converted audio file</a>}
                            </div>
                            {participantRecord.state.S === CONVERTED &&
                                <div className="col-md-12">
                                    <audio controls controlsList="nodownload" preload="none" >
                                    <source src={participantRecord.convertedFile.S}
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
