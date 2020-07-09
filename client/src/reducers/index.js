import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';

const func=combineReducers({
    alert,
    auth
});
export default func;