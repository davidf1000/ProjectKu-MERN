import * as Action from '../actions/types';

const initialState ={
    token:localStorage.getItem('token'),
    isAuthenticated:null,
    loading: true,
    user: null,
}

export default function(state=initialState,action){
    const {type,payload} = action;
    switch(type)
    {
        case Action.USER_LOADED:
            return {
                ...state,
                isAuthenticaed:true,
                loading:false,
                user:payload
            }
        case Action.REGISTER_SUCCESS:
        case Action.LOGIN_SUCCESS:
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticaed:true,
                loading:false
            }
        case Action.AUTH_ERROR:
        case Action.LOGIN_FAIL:
        case Action.REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                ...payload,
                isAuthenticaed:false,
                loading:false        
            }
        default:
            return state;
    }

}