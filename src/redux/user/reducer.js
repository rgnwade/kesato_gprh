import { USER_UPDATE, USER_UPDATE_NAME } from "./action";

export default function userReducer(state = [], action) {
  switch (action.type) {
    case USER_UPDATE:
      return action.payload.user;
    case USER_UPDATE_NAME:
      return Object.assign({}, state, {
        name: action.payload.name
      });
    default:
      return state;
  }
}
