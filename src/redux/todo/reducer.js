import { TODO_SUCCESS, TODO_UPDATE } from "./action";

export default function todoReducer(state = [], action) {
  switch (action.type) {
    case TODO_SUCCESS:
      return action.payload.todo;
    case TODO_UPDATE:
      return state.map(todo => {
        todo.title = action.payload;
        return todo;
      });
    default:
      return state;
  }
}
