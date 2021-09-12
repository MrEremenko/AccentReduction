import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers/reducers'; //default is index.js
// import { getOrganizations } from './actions/organizationActions'
// import { getProfile } from './actions/settingsActions'

const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer, 
  initialState, 
  composeEnhancers(
    applyMiddleware(...middleware) //,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

//store.dispatch(getOrganizations());
// store.dispatch(getProfile());

export default store;