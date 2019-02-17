import axios from 'axios';

export const participantRecordService = {
    createParticipantRecord,
    getParticipantRecords
};

function getParticipantRecords(contestURL) {
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/contests/${contestURL}/participantRecords`);
}

function createParticipantRecord(contestURL, participantRecordForm){
    return axios.post(`${process.env.REACT_APP_ROOT_URL}/${contestURL}/participantRecords`,
    participantRecordForm);
}

