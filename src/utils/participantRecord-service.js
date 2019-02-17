import axios from 'axios';

export const participantRecordService = {
    createParticipantRecord,
    getParticipantRecords
};

function getParticipantRecords(contestId) {
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`);
}

function createParticipantRecord(contestId, participantRecordForm){
    return axios.post(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`,
                        participantRecordForm);
}

