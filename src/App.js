import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchUsers } from './actions'

class App extends Component {
  componentDidMount () {
    this.props.fetchUsers()
  }

  render () {
    const { users, error } = this.props

    if (error) {
      return (
        <div>
          <h1>List of Users</h1>
          <p style={{ color: '#b00020' }}>Could not load users: {error}</p>
          <p>
            This demo reads from{' '}
            <a href="https://github.com/alpersonalwebsite/node-express-postgresql">
              node-express-postgresql
            </a>
            . Start it locally, or point <code>REACT_APP_API_URL</code> at your own
            endpoint. See the README.
          </p>
          <button onClick={this.props.fetchUsers}>Retry</button>
        </div>
      )
    }

    return (
      <div>
        <h1>List of Users</h1>
        {users.length === 0 ? (
          <p>No users returned.</p>
        ) : (
          <ul>
            {/*
              Keyed on the user's id, not the array index. An index key tells React
              "the thing in slot 2 is the same thing it was before", which is false as
              soon as the list is reordered, filtered or prepended to, and it silently
              hands the wrong component state to the wrong row.
            */}
            {users.map(user => (
              <li key={user.id}>
                {user.firstname} {user.lastname}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

// The reducer now owns a shape rather than a bare array, so mapStateToProps unpacks it.
// Declared rather than silenced. plugin:react/recommended enables react/prop-types, and
// the lint script was not covering src/App.js at all (an unquoted `src/**/*.js` is not
// recursive in sh), so these went unreported. PropTypes is the 2019 answer to "what
// shape does this component expect", and it is worth having on a connected component in
// particular, because the props arrive from mapStateToProps rather than from a parent
// you can read.
App.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      firstname: PropTypes.string,
      lastname: PropTypes.string
    })
  ).isRequired,
  // null until something fails, so not required.
  error: PropTypes.string,
  fetchUsers: PropTypes.func.isRequired
}

const mapStateToProps = ({ users }) => ({
  users: users.items,
  error: users.error
})

export default connect(mapStateToProps, { fetchUsers })(App)
