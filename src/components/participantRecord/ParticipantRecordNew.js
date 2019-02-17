import React, {Component} from 'react';
import ParticipantRecordForm from './ParticipantRecordForm';
import { participantRecordService } from '../../utils/participantRecord-service';

class ParticipantRecordNew extends Component {
    
    constructor(props){
        super(props);
        this.createParticipantRecord = this.createParticipantRecord.bind(this);
    }

    createParticipantRecord(formData){
        const contestId = this.props.match.params.id;
        participantRecordService.createParticipantRecord(contestId, formData)
                .then((response) => { 
                    console.log(response.data);
                    alert('Your voice was submitted! Soon it will be available');
                    this.props.history.push(`/contests/${contestId}/addParticipantRecord`);
                }).catch((err) => {
                    console.log(err.response.data);
                    alert(`An error ocurred: ${err.response.data.error.contest}`);
                    this.props.history.push(`/contests/${contestId}`);
                })
    }

    render() {
        return  <div className="col-md-12 offset-md-5">
                    <h2>Add new audio voice</h2>
                    <ParticipantRecordForm onSubmitForm={this.createParticipantRecord} />
                </div>
    }
}

export default ParticipantRecordNew;