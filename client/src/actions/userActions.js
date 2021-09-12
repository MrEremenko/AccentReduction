import axios from 'axios'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a new user
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const CREATING_USER = 'CREATING_USER';
export const creatingUser = () => {
  return {
    type: CREATING_USER
  }
}

export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const createUserSuccess = (facts) => {
  return {
    type: CREATE_USER_SUCCESS,
    facts
  }
}

export const CREATE_USER_FAIL = 'CREATE_USER_FAIL';
export const createUserFail = (error) => {
  return {
    type: CREATE_USER_FAIL,
    error
  }
}

export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const createUserError = () => {
  return {
    type: CREATE_USER_ERROR
  }
}

export const createUser = (user) => {
  return (dispatch, getState) => {
    dispatch(creatingUser());
    console.log("USER:", user);
    //test that the fact is valid on the front end first
    axios.post(`/api/user/register`, user)
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(createUserSuccess(res.data.fact));
      // else
      //   dispatch(createUserFail(res.data.error));
    })
    .catch((err) => {
      dispatch(createUserError());
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Confirm user
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const CONFIRMING_USER = 'CONFIRMING_USER';
export const confirmingUser = () => {
  return {
    type: CONFIRMING_USER
  }
}

export const CONFIRM_USER_SUCCESS = 'CONFIRM_USER_SUCCESS';
export const confirmUserSuccess = () => {
  return {
    type: CONFIRM_USER_SUCCESS
  }
}

export const CONFIRM_USER_FAIL = 'CONFIRM_USER_FAIL';
export const confirmUserFail = (error) => {
  return {
    type: CONFIRM_USER_FAIL,
    error
  }
}

export const CONFIRM_USER_ERROR = 'CONFIRM_USER_ERROR';
export const confirmUserError = () => {
  return {
    type: CONFIRM_USER_ERROR
  }
}

export const confirmUser = (creds) => {
  return (dispatch, getState) => {
    dispatch(confirmingUser());
    //test that the fact is valid on the front end first
    axios.post(`/api/user/confirm`, creds)
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(createUserSuccess(res.data.fact));
      // else
      //   dispatch(createUserFail(res.data.error));
    })
    .catch((err) => {
      dispatch(createUserError());
    });
  }
}
