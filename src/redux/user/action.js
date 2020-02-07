export const USER_UPDATE = "USER_UPDATE";
export const USER_UPDATE_NAME = "USER_UPDATE_NAME";

export function userUpdate(user) {
  return {
    type: USER_UPDATE,
    payload: {
      user: user
    }
  };
}

export function userUpdateName(newName) {
  return {
    type: USER_UPDATE_NAME,
    payload: {
      name: newName
    }
  };
}
