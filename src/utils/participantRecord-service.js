import {authHeader} from './auth-header';
import axios from 'axios';

export const participantRecordService = {
    getAll
};

function getAll(contestId) {
    return axios.get(`${process.env.REACT_APP_ROOT_URL}/contests/${contestId}/participantRecords`, authHeader())
        .then(contests => contests)
        .catch(err => err);

}