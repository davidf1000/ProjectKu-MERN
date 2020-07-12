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
                isAuthenticated:true, 
                loading:false,
                user:payload
            }
        case Action.REGISTER_SUCCESS:
        case Action.LOGIN_SUCCESS:
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated:true,
                loading:false
            }
        case Action.AUTH_ERROR:
        case Action.LOGIN_FAIL:
        case Action.REGISTER_FAIL:
        case Action.LOGOUT:
        case Action.ACCOUNT_DELETED:
            localStorage.removeItem('token');
            return {
                ...state,
                ...payload,
                isAuthenticated:false,
                loading:false,
                user:null,
                token:localStorage.getItem('token')   
            }
        default:
            return state;
    }

}