import React from 'react'
import PropTypes from 'prop-types'

import css from './Message.module.styl'

class Message extends React.Component {
  render () {
    const { label, } = this.props
    const message = {
      loading: 'Loading…',
      error: 'Are you sure this Subreddit exist ?',
      emptyBookmarks: 'Try starring some posts first',
      empty: 'There seems to be nothing here',
    }
    return (
      <strong className={css.message}>{message[label]}</strong>
    )
  }

  static propTypes = {
    label: PropTypes.oneOf([
      'loading',
      'error',
      'emptyBookmarks',
      'empty',
    ]).isRequired,
  }
}

export default Message
