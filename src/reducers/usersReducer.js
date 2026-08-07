import { FETCH_USERS, FETCH_USERS_FAILED } from '../actions/types'

const initialState = {
  items: [],
  loading: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    // REPLACE, not append. This used to be `[...state, ...action.payload]`, so every
    // fetch concatenated onto the previous one: dispatch fetchUsers twice and you saw
    // the same ten people twice, three times and you saw them three times. Measured on
    // the old reducer: [] -> [1,2] -> [1,2,1,2] -> [1,2,1,2,1,2]. A FETCH_USERS result
    // is the current answer to "who are the users", not an increment of it.
    case FETCH_USERS:
      return { ...state, items: action.payload, loading: false, error: null }

    case FETCH_USERS_FAILED:
      return { ...state, items: [], loading: false, error: action.payload }

    default:
      return state
  }
}
