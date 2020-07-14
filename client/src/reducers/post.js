import * as Action from '../actions/types';

const initialState = {
    posts:[],
    post:null,
    loading:true,
    error:{}
};

export default function(state=initialState,action){
    const {type,payload}=action;
    switch(type) {
        case Action.ADD_COMMENTS:
            return {
                ...state,
                post:{...state.post,comments:payload},
                loading:false
            }
        case Action.REMOVE_COMMENTS:
            return{
                ...state,
                post:{
                    ...state.post,
                    comments:state.post.comments.filter(c=>c._id !== payload)
                },
                loading:false
            }
        case Action.GET_POST:
            return {
                ...state,
                post:payload,
                loading:false
            }
        case Action.GET_POSTS:
            return {
                ...state,
                posts:payload,
                loading:false
            }
        case Action.DELETE_POST:
            return {
                ...state,
                posts:state.posts.filter(post=>post._id !== payload),
                loading:false
            }
        case Action.ADD_POST:
            return {
                ...state,
                posts:[payload,...state.posts],
                loading:false
            }
        case Action.POST_ERROR:
            return {
                ...state,
                loading:false,
                error:payload
            }
        case Action.UPDATE_LIKES:
            return {
                ...state,
                loading:false,
                posts:state.posts.map(post=>post._id === payload.id ? {...post,likes:payload.likes}: post)
            }
        default:
            return state;
    }
}