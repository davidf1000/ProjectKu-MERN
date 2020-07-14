import axios from 'axios';
import {setAlert} from './alert';
import * as Action from './types';

//Get Posts
export const getPosts = () => async dispatch =>{
    try {
        const res= await axios.get('/api/post');
        dispatch({
            type:Action.GET_POSTS,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: 'Error' //{msg:err.response.statusText}
          });
    }
}

//Add Like
export const addLike = (postId) => async dispatch =>{
    try {
        const res= await axios.put(`/api/post/like/${postId}`);
        dispatch({
            type:Action.UPDATE_LIKES,
            payload:{
                postId,likes:res.data
            }
        })
        dispatch(getPosts());
    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}

//Remove Like
export const removeLike = (postId) => async dispatch =>{
    try {
        const res= await axios.put(`/api/post/unlike/${postId}`);
        dispatch({
            type:Action.UPDATE_LIKES,
            payload:{
                postId,likes:res.data
            }
        });
        dispatch(getPosts());

    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}
//Delete Post 
export const deletePost = (postId) => async dispatch =>{
    try {
        await axios.delete(`/api/post/${postId}`);
        dispatch({
            type:Action.DELETE_POST,
            payload:postId
        });
        dispatch(getPosts());
        dispatch(setAlert('Post Removed !','success'));

    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}

//Add Post 
export const addPost = (formData) => async dispatch =>{
    const config= {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post`,JSON.stringify(formData),config);
        dispatch({
            type:Action.ADD_POST,
            payload:res.data
        });
        dispatch(getPosts());
        dispatch(setAlert('Post Created !','success'));

    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}


//Get Post
export const getPost = (id) => async dispatch =>{
    try {
        const res= await axios.get(`/api/post/${id}`);
        dispatch({
            type:Action.GET_POST,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: 'Error' //{msg:err.response.statusText}
          });
    }
}

//Add Comment 
export const addComment = (postId,formData) => async dispatch =>{
    const config= {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post/comment/${postId}`,JSON.stringify(formData),config);
        dispatch({
            type:Action.ADD_COMMENTS,
            payload:res.data
        });
        dispatch(getPosts());
        dispatch(setAlert('Comment Added !','success'));

    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}

//delete Comment 
export const deleteComment = (postId,commentId) => async dispatch =>{

    try {
        const res = await axios.delete(`/api/post/comment/${postId}/${commentId}`);
        dispatch({
            type:Action.REMOVE_COMMENTS,
            payload:res.data
        });
        dispatch(setAlert('Comment Removed !','success'));

    } catch (err) {
        dispatch({
            type: Action.POST_ERROR,
            payload: err.message //{msg:err.response.statusText}
          });
    }
}
