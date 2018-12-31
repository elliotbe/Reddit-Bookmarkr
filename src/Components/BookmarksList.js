import React from 'react'
import PropTypes from 'prop-types'
import MuuriGrid from 'react-muuri'

import Post from './Post'
import css from './PostsList.module.styl'
import bound from '../helpers/bound-decorator'
import './css-muuri.styl'

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
    if (localStorage.getItem('bookmarkItems') !== null) {
      const sortOrder = localStorage.getItem('bookmarkItems').split(',')
      let itemArray = []
      sortOrder.forEach(id => {
        const grid = this.grid.getMethod('getItems')
        const item = grid.find(item => id === item._element.dataset.id)
        if (item !== undefined) {
          this.grid.getMethod('remove', item, { removeElements: true })
          itemArray.push(item._element)
        }
      })
      this.grid.getMethod('add', itemArray, { layout: 'instant' })
    }
  }

  componentDidUpdate () {
    this.grid.getMethod('on', 'move', (data) => {
      this.grid.getMethod('synchronize')
      const sortOrder = this.grid.getMethod('getItems')
        .map(elem => elem._element.dataset.id)
      localStorage.setItem('bookmarkItems', sortOrder)
    })
  }

  componentWillUnmount () {
    this.grid.getMethod('destroy')
  }

  @bound
  hookHandleBookmark (id) {
    this.props.handleBookmark(id)
    const gridItemArray = this.grid.getMethod('getItems')
    const index = gridItemArray
      .findIndex(elem => elem._element.dataset.id === id)

    this.grid.getMethod('remove', this.gridElement.children[index])
  }

  render () {
    const { content } = this.props
    return (
      <section className={css.section}>
        <ul ref={gridElement => { this.gridElement = gridElement }} className={`grid ${css.list}`}>
          {content.map(post => (
            <li data-id={post.id} key={post.id} className={`item ${css.listItem}`}>
              <Post
                postContent={post}
                handleBookmark={this.hookHandleBookmark}
              />
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

export default BookmarksList
