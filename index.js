// Import stylesheets
import "./style.css";

const { createStore, applyMiddleware, combineReducers } = require("redux");
const thunk = require("redux-thunk").default;
const axios = require("axios");

// Write Javascript code!
const appDiv = document.getElementById("app");
appDiv.innerHTML = `<h1>JS Starter</h1>`;

//Constants
const USERS_REQUEST = "[USERS_REQUEST]";
const USERS_REQUEST_SUCCESS = "[USERS_REQUEST_SUCCESS]";
const USERS_REQUEST_FAILED = "[USERS_REQUEST_FAILED]";

//Constanst
const TODOS_REQUEST = "[TODOS TODOS_REQUEST]";
const TODOS_REQUEST_SUCCESS = "[TODOS TODOS_REQUEST_SUCCESS]";
const TODOS_REQUEST_FAILED = "[TODOS TODOS_REQUEST_FAILED]";

//Actions
const usersRequest = () => ({ type: USERS_REQUEST });

const usersRequestSuccess = usersIds => ({
  type: USERS_REQUEST_SUCCESS,
  payload: usersIds
});
const usersRequestFailed = error => ({
  type: USERS_REQUEST_FAILED,
  payload: error
});

const todosRequest = () => ({ type: TODOS_REQUEST });

const todosRequestSuccess = todos => ({
  type: TODOS_REQUEST_SUCCESS,
  payload: todos
});

const todosRequestFailed = error => ({
  type: TODOS_REQUEST_FAILED,
  payload: error
});

//Users State
const usersInitialState = {
  loading: false,
  usersIds: [],
  error: null
};

//User Reducer
const usersReducer = (state = usersInitialState, action) => {
  switch (action.type) {
    case USERS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case USERS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        usersIds: [...action.payload]
      };
    case USERS_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: { ...action.payload }
      };
    default:
      return state;
  }
};

//TODOS State
const todosInitialState = {
  loading: false,
  todos: [],
  error: null
};

const todosReducer = (state = todosInitialState, action) => {
  switch (action.type) {
    case TODOS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case TODOS_REQUEST_SUCCESS: {
      return {
        ...state,
        loading: false,
        todos: [...action.payload]
      };
    }
    case TODOS_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: { ...action.payload }
      };

    default:
      return state;
  }
};

//Async actions
const fetchUsers = () => async dispatch => {
  try {
    dispatch(usersRequest());
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    dispatch(usersRequestSuccess(data.map(user => user.id)));
  } catch (error) {
    dispatch(usersRequestFailed());
  }
};

const fetchTodos = () => async dispatch => {
  try {
    dispatch(todosRequest());
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    dispatch(todosRequestSuccess(data.map(todo => todo.title)));
  } catch (error) {
    dispatch(todosRequestFailed(error));
  }
};

//Combine reducers
const rootReducer = combineReducers({
  users: usersReducer,
  todos: todosReducer
});

//Create Store
const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(() => console.log(store.getState()));

store.dispatch(fetchUsers());
store.dispatch(fetchTodos())