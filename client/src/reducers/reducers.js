//combine all of our reducers
import { combineReducers } from 'redux';
import practiceReducer from './practiceReducer'

export default combineReducers({
  practice: practiceReducer,
})