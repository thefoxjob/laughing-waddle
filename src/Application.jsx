import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Index from './pages/Index';


const Application = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ Index } />
    </Switch>
  </BrowserRouter>
);

export default Application;
