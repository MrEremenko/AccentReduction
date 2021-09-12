import axios from 'axios'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search for the fact
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const SEARCHING_FACTS = 'SEARCHING_FACTS';
export const searchingFacts = () => {
  return {
    type: SEARCHING_FACTS
  }
}

export const SEARCH_FACTS_SUCCESS = 'SEARCH_FACTS_SUCCESS';
export const searchFactsSuccess = (facts) => {
  return {
    type: SEARCH_FACTS_SUCCESS,
    facts
  }
}

export const SEARCH_FACTS_FAIL = 'SEARCH_FACTS_FAIL';
export const searchFactsFail = (error) => {
  return {
    type: SEARCH_FACTS_FAIL,
    error
  }
}

export const SEARCH_FACTS_ERROR = 'SEARCH_FACTS_ERROR';
export const searchFactsError = () => {
  return {
    type: SEARCH_FACTS_ERROR
  }
}

export const searchFact = (searchText) => {
  return (dispatch, getState) => {
    dispatch(searchingFacts());
    if(searchText.trim() !== "") {
      // console.log('searchText', searchText.split(/[ ,]+/));
      let arr = searchText.split(/[ ,]+/);
      let build = arr[0];
      for(let i = 1; i < arr.length; i++) {
        build += `+${arr[i]}`;
      }
      // console.log("build: ", build)
      axios.get(`/api/facts/search?q=${build}`, {withCredentials: true})
      .then(res => {
        if(res.data.success)
          dispatch(searchFactsSuccess(res.data.facts));
        else
          dispatch(searchFactsFail(res.data.error));
      })
      .catch((err) => {
        dispatch(searchFactsError());
      });
    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Now post fact
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const POSTING_FACT = 'POSTING_FACT';
export const postingFact = () => {
  return {
    type: POSTING_FACT
  }
}

export const POST_FACT_SUCCESS = 'POST_FACT_SUCCESS';
export const postFactSuccess = (fact) => {
  return {
    type: POST_FACT_SUCCESS,
    fact
  }
}

export const POST_FACT_FAIL = 'POST_FACT_FAIL';
export const postFactFail = (error) => {
  return {
    type: POST_FACT_FAIL,
    error
  }
}

export const POST_FACT_ERROR = 'POST_FACT_ERROR';
export const postFactError = () => {
  return {
    type: POST_FACT_ERROR
  }
}

export const postFact = (fact) => {
  return (dispatch, getState) => {
    dispatch(postingFact());
    //test that the fact is valid on the front end first
    axios.post(`/api/facts/fact`, 
    {
      ...fact
    }, 
    { 
      withCredentials: true 
    })
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(postFactSuccess(res.data.fact));
      // else
      //   dispatch(postFactFail(res.data.error));
    })
    .catch((err) => {
      dispatch(postFactError());
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Now post fact-check
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const POSTING_FACT_CHECK = 'POSTING_FACT_CHECK';
export const postingFactCheck = () => {
  return {
    type: POSTING_FACT_CHECK
  }
}

export const POST_FACT_CHECK_SUCCESS = 'POST_FACT_CHECK_SUCCESS';
export const postFactCheckSuccess = (factCheck) => {
  return {
    type: POST_FACT_CHECK_SUCCESS,
    factCheck
  }
}

export const POST_FACT_CHECK_FAIL = 'POST_FACT_CHECK_FAIL';
export const postFactCheckFail = (error) => {
  return {
    type: POST_FACT_CHECK_FAIL,
    error
  }
}

export const POST_FACT_CHECK_ERROR = 'POST_FACT_CHECK_ERROR';
export const postFactCheckError = () => {
  return {
    type: POST_FACT_CHECK_ERROR
  }
}

export const postFactCheck = (factCheck) => {
  return (dispatch, getState) => {
    dispatch(postingFactCheck());
    //test that the fact is valid on the front end first
    axios.post(`/api/facts/fact-check`, 
    {
      ...factCheck
    }, 
    { 
      withCredentials: true 
    })
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(postFactCheckSuccess(res.data.fact));
      // else
      //   dispatch(postFactCheckFail(res.data.error));
    })
    .catch((err) => {
      dispatch(postFactCheckError());
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Now get the fact-checks for a particular post
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const GETTING_FACT_CHECKS = 'GETTING_FACT_CHECKS';
export const gettingFactChecks = () => {
  return {
    type: GETTING_FACT_CHECKS
  }
}

export const GET_FACT_CHECKS_SUCCESS = 'GET_FACT_CHECKS_SUCCESS';
export const getFactChecksSuccess = (factCheck) => {
  return {
    type: GET_FACT_CHECKS_SUCCESS,
    factCheck
  }
}

export const GET_FACT_CHECKS_FAIL = 'GET_FACT_CHECKS_FAIL';
export const getFactChecksFail = (error) => {
  return {
    type: GET_FACT_CHECKS_FAIL,
    error
  }
}

export const GET_FACT_CHECKS_ERROR = 'GET_FACT_CHECKS_ERROR';
export const getFactChecksError = () => {
  return {
    type: GET_FACT_CHECKS_ERROR
  }
}

export const getFactChecks = ({ social, post}) => {
  return (dispatch, getState) => {
    dispatch(postingFactCheck());
    //test that the fact is valid on the front end first
    axios.get(`/api/facts/fact-checks?s=${social}&p=${post}`,
    { 
      withCredentials: true 
    })
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(getFactChecksSuccess(res.data.fact));
      // else
      //   dispatch(getFactChecksFail(res.data.error));
    })
    .catch((err) => {
      dispatch(getFactChecksError());
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Now submit a vote...
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const VOTING_FACT = 'VOTING_FACT';
export const votingFact = () => {
  return {
    type: VOTING_FACT
  }
}

export const VOTING_FACT_SUCCESS = 'VOTING_FACT_SUCCESS';
export const votingFactSuccess = (vote) => {
  return {
    type: VOTING_FACT_SUCCESS,
    vote
  }
}

export const VOTING_FACT_FAIL = 'VOTING_FACT_FAIL';
export const votingFactFail = (error) => {
  return {
    type: VOTING_FACT_FAIL,
    error
  }
}

export const VOTING_FACT_ERROR = 'VOTING_FACT_ERROR';
export const votingFactError = () => {
  return {
    type: VOTING_FACT_ERROR
  }
}

export const voteFact = (vote) => {
  return (dispatch, getState) => {
    dispatch(votingFact());
    //test that the fact is valid on the front end first
    axios.post(`/api/facts/vote`,
    {
      ...vote
    },
    { 
      withCredentials: true 
    })
    .then(res => {
      console.log("GOT DATAAAAAA", res);
      // if(res.data.success)
      //   dispatch(votingFactSuccess(res.data.fact));
      // else
      //   dispatch(votingFactFail(res.data.error));
    })
    .catch((err) => {
      dispatch(votingFactFail());
    });
  }
}
