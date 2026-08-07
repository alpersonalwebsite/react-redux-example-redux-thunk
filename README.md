# React and Redux with redux-thunk

[![CircleCI](https://circleci.com/gh/alpersonalwebsite/react-redux-example-redux-thunk.svg?style=shield)](https://circleci.com/gh/alpersonalwebsite/react-redux-example-redux-thunk)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

An easy, basic and raw (no styles attached) example of **HOW to** do async work in
`redux` with `redux-thunk`. It fetches a list of users and renders it, which is the
smallest thing that actually needs async middleware.

## Why middleware is needed at all

`dispatch` takes a plain object. That is the whole contract, and it is why a reducer
can be a pure function you can reason about. But a fetch is not a plain object: it
starts, it takes time, and it ends in one of two ways.

`redux-thunk` widens `dispatch` to also accept a **function**. When you dispatch one,
the middleware calls it with `dispatch` instead of passing it to the reducers, so an
action creator can be async and can dispatch more than once:

```js
export const fetchUsers = () => async dispatch => {
  try {
    const response = await axios.get(API, { params: { limit: 10 } })
    return dispatch({ type: FETCH_USERS, payload: readUsers(response.data) })
  } catch (err) {
    return dispatch({ type: FETCH_USERS_FAILED, payload: err.message })
  }
}
```

Two outcomes, both of them a plain object by the time they reach the reducer. The
reducer stays pure and the component stays dumb: it dispatches once in
`componentDidMount` and renders whatever the store says.

| File | Role |
| --- | --- |
| `src/actions/index.js` | the thunk: async, dispatches success or failure |
| `src/actions/types.js` | the two action type constants |
| `src/reducers/usersReducer.js` | `{ items, loading, error }`, pure |
| `src/index.js` | `applyMiddleware(reduxThunk)`, devtools in development only |
| `src/App.js` | `connect`ed, dispatches on mount, renders three states |

Sibling repos implement the same app with
[redux-promise](https://github.com/alpersonalwebsite/react-redux-example-redux-promise)
and
[redux-saga](https://github.com/alpersonalwebsite/react-redux-example-redux-saga),
so the diff between them is the lesson.

## Two mistakes this repo used to make

**The reducer appended instead of replacing.** `case FETCH_USERS: return [...state,
...action.payload]`. One mount hides it; anything that dispatches twice shows every
user twice. Measured on the old reducer with a two-user payload: `[]` → `[1,2]` →
`[1,2,1,2]` → `[1,2,1,2,1,2]`. A `FETCH_USERS` payload is the current answer to "who
are the users", not an increment of it.

**Failures went to the console.** The `catch` was `console.log('err', err)`, so a dead
endpoint left the store untouched and the UI rendered an empty list, which looks
exactly like a successful fetch that returned nobody. There is a `FETCH_USERS_FAILED`
action now, `error` lives in the store next to `items`, and the component renders it
with a Retry button.

## Pointing it at an API

`REACT_APP_API_URL`, defaulting to `http://localhost:3333/api/users`, which is
[node-express-postgresql](https://github.com/alpersonalwebsite/node-express-postgresql)
running locally. That is the project the original hardcoded endpoint
(`node-express-postgre.herokuapp.com`) was serving, before Heroku retired its free
dynos and the host started answering `404 No such app`.

```shell
cp .env.example .env      # then edit it, .env is gitignored
```

Only variables prefixed `REACT_APP_` reach the bundle, and Create React App **inlines
them at build time**, so whatever you put there ends up in `build/static/js/*.js`. An
endpoint URL is fine. A key or a token is not.

`readUsers` accepts both a bare array and a `{ "data": [ ... ] }` wrapper, but the
field names are not negotiable: `App.js` renders `firstname` and `lastname` and keys
on `id`, matching the backend above.

## Installation

```shell
npm ci
```

`npm ci` rather than `npm install`, so you get exactly what `package-lock.json` pins.

There is an `.npmrc` setting `legacy-peer-deps=true`, and it is load-bearing. `eslint`
is pinned at `^5.16.0` while `eslint-config-standard@^13.0.1` declares a peer of
`eslint >= 6.0.1`. npm 6, which this project was written against, ignored peer
conflicts. npm 7 and later refuse to install at all:

```
npm error Conflicting peer dependency: eslint
npm error peer eslint@">=6.0.1" from eslint-config-standard@13.0.1
```

The two do work together in practice, so the `.npmrc` restores the npm 6 behaviour
rather than moving either pin, since bumping `eslint` would be a dependency upgrade
and this repo deliberately keeps its 2019 versions.

## Running the dev server

```shell
npm start
```

## Tests and lint

```shell
npm test
npm run lint
```

The test wraps `App` in a `<Provider>`. It did not, so it had never passed:
`Could not find "store" in the context of "Connect(App)"`. CI worked around that by
commenting out the test step rather than fixing the test.

## Building

```shell
npm run build
```

**On Node 17 or newer this fails** with `ERR_OSSL_EVP_UNSUPPORTED`. That is webpack 4
(via `react-scripts` 3) using an MD4 hash that OpenSSL 3 no longer provides, not a
problem with this code. The dependencies here are deliberately left at their versions,
so pass the flag instead:

```shell
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

CI does **not** set `CI=false`. Create React App treats warnings as errors when `CI`
is set, and that is wanted: the warnings that setting used to hide were real ones.
