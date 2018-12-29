/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'

import css from './Header.module.styl'

class Header extends React.Component {
  render () {
    // console.log('Header render')
    const { subArray, name, bgColor, } = this.props
    const selectList = subArray.map(subName => (
      <option className={css.option} key={subName}>
        {subName}
      </option>
    ))

    // selectList.splice(1, 0,
    //   <option className={css.option} key='Favorites'>
    //     favorites
    //   </option>
    // )

    return (
      <header className={css.header} style={{ backgroundColor: bgColor, }}>
        <div className={css.formSelect}>
          <label className={css.label} htmlFor='select'>
            Select subbreddit
          </label>
          <select
            value={this.props.name}
            className={css.select}
            id='select'
            onChange={event => this.props.handleSelect(event)}
          >
            {selectList}
          </select>
          <button
            type='button'
            className={css.button}
            onClick={event => this.props.handleRemoveSubs(event)}
          >
            X
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
    subArray: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleNewSub: PropTypes.func.isRequired,
    handleRemoveSubs: PropTypes.func.isRequired,
  }
}

export default Header
