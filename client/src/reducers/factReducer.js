import { SEARCHING_FACTS, SEARCH_FACTS_SUCCESS, SEARCH_FACTS_FAIL, SEARCH_FACTS_ERROR } from '../actions/factActions';
import { POSTING_FACT, POST_FACT_ERROR, POST_FACT_FAIL, POST_FACT_SUCCESS } from '../actions/factActions';
import { POSTING_FACT_CHECK, POST_FACT_CHECK_ERROR, POST_FACT_CHECK_FAIL, POST_FACT_CHECK_SUCCESS } from '../actions/factActions';

//initial state, object
const initialState = {
  searchingFacts: false,
  facts: [],
  showError: false,
  errorMessage: "",
}

export default function factReducer(state = initialState, action) {
  switch(action.type) {
    case SEARCHING_FACTS:
      return {
        ...state,
        searchingFacts: true,
        showError: false
      };
    case SEARCH_FACTS_SUCCESS:
      return {
        ...state,
        searchingFacts: false,
        facts: [...action.facts]
      }
    case SEARCH_FACTS_FAIL:
      return {
        ...state,
        errorMessage: action.error,
        showError: true
      }
    case SEARCH_FACTS_ERROR:
      return {
        ...state,
        errorMessage: action.error,
        showError: true
      }
    default:
      return state;
  }
}