/* eslint-disable no-unused-vars */
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
    // We don't want a link if it's on reddit since
    // we already have two others in title and comments
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
    let parsedURL = url.replace('https://', '')
    if (parsedURL.startsWith('www.reddit.com/r/')) {
      return null
    }
    if (parsedURL.length > 20) {
      parsedURL = parsedURL.substring(0, 20) + '…'
    }
    return (
      <a className={css.linkHost} href={url} >
        <span>{parsedURL}</span>
        <IconGoTo className={css.iconGoTo} />
      </a>
    )
  }

  render () {
    const { postContent, handleBookmark, isBookmark } = this.props
    const { score, thumbnail, url, title, author, permalink, id } = postContent
    const commentsCount = postContent.num_comments
    const createdUTC = postContent.created_utc
    return (
      <article className={`${css.post}`}>
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
            <a href={'https://www.reddit.com' + permalink}>{title}</a>
          </h2>
          {this.sanitizeHostName(url)}
          <div>
            Posted by&nbsp;
            <a
              className={css.author}
              href={'https://www.reddit.com/user/' + author}
            >u/{author}</a>
            <span> • {this.sanitizeCreatedAt(createdUTC)}</span>
          </div>
          <div className={css.thirdRow}>
            <a className={css.comments} href={'https://www.reddit.com' + permalink}>
              <IconComments className={css.iconComments} />
              {this.sanitizeComments(commentsCount)}
            </a>
            <button
              type='button'
              className={isBookmark ? `${css.save} ${css.isBookmark}` : css.save}
              onClick={() => handleBookmark(id, isBookmark)}
            >
              <IconStars className={css.iconStars} />
              <span>{isBookmark ? 'unsave' : 'save'}</span>
            </button>
          </div>
        </div>
      </article>
    )
  }

  static propTypes = {
    postContent: PropTypes.object.isRequired,
    handleBookmark: PropTypes.func.isRequired,
    isBookmark: PropTypes.bool,
  }
}

const IconArrow = (props) => (
  <svg {...props} version='1.1' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
    <polygon points='0,336.966 229.784,336.966 229.784,488.925 512,256 229.784,23.076 229.784,175.039 0,175.039 ' />
  </svg>
)

const IconGoTo = (props) => (
  <svg {...props} viewBox='0 0 465 400' xmlns='http://www.w3.org/2000/svg'>
    <path d='m345.375 3.410156c-2.863281-2.847656-7.160156-3.695312-10.890625-2.144531s-6.164063 5.191406-6.164063 9.234375v53.359375c-54.003906 2.152344-81.054687 24.535156-85.191406 28.261719-27.25 22.363281-45.855468 53.527344-52.613281 88.121094-3.378906 16.714843-3.984375 33.871093-1.785156 50.78125l.007812.058593c.019531.148438.042969.300781.066407.449219l2.125 12.214844c.714843 4.113281 3.914062 7.351562 8.019531 8.117187 4.109375.765625 8.257812-1.105469 10.40625-4.683593l6.367187-10.613282c19.5625-32.53125 43.941406-54.09375 72.46875-64.089844 12.867188-4.546874 26.5-6.546874 40.128906-5.882812v55.265625c0 4.046875 2.441407 7.699219 6.183594 9.242187 3.746094 1.546876 8.050782.679688 10.90625-2.191406l105.675782-106.210937c3.894531-3.914063 3.878906-10.246094-.035157-14.140625zm0 0' />
    <path d='m417.351562 294.953125c-5.519531 0-10 4.476563-10 10v42.265625c-.015624 16.558594-13.4375 29.980469-30 30h-327.351562c-16.5625-.019531-29.980469-13.441406-30-30v-238.246094c.019531-16.5625 13.4375-29.980468 30-30h69.160156c5.523438 0 10-4.476562 10-10 0-5.523437-4.476562-10-10-10h-69.160156c-27.601562.03125-49.96875 22.398438-50 50v238.246094c.03125 27.597656 22.398438 49.964844 50 50h327.351562c27.601563-.035156 49.96875-22.402344 50-50v-42.265625c0-5.523437-4.476562-10-10-10zm0 0' />
  </svg>
)

const IconComments = (props) => (
  <svg {...props} viewBox='0 0 442 344' xmlns='http://www.w3.org/2000/svg'>
    <path d='m125.433594 195.023438v-129.324219h-105.433594c-11.039062.011719-19.9882812 8.960937-20 20v181c.0117188 11.042969 8.960938 19.988281 20 20h21.8125c5.519531 0 10 4.476562 10 10v46.753906l85.488281-55.152344c1.613281-1.042969 3.496094-1.601562 5.421875-1.601562h106.058594c11.042969-.011719 19.988281-8.957031 20-20v-31.675781h-103.347656c-22.082032-.023438-39.976563-17.917969-40-40zm0 0' />
    <path d='m422 0h-256.566406c-11.042969.0117188-19.988282 8.960938-20 20v175.023438c.011718 11.039062 8.957031 19.988281 20 20h141.222656c2.304688 0 4.539062.796874 6.324219 2.253906l79.289062 64.707031v-56.960937c0-5.523438 4.480469-10 10-10h19.730469c11.039062-.011719 19.988281-8.960938 20-20v-175.023438c-.011719-11.039062-8.960938-19.9882812-20-20zm0 0' />
  </svg>
)

const IconStars = (props) => (
  <svg {...props} viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'>
    <g>
      <path d='M121.215,44.212l-34.899-3.3c-2.2-0.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101,0l-12.4,30.3c-0.8,2.1-2.8,3.5-5,3.7l-34.9,3.3c-5.2,0.5-7.3,7-3.4,10.5l26.3,23.1c1.7,1.5,2.4,3.7,1.9,5.9l-7.9,32.399c-1.2,5.101,4.3,9.3,8.9,6.601l29.1-17.101c1.9-1.1,4.2-1.1,6.1,0l29.101,17.101c4.6,2.699,10.1-1.4,8.899-6.601l-7.8-32.399c-0.5-2.2,0.2-4.4,1.9-5.9l26.3-23.1C128.615,51.212,126.415,44.712,121.215,44.212z' />
    </g>
  </svg>
)

export default Post
