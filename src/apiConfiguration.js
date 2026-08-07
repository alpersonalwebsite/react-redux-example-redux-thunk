// The API used to be hardcoded to https://node-express-postgre.herokuapp.com/users,
// which no longer exists: Heroku retired its free dynos and that host now answers 404
// with "No such app".
//
// Create React App exposes only REACT_APP_-prefixed variables to the bundle, and it
// inlines them at BUILD time, so a value here ends up in build/static/js/*.js in plain
// sight. Fine for an endpoint, not for a key or a token.
//
// The default is the local API from
// https://github.com/alpersonalwebsite/node-express-postgresql, the project the dead
// Heroku app was running. See the README for starting it.
export const API =
  process.env.REACT_APP_API_URL || 'http://localhost:3333/api/users'

export const limitUserResults = 10
export const offsetUserResults = 30

// node-express-postgresql answers { "data": [ ... ] }. The dead Heroku endpoint
// returned a bare array, and so do plenty of other APIs, so both are accepted: the
// first thing a reader does is point this somewhere else. Anything unrecognised
// becomes an empty list rather than a render error.
export const readUsers = body => {
  if (Array.isArray(body)) return body
  if (body && Array.isArray(body.data)) return body.data
  return []
}
