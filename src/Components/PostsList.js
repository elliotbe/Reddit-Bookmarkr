import React from 'react'
import PropTypes from 'prop-types'

import Message from './Message'
import Post from './Post'

import css from './PostsList.module.styl'

class PostsList extends React.Component {
  render () {
    const { isLoading, isError, content, handleBookmark } = this.props

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
          <Message label={'error'} />
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
              <Post postContent={post} handleBookmark={handleBookmark} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  static propTypes = {
    content: PropTypes.array.isRequired,
    handleBookmark: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]).isRequired,
  }
}

export default PostsList
