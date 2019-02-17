import React, {Component} from 'react';
import ParticipantRecord from './ParticipantRecord';

class ParticipantRecords extends Component {
    render() {
        const {user, participantRecords} = this.props;
        return (
            <div className="row">
                {participantRecords.map((participantRecord)=>{
                    return <ParticipantRecord key={participantRecord.id}
                                              participantRecord={participantRecord}
                                              user={user}/>
                })}
            </div>
        );
    }
}

export default ParticipantRecords;