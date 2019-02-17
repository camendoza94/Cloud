import React, {Component} from 'react';
import ParticipantRecordForm from './ParticipantRecordForm';
import { participantRecordService } from '../../utils/participantRecord-service';

class ParticipantRecordNew extends Component {
    
    constructor(props){
        super(props);
        this.createParticipantRecord = this.createParticipantRecord.bind(this);
    }

    createParticipantRecord(formData){
        const contestURL = this.props.match.params.url;
        participantRecordService.createParticipantRecord(contestURL, formData)
                .then(() => {
                    this.props.history.push(`/contests/${contestURL}`)
                })
    }

    render() {
        return <ParticipantRecordForm onSubmitForm={this.createParticipantRecord}/>;
    }
}

export default ParticipantRecordNew;