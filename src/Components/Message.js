import React from 'react'
import PropTypes from 'prop-types'

class Message extends React.Component {
  render () {
    const { label, } = this.props
    const message = {
      loading: 'Loading…',
      'offline': 'You seems to be offline',
      '404': 'Are you sure this Subreddit exist ?',
      error: 'There appears to be an error',
      emptyBookmarks: 'Try starring some posts first',
      empty: 'There seems to be nothing here',
    }

    const style = {
      fontSize: '32px',
      color: 'var(--light-gray)',
      textAlign: 'center',
    }

    return (
      <strong style={style}>{message[label]}</strong>
    )
  }

  static propTypes = {
    label: PropTypes.oneOf([
      'loading',
      'offline',
      '404',
      'error',
      'emptyBookmarks',
      'empty',
    ]).isRequired,
  }
}

export default Message
