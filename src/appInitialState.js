const appInitialState = {
  subReddits: [
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

export default appInitialState
