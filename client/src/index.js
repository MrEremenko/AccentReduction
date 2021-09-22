import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FrontPage from './components/FrontPage/FrontPage';
import Confirm from './components/Onboarding/Confirmation/Confirm';
import Practice from './components/Practice/Practice';
import store from './store';
import "./App.css";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={FrontPage}/>
        <Route path='/practice' render={({match}) => <Practice />}/>
        <Route path='/confirm/:id' render={({match}) => <Confirm id={match.params.id} />}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
