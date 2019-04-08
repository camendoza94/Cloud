import axios from 'axios';
import {authHeader} from "./auth-header";

export const participantRecordService = {
    createParticipantRecord,
    getParticipantRecords
};

function getParticipantRecords(contestId, lek, forward) {
    let url = `${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords?forward=${forward}`;
    if (!localStorage.getItem('user'))
        url = `${url}&paginate=20`;
    return axios({
        method: 'get',
        url: url,
        headers: authHeader(),
        data: lek
    });
}

function createParticipantRecord(contestId, participantRecordForm) {
    return axios.post(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`,
        participantRecordForm);
}

