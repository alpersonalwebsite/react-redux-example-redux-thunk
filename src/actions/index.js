import axios from 'axios'
import { FETCH_USERS, FETCH_USERS_FAILED } from './types'

import { API, limitUserResults, offsetUserResults, readUsers } from '../apiConfiguration'

export const headers = {
  Accept: 'application/json'
}

// A thunk is just a function that receives dispatch, which is the whole point of the
// middleware: the action creator gets to be async and to dispatch more than once.
// This one dispatches exactly one of two outcomes, so the store always ends up in a
// state the UI can render.
export const fetchUsers = () => async dispatch => {
  try {
    // params rather than `${API}?limit=...`: if REACT_APP_API_URL already carries a
    // query string, string concatenation produces a second '?' and the server sees one
    // malformed parameter. axios merges properly and encodes values.
    const response = await axios.get(API, {
      headers,
      params: { limit: limitUserResults, offset: offsetUserResults }
    })

    return dispatch({ type: FETCH_USERS, payload: readUsers(response.data) })
  } catch (err) {
    // Previously this was `console.log('err', err)` and nothing else, so a failed
    // request left the store exactly as it was and the UI showed an empty list with no
    // way to tell an outage from a genuinely empty result.
    return dispatch({ type: FETCH_USERS_FAILED, payload: err.message })
  }
}
