import axios from 'axios';

export const participantRecordService = {
    createParticipantRecord,
    getParticipantRecords
};

function getParticipantRecords(contestId, page) {
    page = page || 1;
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords?page=${page}`);
}

function createParticipantRecord(contestId, participantRecordForm){
    return axios.post(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`,
                        participantRecordForm);
}

