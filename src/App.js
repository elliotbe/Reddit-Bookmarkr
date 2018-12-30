/* eslint-disable no-unused-vars */
import React from 'react'
import axios from 'axios'

import Header from './Components/Header'
import PostsList from './Components/PostsList'
import appInitialState from './appInitialState'
import bound from './helpers/bound-decorator'

class App extends React.Component {
  state = {
    ...appInitialState,
  }

  fetchPostsList () {
    this.setState({
      isLoading: true,
      isError: false,
    })
    const index = this.state.selected
    const name = this.state.subReddits[index].name
    const url = `https://www.reddit.com/r/${name}.json?limit=25`

    // don't refetch twice
    if (this.state.subReddits[index].postsList.length !== 0) {
      return this.setState({ isLoading: false, })
    }

    ;(async () => {
      try {
        const response = await axios({
          url: url,
          // raw_json is required by redditAPI to avoid
          // getting a response with some escaped chars
          params: { raw_json: 1 }
        })

        const postsList = response.data.data.children
          .map(post => post.data)

        this.setState(state => {
          state.subReddits[index].postsList = postsList
        })
        this.setState({ isLoading: false, })
      } catch (error) {
        this.setState({ isLoading: false })
        if (!error.response) {
          return this.setState({ isError: 'offline' })
        }
        if (error.response.status === 404) {
          return this.setState({ isError: '404' })
        }
        this.setState({ isError: 'error' })
      }
    })()
  }

  getLocalStorage () {
    const subsList = JSON.parse(localStorage.getItem('subReddits'))
    const selected = parseInt(localStorage.getItem('selected')) || 0
    if (subsList !== null) {
      this.setState({
        selected,
        isError: false,
        subReddits: [
          ...subsList,
        ],
      })
    }
  }

  setLocalStorage () {
    const subsList = this.state.subReddits.map(sub => ({
      name: sub.name,
      color: sub.color,
      postsList: [],
    }))

    // Add only bookmarks to localStorage
    subsList[1].postsList = this.state.subReddits[1].postsList

    localStorage.setItem('selected', this.state.selected)
    localStorage.setItem('subReddits', JSON.stringify(subsList))
  }

  @bound
  handleSelect (event) {
    const index = this.state.subReddits
      .findIndex(elem => elem.name === event.target.value)
    this.setState({
      selected: index,
    })
  }

  @bound
  handleNewSub (event) {
    event.preventDefault()
    const newSubName = event.target.input.value
    event.target.input.value = ''
    const index = this.state.subReddits
      .findIndex(sub => sub.name === newSubName)

    if (index !== -1) {
      return this.setState({ selected: index, })
    }

    const assignColor = () => {
      const colorArray = [
        '#330136', '#9C031B', '#962E40', '#C9463D', '#FF5E35', '#355C7D',
        '#6C5B7B', '#140A25', '#10272F', '#054549', '#0A597A', '#0BC7B1',
      ]
      const index = Math.round(Math.random() * colorArray.length)

      return colorArray[index]
    }

    const newSub = {
      name: newSubName,
      color: assignColor(),
      postsList: [],
    }

    this.setState({
      selected: this.state.subReddits.length,
      subReddits: [
        ...this.state.subReddits,
        newSub,
      ],
    })
  }

  @bound
  handleRemoveSubs (event) {
    const { subReddits, selected } = this.state
    if (subReddits.length < 3) {
      return alert('You are not supposed to delete this')
    }
    if (selected === subReddits.length - 1) {
      this.setState({ selected: selected - 1 })
    }
    this.setState({
      subReddits: [ ...subReddits.slice(0, subReddits.length - 1) ]
    })
  }

  @bound
  handleBookmark (id) {
    const { selected, subReddits } = this.state
    const index = subReddits[selected].postsList
      .findIndex(item => id === item.id)
    const isSaved = subReddits[selected].postsList[index].saved
    const toogleSaved = subReddits[selected].postsList[index].saved === false

    this.setState(state => (
      state.subReddits[selected].postsList[index].saved = toogleSaved
    ))

    if (isSaved) {
      const newBookmarks = subReddits[1].postsList
        .filter(item => id !== item.id)

      return this.setState(state => (
        state.subReddits[1].postsList = newBookmarks
      ))
    }

    const isAlreadyInBookmark = subReddits[1].postsList
      .find(item => id === item.id)

    if (!isSaved && !isAlreadyInBookmark) {
      return this.setState(state => (
        state.subReddits[1].postsList
          .push(subReddits[selected].postsList[index])
      ))
    }
  }

  componentDidMount () {
    this.setState({ ...appInitialState, })
    ;(async () => {
      await this.getLocalStorage()
      if (this.state.selected === 0) {
        this.fetchPostsList()
      }
    })()
  }

  componentDidUpdate (prevProps, prevState) {
    this.setLocalStorage()
    const selectedChanged = prevState.selected !== this.state.selected
    if (selectedChanged && this.state.selected === 1) {
      return this.getLocalStorage()
    }
    if (selectedChanged) {
      this.fetchPostsList()
    }
  }

  render () {
    const index = this.state.selected
    const { name, color, postsList, } = this.state.subReddits[index]
    const subArray = this.state.subReddits.map(sub => sub.name)
    const { isLoading, isError, } = this.state
    const isBookmarkList = index === 1
    return (
      <>
        <Header
          subArray={subArray}
          name={name}
          bgColor={color}
          handleSelect={this.handleSelect}
          handleRemoveSubs={this.handleRemoveSubs}
          handleNewSub={this.handleNewSub}
        />
        {isBookmarkList && <BookmarksList />}
        {!isBookmarkList && (
          <PostsList
            content={postsList}
            handleBookmark={this.handleBookmark}
            isLoading={isLoading}
            isError={isError}
            isBookmarkList={index === 1}
          />
        )}
      </>
    )
  }
}

const BookmarksList = () => <div />

export default App
