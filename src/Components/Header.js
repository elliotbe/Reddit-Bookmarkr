import React from 'react'
import PropTypes from 'prop-types'

import css from './Header.module.styl'

class Header extends React.Component {
  render () {
    const { subsList, name, bgColor } = this.props
    const selectionList = subsList.map(sub => (
      <option className={css.option} key={sub}>
        {sub}
      </option>
    ))

    return (
      <header className={css.header} style={{ backgroundColor: bgColor }}>
        <div className={css.formSelect}>
          <label className={css.label} htmlFor='select'>
            Select subreddit
          </label>
          <select
            value={this.props.name}
            className={css.select}
            id='select'
            onChange={event => this.props.handleSelect(event)}
          >
            {selectionList}
          </select>
          <button
            type='button'
            title='Remove last subreddit from the list'
            className={css.button}
            onClick={event => this.props.handleRemoveSubs(event)}
          >
            <IconTrash className={css.iconTrash} />
          </button>
        </div>
        <h1 className={css.title}>r/{name}</h1>
        <form
          className={css.formInput}
          onSubmit={event => this.props.handleNewSub(event)}
        >
          <label className={css.label} htmlFor='input'>
            Add a subreddit name
          </label>
          <input
            className={css.input}
            type='text'
            placeholder='eg: pathofexile'
            id='input'
            autoComplete='off'
            ref='input'
          />
        </form>
      </header>
    )
  }

  static propTypes = {
    subsList: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleNewSub: PropTypes.func.isRequired,
    handleRemoveSubs: PropTypes.func.isRequired,
  }
}

const IconTrash = props => (
  <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 269 269'>
    <g>
      <path d='M63.119,250.254c0,0,3.999,18.222,24.583,18.222h93.072c20.583,0,24.582-18.222,24.582-18.222l18.374-178.66H44.746L63.119,250.254z M170.035,98.442c0-4.943,4.006-8.949,8.949-8.949c4.943,0,8.95,4.006,8.95,8.949l-8.95,134.238c0,4.943-4.007,8.949-8.949,8.949c-4.942,0-8.949-4.007-8.949-8.949L170.035,98.442zM125.289,98.442c0-4.943,4.007-8.949,8.949-8.949c4.943,0,8.949,4.006,8.949,8.949v134.238c0,4.943-4.006,8.949-8.949,8.949c-4.943,0-8.949-4.007-8.949-8.949V98.442z M89.492,89.492c4.943,0,8.949,4.006,8.949,8.949l8.95,134.238c0,4.943-4.007,8.949-8.95,8.949c-4.942,0-8.949-4.007-8.949-8.949L80.543,98.442C80.543,93.499,84.55,89.492,89.492,89.492zM218.36,35.811h-39.376V17.899C178.984,4.322,174.593,0,161.086,0L107.39,0C95.001,0,89.492,6.001,89.492,17.899v17.913H50.116c-7.914,0-14.319,6.007-14.319,13.43c0,7.424,6.405,13.431,14.319,13.431H218.36c7.914,0,14.319-6.007,14.319-13.431C232.679,41.819,226.274,35.811,218.36,35.811z M161.086,35.811h-53.695l0.001-17.913h53.695V35.811z' />
    </g>
  </svg>
)

export default Header
