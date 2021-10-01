import { UPLOAD_SENTENCE, UPLOAD_SENTENCE_SUCCESS, UPLOAD_SENTENCE_FAIL, UPLOAD_SENTENCE_ERROR } from '../actions/practiceActions';
import { RANDOM_SENTENCE, RANDOM_SENTENCE_SUCCESS, RANDOM_SENTENCE_FAIL, RANDOM_SENTENCE_ERROR } from '../actions/practiceActions';

//initial state, object
const initialState = {
  uploadingSentence: false,
  showError: false,
  errorMessage: "",
  sentence: "",
  presignedPostData: {}
}

export default function factReducer(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_SENTENCE:
      return {
        ...state,
        uploadingSentence: true,
        showError: false
      };
    case UPLOAD_SENTENCE_SUCCESS:
      return {
        ...state,
        uploadingSentence: false,
        presignedPostData: action.data
      }
    case UPLOAD_SENTENCE_FAIL:
      return {
        ...state,
        errorMessage: action.error,
        showError: true
      }
    case UPLOAD_SENTENCE_ERROR:
      return {
        ...state,
        errorMessage: action.error,
        showError: true
      }
    case RANDOM_SENTENCE_SUCCESS:
      return {
        ...state,
        sentence: action.data.sentence
      }
    default:
      return state;
  }
}