import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
//this is the rootReducer
export default combineReducers({
  alert,
  auth,
  profile,
});
