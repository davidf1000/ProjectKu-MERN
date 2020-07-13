import axios from 'axios';
import { setAlert } from './alert';
import * as Action from './types';

//Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: Action.GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: 'Error' //{msg:err.response.statusText}
    });
  }
};

//Get All Profile 
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type:Action.CLEAR_PROFILE
  });
  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: Action.GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: 'Error' //{msg:err.response.statusText}
    });
  }
};

//Get Profile by id 
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: Action.GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: 'Load User By ID Error' //{msg:err.response.statusText}
    });
  }
};

//status: err.respose.status
//Create or update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post(
      '/api/profile',
      JSON.stringify(formData),
      config
    );
    dispatch({
      type: Action.GET_PROFILE,
      payload: res.data
    });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: { msg: err.response.statusText }
    });
  }
};

//ADD EXPERIENCE
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.put(
      '/api/profile/experience',
      JSON.stringify(formData),
      config
    );
    dispatch({
      type: Action.UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Experience Added', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: { msg: err.response.statusText }
    });
  }
};

//ADD EDUCATION
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.put(
      '/api/profile/education',
      JSON.stringify(formData),
      config
    );
    dispatch({
      type: Action.UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Education Added', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')));
    }
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: { msg: err.response.statusText }
    });
  }
};

//Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: Action.UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: { msg: err.response.data.errors }
    });
  }
};
//Delete Experience
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: Action.UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: Action.PROFILE_ERROR,
      payload: { msg: err.response.data.errors }
    });
  }
};

//Delete Account & Profile
export const deleteAccount = (id) => async (dispatch) => {
  if (window.confirm('Are You Sure ?')) {
    try {
      await axios.delete('/api/profile');
      dispatch({
        type: Action.CLEAR_PROFILE
      });
      dispatch({
        type: Action.ACCOUNT_DELETED
      });
      dispatch(setAlert('Account has been Permanently Deleted'));
    } catch (err) {
      dispatch({
        type: Action.PROFILE_ERROR,
        payload: { msg: err.response.data.errors }
      });
    }
  }
};



//Get Profile by ID 