import * as Action from '../actions/types';
const initialState = [];

export default function(state= initialState , action)
{
    //Destructure 
    const {type,payload} = action;
    console.log(action);
    switch(type){
        case Action.SET_ALERT:
            return [...state,payload];
        case Action.REMOVE_ALERT:
            return state.filter(alert=>alert.id!==payload);
        default:
            return state;

    }
}