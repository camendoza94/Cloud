import React, {Component} from 'react';
import ParticipantRecord from './ParticipantRecord';

class ParticipantRecords extends Component {
    render() {
        const {user, participantRecords} = this.props;
        return (
            <div className="row">
                <div className="col-md-12"><h3>Submissions</h3></div>
                {participantRecords.map((participantRecord)=>{
                    return <ParticipantRecord key={participantRecord.id.S}
                                              participantRecord={participantRecord}
                                              user={user}/>
                })}
            </div>
        );
    }
}

export default ParticipantRecords;