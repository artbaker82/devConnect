import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
//this is the rootReducer
export default combineReducers({
  alert,
  auth,
});
