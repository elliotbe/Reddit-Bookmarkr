import React from 'react'
import PropTypes from 'prop-types'

import Message from './Message'
import Post from './Post'

import css from './PostsList.module.styl'

class PostsList extends React.Component {
  render () {
    const { content, isLoading, isError,
      handleBookmark, isBookmarkList } = this.props

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
          <Message label={isError} />
        </section>
      )
    }

    if (isBookmarkList && content.length === 0) {
      return (
        <section className={css.section}>
          <Message label='emptyBookmarks' />
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

    if (isBookmarkList) {
      return <BookmarksList content={content} handleBookmark={handleBookmark} />
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
    isBookmarkList: PropTypes.bool.isRequired,
  }
}

class BookmarksList extends React.Component {
  render () {
    const { content, handleBookmark } = this.props
    return (
      <section className={css.section}>
        <h2>Bookmarks</h2>
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
  }
}

export default PostsList
