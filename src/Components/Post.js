/* eslint no-unused-vars: 1 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import css from './Post.module.styl'

class Post extends React.Component {
  sanitizeNumber (number) {
    let parsedNumber = [ ...number.toString(), ]
    if (parsedNumber.length <= 3) {
      return number
    }
    parsedNumber.splice(-3, 0, '.')
    parsedNumber = parsedNumber.join('')
    parsedNumber = parseFloat(parsedNumber).toFixed(1) + 'k'
    parsedNumber = parsedNumber.replace('.', ',')
    return parsedNumber
  }

  sanitizeThumbnail (imgSrc, url) {
    switch (imgSrc) {
      case '':
        return null
      case 'self':
        imgSrc = 'https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/012011/reddit-logo2.png?itok=Jy9FhN43'
        break
      case 'default':
        imgSrc = 'https://cdn4.iconfinder.com/data/icons/web-app-media-contact-and-essential-simple-fill/512/Link_Share_Attache-512.png'
        break
      case 'nsfw':
        imgSrc = 'https://res.cloudinary.com/teepublic/image/private/s--jnmy6pb5--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_600,q_90,w_600/v1512038770/production/designs/2121975_1.jpg'
        break
      case 'image':
        imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAYFBMVEXa2tpVVVXd3d1MTExSUlK2trZvb29LS0tTU1Ph4eGNjY2cnJzU1NRaWlpgYGBPT0+np6fGxsavr6/AwMCGhoaioqJpaWnMzMx+fn6UlJS7u7t1dXWzs7NERERkZGSdnZ1LtC8/AAACkElEQVR4nO3b626qQBRAYeYiM2NVVPCCWvv+b3lEUUDhpIpJ42Z9/0qFOCsTYFCjCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCPqN/nosr9Grdfw+4a+H8xL95bx9F/+pDRL1PjSgAQ0kNLDOuFeZxHgBDZJ8N+phNxPQwCxDn3ujMPMCGsx7vX0hDXrd54pokDzZ4G5pMLwGWqfL5aa+w+Aa6EV8upDarLZpaA30wtvzKWRfbRtcg315Z+mqfYbWYHO9ufbxUBvokbmuDqaiG/wvSHprMJPcQI+2nRV0VK4NVJLdhiyxwdqNO4ej59+X04HfCJ4HemmUybsj5C7xiVG76hXyGkTH04jMT3eENIvjfBOqXcQ10KvzWc+tuiPoEEJ9ySCuQTS9DKh4ptB4afdRpDUIeVI+GXOH+pj0rjuCtAaT6+VfeVsf9kRtO6eCsAYhqz1odmk1PbIkWU86IshqoDemSqDsdHHb7k5/HjftEYQ12DY+b7C2HHXYFwtmm6StwxTVQKdONdjZOYI+XKaH9cu2cYpqEGKr7iNMin+Ug+y4bZDUoLYwvinOhPqr2m7Gj+cESQ2itX9ooGwcTWqbvXm8RgpqEOatH8Am26yx/TwzGkcR1ECrlmlQzIS7NHa2kNogrB7PBu1sfeEcSWowmf4yQbFD4xoppoFe/HYaFFweqlOjoAZPfSXFZAKfoTzZQJn9bQklqUH7ZaGDN6clVHl7KaeBnz4rvRxFTIPTheF5l6MIavAyGohpEHo5Cmjg9+M+8vIO86MbnJZFvSgJDd6DBjSgwUc3yL/NuzjzmQ2ixaHPl/abDh/64z5+3wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz/kH0Z07XHC7XZ8AAAAASUVORK5CYII='
        break
      default:
        break
    }

    if (url.includes('reddit.com/r/')) {
      return <img className={css.thumbnail} alt='thumbnail' src={imgSrc} />
    }

    return (
      <a href={url}>
        <img className={css.thumbnail} alt='thumbnail' src={imgSrc} />
      </a>
    )
  }

  sanitizeCreatedAt (timestamp) {
    return moment.unix(timestamp).fromNow()
  }

  sanitizeComments (count) {
    const parsedCount = this.sanitizeNumber(count)
    switch (count) {
      case 0: return 'comment'
      case 1: return count + ' comment'
      default: return parsedCount + ' comments'
    }
  }

  sanitizeHostName (url) {
    const parsedURL = url.replace('https://', '').substring(0, 18) + '…'

    if (parsedURL.startsWith('www.reddit.com/r/')) {
      return null
    }

    return (
      <a
        className={css.linkHost}
        href={url}
        target='_blank'
      >{parsedURL}</a>
    )
  }

  render () {
    const { postContent, handleBookmark } = this.props
    const { score, thumbnail, url, title,
      author, permalink, id, saved } = postContent
    const commentsCount = postContent.num_comments
    const createdUTC = postContent.created_utc

    const cssButton = {
      backgroundColor: 'var(--dark-gray)',
      color: 'white',
    }
    return (
      <article className={`item-content ${css.post}`}>
        <div className={css.scoreWrap}>
          <IconArrow className={css.iconUpArrow} />
          <div className={css.score}>
            {this.sanitizeNumber(score)}
          </div>
          <IconArrow className={css.iconDownArrow} />
        </div>
        <div className={css.thumbnailCell}>
          {this.sanitizeThumbnail(thumbnail, url)}
        </div>
        <div className={css.content}>
          <h2 className={css.postTitle}>
            <a href={'https://www.reddit.com' + permalink}
              target='_blank'
            >{title}</a>
          </h2>
          {this.sanitizeHostName(url)}
          <div>
            Posted by&nbsp;
            <a href={'https://www.reddit.com/user/' + author}>u/{author}</a>
            <span>{' ' + this.sanitizeCreatedAt(createdUTC)}</span>
          </div>
          <div>
            <a href={'https://www.reddit.com' + permalink}
              target='_blank'
            >{this.sanitizeComments(commentsCount)}</a>
            <button
              type='button'
              onClick={() => handleBookmark(id, this)}
              style={saved === true ? cssButton : null}
            >Stars</button>
          </div>
        </div>
      </article>
    )
  }

  static propTypes = {
    postContent: PropTypes.object.isRequired,
    handleBookmark: PropTypes.func.isRequired,
  }
}

const IconArrow = (props) => (
  <svg {...props} version='1.1' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
    <polygon points='0,336.966 229.784,336.966 229.784,488.925 512,256 229.784,23.076 229.784,175.039 0,175.039 ' />
  </svg>
)

export default Post
