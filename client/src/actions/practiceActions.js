import axios from 'axios'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Search for the fact
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const UPLOAD_SENTENCE = 'UPLOAD_SENTENCE';
export const uploadingSentence = () => {
  return {
    type: UPLOAD_SENTENCE
  }
}

export const UPLOAD_SENTENCE_SUCCESS = 'UPLOAD_SENTENCE_SUCCESS';
export const uploadSentenceSuccess = (data) => {
  return {
    type: UPLOAD_SENTENCE_SUCCESS,
    data
  }
}

export const UPLOAD_SENTENCE_FAIL = 'UPLOAD_SENTENCE_FAIL';
export const uploadSentenceFail = (error) => {
  return {
    type: UPLOAD_SENTENCE_FAIL,
    error
  }
}

export const UPLOAD_SENTENCE_ERROR = 'UPLOAD_SENTENCE_ERROR';
export const uploadSentenceError = () => {
  return {
    type: UPLOAD_SENTENCE_ERROR
  }
}

export const uploadSentence = ({ formData, audioFile, sentence }) => {
  return (dispatch, getState) => {
    dispatch(uploadingSentence());
    fetch("/api/practice/presigned-post", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(async res => {
      if(res.success) {
        const presignedPostData = res.data.presignedPostData;
        try { 
          await uploadFileToS3(presignedPostData, audioFile);
          console.log("Upload file was a success!");

          //now since that is done, send a request to evaluate it and to provide a reply...
          //TODO: break this up into its separate actions...
          axios.post('/api/practice/pronounciation', { sentence, file: presignedPostData.fields.key })
          .then(data => {
            console.log("Got a return from the nodejs thing which returned a thing from the python server", data.data);
          })
          .catch(e => {
            dispatch(uploadSentenceFail(res.data.error));
          })

        } catch(e) {
          dispatch(uploadSentenceFail(res.data.error));
        }
        dispatch(uploadSentenceSuccess(res.data));
      }
      else {
        dispatch(uploadSentenceSuccess(res.data.error));
      }
    })
    .catch((err) => {
      console.log("Error is:", err);
      dispatch(uploadSentenceError());
    });
  }
}

  /**
  * Upload file to S3 with previously received pre-signed POST data.
  * @param presignedPostData
  * @param file
  * @returns {Promise<any>}
  */
  const uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach(key => {
        formData.append(key, presignedPostData.fields[key]);
      });
      // Actual file has to be appended last.
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", presignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function() {
        this.status === 204 ? resolve() : reject(this.responseText);
      };
    });
  };





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Now post fact
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const RANDOM_SENTENCE = 'RANDOM_SENTENCE';
export const randomSentence = () => {
  return {
    type: RANDOM_SENTENCE
  }
}

export const RANDOM_SENTENCE_SUCCESS = 'RANDOM_SENTENCE_SUCCESS';
export const randomSentenceSuccess = (data) => {
  return {
    type: RANDOM_SENTENCE_SUCCESS,
    data
  }
}

export const RANDOM_SENTENCE_FAIL = 'RANDOM_SENTENCE_FAIL';
export const randomSentenceFail = () => {
  return {
    type: RANDOM_SENTENCE_FAIL
  }
}

export const RANDOM_SENTENCE_ERROR = 'RANDOM_SENTENCE_ERROR';
export const randomSentenceError = () => {
  return {
    type: RANDOM_SENTENCE_ERROR
  }
}

export const getRandomSentence = () => {
  return (dispatch) => {
    dispatch(randomSentence());
    //test that the fact is valid on the front end first
    axios.get(`/api/practice/random-sentence`)
    .then(res => {
      if(res.data.success)
        dispatch(randomSentenceSuccess(res.data));
      else
        dispatch(randomSentenceFail(res.data.error));
    })
    .catch((err) => {
      dispatch(randomSentenceError());
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
