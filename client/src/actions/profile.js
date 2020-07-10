import axios from 'axios';
import {setAlert} from './alert';
import * as Action from './types';

//Get current users profile 
export const getCurrentProfile = () => async dispatch => {
    try {
        const res= await axios.get('/api/profile/me');

        dispatch({
            type:Action.GET_PROFILE,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type:Action.PROFILE_ERROR,
            payload: {msg:err.response.statusText}
        });
    }
}
//status: err.respose.status