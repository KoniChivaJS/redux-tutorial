import { Link } from 'react-router-dom'
import { selectAllPosts, fetchPosts } from './postsSlice'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from '../../components/Spinner'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButton'
const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
export const PostsList = () => {
  const dispatch = useDispatch()
  const postStatus = useSelector((state) => state.posts.status)
  const error = useSelector((state) => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])
  const posts = useSelector(selectAllPosts)

  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }
  const renderedPosts = orderedPosts.map((post) => {
    return (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content.substring(0, 100)}</p>

        <ReactionButtons post={post} />
        <Link to={`/posts/${post.id}`} className="button muted-button">
          View Post
        </Link>
      </article>
    )
  })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
