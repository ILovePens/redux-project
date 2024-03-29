import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// Rooter
import {Router, Route, Switch} from 'react-router-dom';
import history from './history';
import { ConnectedRouter } from "connected-react-router";

//Components
import Connexion from './components/Connexion'
import App from './App';
import NotFound from './components/NotFound'

import store from './app/store';
import { Provider } from 'react-redux';
// import * as serviceWorker from './serviceWorker';

const baseURL = "/redux-project";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
			<Router history={history}>
				<Switch>
					<Route exact path={`${baseURL}/`} component={Connexion} />
					<Route path={`${baseURL}/pseudo/:pseudo`}  component={App} /> 
					<Route component={NotFound}/>
				</Switch>
			</Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
