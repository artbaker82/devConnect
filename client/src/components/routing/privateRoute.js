import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//desctructuring passed in component and rest of props passed down
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? <Redirect to='/login' /> : <Component {...props} />
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  //pulls in state from auth reducer
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
