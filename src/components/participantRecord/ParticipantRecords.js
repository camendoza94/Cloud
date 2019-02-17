import React, {Component} from 'react';

class ParticipantRecords extends Component {
    render() {
        const {user, participantRecords} = this.props;
        return (
            <div className="row">
                {participantsRecords.map((participantRecord)=>{
                    return <ParticipantRecord key={participantRecord.id}
                                              participantRecord={participantRecord}
                                              user={user}/>
                })}
            </div>
        );
    }
}

export default ParticipantRecords;