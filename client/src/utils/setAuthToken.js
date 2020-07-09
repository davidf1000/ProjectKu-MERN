//take token , if there , add to header, if not , delete the header 
import axios from 'axios';

const setAuthToken = token => {
    if (token )
    {
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;