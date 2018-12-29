import React from 'react'
import PropTypes from 'prop-types'

class Message extends React.Component {
  render () {
    const { label, } = this.props
    const message = {
      loading: 'Loading...',
      error: 'There appears to be an error...',
      empty: 'There appears to be nothing here...',
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
      'error',
      'empty',
    ]).isRequired,
  }
}

export default Message
