//combine all of our reducers
import { combineReducers } from 'redux';
import factReducer from './factReducer'

export default combineReducers({
  fact: factReducer,
})