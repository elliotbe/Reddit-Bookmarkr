import React from 'react'
import PropTypes from 'prop-types'

import Post from './Post'

class PostsList extends React.Component {
  render () {
    return (
      <ul className='list'>
        {this.props.content.map(post => (
          <li key={post.id} className='list-item'>
            <Post
              postContent={post}
              handleBookmark={this.props.handleBookmark}
            />
          </li>
        ))}
      </ul>
    )
  }

  static propTypes = {
    content: PropTypes.array.isRequired,
    handleBookmark: PropTypes.func.isRequired,
  }
}

export default PostsList
