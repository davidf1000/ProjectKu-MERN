import * as Action from '../actions/types';

const initialState = {
    profile:null,
    profiles:[],
    loading: true,
    error:{}
}

export default function(state=initialState,action) {
    const {type,payload} = action;
    switch(type) {
        case Action.GET_PROFILE:
        case Action.UPDATE_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            }         
        case Action.GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false
            }   
        case Action.PROFILE_ERROR:
            return {
                ...state,
                error:payload,
                loading:false
            }
        case Action.CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                loading:false
            }
        default:
            return state;
    }
}