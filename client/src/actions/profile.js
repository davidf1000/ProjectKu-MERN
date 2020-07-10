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
//Create or update profile
export const createProfile = (formData,history,edit=false)=> async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile',JSON.stringify(formData),config);
        dispatch({
            type:Action.GET_PROFILE,
            payload:res.data
        });
        dispatch(setAlert(edit?'Profile Updated':'Profile Created','success'));
        if(!edit)
        {
        history.push('/dashboard');
        }
    } catch (err) {
        const errors= err.response.data.errors;
        if (errors) {
            errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
          }
        dispatch({
            type:Action.PROFILE_ERROR,
            payload: {msg:err.response.statusText}
        });
    }
}