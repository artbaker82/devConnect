import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
//navbar and Landing are named components, so they need to be wrapped in brackets
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/alert";
import { loadUser } from "./actions/auth";
//redux
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //empty brackets in dependancy array ensures that the effect only runs once. when the component is mounted
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
