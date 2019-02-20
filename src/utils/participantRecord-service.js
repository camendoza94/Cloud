import axios from 'axios';
import {authHeader} from "./auth-header";

export const participantRecordService = {
    createParticipantRecord,
    getParticipantRecords
};

function getParticipantRecords(contestId, page) {
    page = page || 1;
    return axios({
        method: 'get',
        url: `${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords?page=${page}`,
        headers: authHeader()
    });
}

function createParticipantRecord(contestId, participantRecordForm) {
    return axios.post(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`,
        participantRecordForm);
}

