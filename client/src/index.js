import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FrontPage from './components/FrontPage/FrontPage';
import Confirm from './components/Onboarding/Confirmation/Confirm';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={FrontPage}/>
        <Route path='/confirm/:id' render={({match}) => <Confirm id={match.params.id} />}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
