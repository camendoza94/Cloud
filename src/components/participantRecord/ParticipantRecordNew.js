import React, {Component} from 'react';
import ParticipantRecordForm from './ParticipantRecordForm';
import { participantRecordService } from '../../utils/participantRecord-service';

class ParticipantRecordNew extends Component {
    
    constructor(props){
        super(props);
        this.createParticipantRecord = this.createParticipantRecord.bind(this);
        this.state= {};
    }

    createParticipantRecord(formData){
        const contestId = this.props.match.params.id;
        participantRecordService.createParticipantRecord(contestId, formData)
                .then((response) => { 
                    console.log(response);
                    alert('Your voice was submitted! Soon it will be processed and will be available. After publishing it, you will get an email');
                    this.props.history.goBack();
                }).catch((err) => {
                    console.log(err);
                    this.setState({error: "Contest already ended"});
                })
    }

    render() {
        return  <div className="col-md-12 offset-md-3">
                    <h2>Add new audio voice</h2>
                    <ParticipantRecordForm onSubmitForm={this.createParticipantRecord} error={this.state.error || false} />
                </div>
    }
}

export default ParticipantRecordNew;