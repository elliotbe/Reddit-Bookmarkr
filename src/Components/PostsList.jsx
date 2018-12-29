import React from 'react'
import PropTypes from 'prop-types'

import Message from './Message'
import Post from './Post'

import css from './PostsList.module.styl'

class PostsList extends React.Component {
  render () {
    const { content, isLoading, isError, } = this.props

    if (isLoading) {
      return (
        <section className={css.section}>
          <Message label='loading' />
        </section>
      )
    }

    if (isError) {
      return (
        <section className={css.section}>
          <Message label='error' />
        </section>
      )
    }

    if (content.length === 0) {
      return (
        <section className={css.section}>
          <Message label='empty' />
        </section>
      )
    }

    return (
      <section className={css.section}>
        <ul className={css.list}>
          {content.map(post => (
            <li key={post.id} className={css.listItem}>
              <Post postContent={post} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  static propTypes = {
    content: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
  }
}

export default PostsList
