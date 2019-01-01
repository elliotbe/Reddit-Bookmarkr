import React from 'react'
import axios from 'axios'

import Header from './Components/Header'
import Message from './Components/Message'
import BookmarksList from './Components/BookmarksList'
import PostsList from './Components/PostsList'
import bound from './helpers/bound-decorator'
import './style.styl'

class App extends React.Component {
  state = {
    subreddits: [
      {
        name: 'popular',
        color: '#232d12',
        postsList: [],
      },
      {
        name: 'favorites',
        color: '#da3287',
        postsList: [],
      },
      {
        name: 'askreddit',
        color: '#773000',
        postsList: [],
      },
      {
        name: 'reactjs',
        color: '#2a2a43',
        postsList: [],
      },
      {
        name: 'pathofexile',
        color: '#511251',
        postsList: [],
      },
    ],
    selected: 0,
    isLoading: false,
    isError: false,
  }

  componentDidMount () {
    this.getFromLocalStorage('all')
    // setTimout is used to avoid fetching subreddit[0]
    // every time the component mount
    setTimeout(() => { this.state.selected === 0 && this.fetchPostsList() }, 0)
  }

  componentDidUpdate (prevProps, prevState) {
    const changedSub = prevState.selected !== this.state.selected
    if (changedSub && this.state.selected === 1) {
      this.getFromLocalStorage('bookmarks')
    }
    if (changedSub && this.state.selected !== 1) {
      this.fetchPostsList()
    }
    this.setLocalStorage()
  }

  fetchPostsList () {
    this.setState({
      isLoading: true,
      isError: false,
    })

    const { selected, subreddits } = this.state
    const index = selected
    const name = subreddits[index].name

    // don't refetch twice if data are laready in state
    if (this.state.subreddits[index].postsList.length !== 0) {
      this.setState({ isLoading: false, })
    } else {
      ;(async () => {
        try {
          // raw_json is required by redditAPI
          // to avoid escaped chars in the response
          const response = await axios({
            url: `https://www.reddit.com/r/${name}.json?limit=25`,
            params: { raw_json: 1 }
          })
          const posts = response.data.data.children.map(post => post.data)
          this.setState(state => { state.subreddits[index].postsList = posts })
          this.setState({ isLoading: false, })
        } catch (error) {
          this.setState({ isLoading: false, isError: true, })
        }
      })()
    }
  }

  getFromLocalStorage (key) {
    this.setState({ isError: false })
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    const selected = parseInt(localStorage.getItem('selected')) || 0
    const subreddits = JSON.parse(localStorage.getItem('subreddits'))
    if (key === 'all') {
      this.setState({ selected: selected })
      subreddits !== null && this.setState({ subreddits: [ ...subreddits ] })
    }
    bookmarks !== null && this.setState(state => {
      state.subreddits[1].postsList = bookmarks
    })
  }

  setLocalStorage () {
    const { subreddits, selected } = this.state
    const subList = subreddits.map(sub => ({
      name: sub.name,
      color: sub.color,
      postsList: [],
    }))
    localStorage.setItem('selected', selected)
    localStorage.setItem('subreddits', JSON.stringify(subList))
    localStorage.setItem('bookmarks', JSON.stringify(subreddits[1].postsList))
  }

  displayContent () {
    const { isError, isLoading, selected, subreddits } = this.state
    const { postsList } = subreddits[selected]
    if (isLoading) return <Message label='loading' />
    if (isError) return <Message label='error' />
    if (selected === 1 && postsList.length === 0) {
      return <Message label='emptyBookmarks' />
    }
    if (selected === 1) {
      return (
        <BookmarksList
          content={postsList}
          handleBookmark={this.handleBookmark}
        />
      )
    }
    if (postsList.length === 0) return <Message label='empty' />
    if (selected !== 1) {
      return (
        <PostsList
          content={postsList}
          handleBookmark={this.handleBookmark}
        />
      )
    }
  }

  @bound handleSelect (event) {
    const index = this.state.subreddits
      .findIndex(elem => elem.name === event.target.value)
    this.setState({ selected: index })
  }

  @bound handleNewSub (event) {
    const newSubName = event.target.input.value
    const index = this.state.subreddits
      .findIndex(sub => sub.name === newSubName)

    event.preventDefault()
    event.target.input.value = ''

    if (index !== -1) {
      return this.setState({ selected: index })
    }

    function assignColor () {
      const colorArray = [
        '#330136', '#9C031B', '#962E40', '#C9463D', '#FF5E35', '#355C7D',
        '#6C5B7B', '#140A25', '#10272F', '#054549', '#0A597A', '#0BC7B1',
      ]
      return colorArray[Math.round(Math.random() * (colorArray.length - 1))]
    }

    const newSub = {
      name: newSubName,
      color: assignColor(),
      postsList: [],
    }

    this.setState({
      selected: this.state.subreddits.length,
      subreddits: [
        ...this.state.subreddits,
        newSub,
      ],
    })
  }

  @bound handleRemoveSubs (event) {
    const { subreddits, selected } = this.state
    if (subreddits.length < 3) {
      return alert('You are not supposed to delete this')
    }
    if (selected === subreddits.length - 1) {
      this.setState({ selected: selected - 1 })
    }
    this.setState({
      subreddits: [ ...subreddits.slice(0, subreddits.length - 1) ]
    })
  }

  @bound handleBookmark (id, isBookmark) {
    const { selected, subreddits } = this.state
    const postIndex = subreddits[selected].postsList
      .findIndex(item => id === item.id)
    const isAlreadyBookmarked = subreddits[1].postsList
      .find(item => id === item.id)

    // We need to change state to set local storage
    this.setState(state => (
      state.subreddits[selected].postsList[postIndex].saved = true
    ))

    if (isBookmark) {
      this.setState(state => {
        state.subreddits[1].postsList = subreddits[1].postsList
          .filter(item => id !== item.id)
      })
    }

    if (!isAlreadyBookmarked) {
      this.setState(state => {
        state.subreddits[1].postsList
          .unshift(subreddits[selected].postsList[postIndex])
      })
    }
  }

  render () {
    const { subreddits, selected, } = this.state
    const { name, color, } = subreddits[selected]
    const subsList = this.state.subreddits.map(sub => sub.name)

    return (
      <>
        <Header
          subsList={subsList}
          name={name}
          bgColor={color}
          handleSelect={this.handleSelect}
          handleRemoveSubs={this.handleRemoveSubs}
          handleNewSub={this.handleNewSub}
        />
        <section className={'section'}>
          {this.displayContent()}
        </section>
      </>
    )
  }
}

export default App
