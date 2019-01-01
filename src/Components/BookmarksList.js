import React from 'react'
import PropTypes from 'prop-types'
import MuuriGrid from 'react-muuri'

import Post from './Post'
import bound from '../helpers/bound-decorator'

class BookmarksList extends React.Component {
  componentDidMount () {
    this.grid = new MuuriGrid({
      node: this.gridElement,
      defaultOptions: {
        dragEnabled: true,
        layoutOnResize: true,
        dragAxis: 'y',
      }
    })

    if (localStorage.getItem('boorkmarkOrder') !== null) {
      const sortOrder = localStorage.getItem('boorkmarkOrder').split(',')
      let itemArray = []
      sortOrder.forEach(id => {
        const ItemsArray = this.grid.getMethod('getItems')
        const item = ItemsArray.find(item => id === item._element.dataset.id)
        if (item !== undefined) {
          this.grid.getMethod('remove', item, { removeElements: true })
          itemArray.push(item._element)
        }
      })
      this.grid.getMethod('add', itemArray, { layout: 'instant' })
    }

    this.grid.getMethod('on', 'move', () => {
      const bookmarkOrder = this.grid.getMethod('getItems')
        .map(elem => elem._element.dataset.id)
      localStorage.setItem('boorkmarkOrder', bookmarkOrder)
    })
  }

  componentWillUnmount () {
    this.grid.getMethod('destroy')
  }

  @bound hookHandleBookmark (id) {
    this.props.handleBookmark(id)
    const gridItemArray = this.grid.getMethod('getItems')
    const index = gridItemArray
      .findIndex(elem => elem._element.dataset.id === id)

    this.grid.getMethod('remove', this.gridElement.children[index])
  }

  render () {
    return (
      <ul
        className='list'
        ref={gridElement => { this.gridElement = gridElement }}
      >
        {this.props.content.map(post => (
          <li
            data-id={post.id}
            key={post.id}
            className='list-item'
          >
            <Post
              postContent={post}
              handleBookmark={this.hookHandleBookmark}
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

export default BookmarksList
