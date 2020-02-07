import http from "../../services/httpService";

export const TODO_STARTED = "TODO_STARTED";
export const TODO_SUCCESS = "TODO_SUCCESS";
export const TODO_FAILURE = "TODO_FAILURE";
export const TODO_UPDATE = "TODO_UPDATE";

const addTodoStarted = () => ({
  type: TODO_STARTED
});

const addTodoSuccess = todo => ({
  type: TODO_SUCCESS,
  payload: {
    todo: todo
  }
});

const addTodoFailure = error => ({
  type: TODO_FAILURE,
  payload: {
    error
  }
});

export const addTodo = () => {
  return dispatch => {
    dispatch(addTodoStarted());
    http
      .get("https://jsonplaceholder.typicode.com/todos")
      .then(res => {
        const filterData = res.data.filter(data => {
          return data.userId % 2 === 0 && data.id % 2 === 0 ? data : false;
        });
        dispatch(addTodoSuccess(filterData));
      })
      .catch(err => {
        dispatch(addTodoFailure(err.message));
      });
  };
};

export const updateTodo = todo => ({
  type: TODO_UPDATE,
  payload: todo
});
