/* eslint-disable no-unused-vars, eqeqeq */
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
    const url = `https://www.reddit.com/r/${name}/top.json?t=week&limit=100`

    // don't refetch twice
    if (this.state.subReddits[index].postsList.length !== 0) {
      return this.setState({ isLoading: false, })
    }

    ;(async () => {
      try {
        const response = await axios(url)
        const postsList = response.data.data.children
          .map(post => post.data)

        this.setState(state => {
          state.subReddits[index].postsList = postsList
        })
        this.setState({ isLoading: false, })
      } catch (error) {
        this.setState({
          isLoading: false,
          isError: true,
        })
      }
    })()
  }

  getLocalStorage () {
    const subsList = JSON.parse(localStorage.getItem('subReddits'))
    if (subsList !== null) {
      this.setState({
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

    localStorage.setItem('subReddits', JSON.stringify(subsList))
  }

  assignColor () {
    const colorArray = [
      '#330136', '#9C031B', '#962E40', '#C9463D', '#FF5E35', '#355C7D',
      '#6C5B7B', '#140A25', '#10272F', '#054549', '#0A597A', '#0BC7B1',
    ]
    const index = Math.round(Math.random() * colorArray.length)

    return colorArray[index]
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

    const newSub = {
      name: newSubName,
      color: this.assignColor(),
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
    console.log(event)
    // since we(re removeving all subs except popular and favorites
    // we also want to swith to one of this too
    const index = this.state.selected < 2 ? this.state.selected : 0
    console.log(index)
    this.setState({
      selected: index,
      subReddits: [
        ...this.state.subReddits.slice(0, 2),
      ],
    })
  }

  componentDidMount () {
    this.getLocalStorage()
    this.setState({ ...appInitialState, })
    this.fetchPostsList()
  }

  componentWillUnmount () {
    console.log('app unmount')
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('app update')
    this.setLocalStorage()
    if (this.state.selected === 1) {
      return
    }
    if (prevState.selected !== this.state.selected) {
      this.fetchPostsList()
    }
  }

  render () {
    // console.log('app render')
    const index = this.state.selected
    const { name, color, postsList, } = this.state.subReddits[index]
    const { isLoading, isError, } = this.state
    const subArray = this.state.subReddits.map(sub => sub.name)
    // console.log(subArray)
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
        <PostsList
          content={postsList}
          isLoading={isLoading}
          isError={isError}
        />
      </>
    )
  }
}

export default App
