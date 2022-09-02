import React, { useEffect, useState } from 'react'
import {Title, Subtitle,    MediaLeft, MediaContent,  Image, CardContent, CardFooterItem, card, Section, Column, Columns, Modal, ModalBackground, ModalContent, ModalClose} from 'bloomer'
import { Loader, Card, Block, Content, Box, Button, Form, Container } from 'react-bulma-components'
import { DateTime } from 'luxon'
import { CardFooter } from 'bloomer/lib/components/Card/Footer/CardFooter'
import axios from 'axios'
import PostComments from './PostComments'
import { MdLogin  } from "react-icons/md";
import {FaCommentAlt, FaThumbsDown, FaArrowAltCircleDown, FaArrowAltCircleUp, FaThumbsUp, FaRegCommentAlt, FaEdit, FaTrash} from 'react-icons/fa'

function MyProfilePost(props) {
    //Props
    const userId = props.userId
    const token = props.token
    const updatePosts = props.updatePosts

    //states
    const [post, setPost] = useState(props.post)
    const [like, setLike] = useState()
    const [commentsModal, setCommentsModal] = useState('')
    const [postContent,setPostContent] = useState(props.post.content)

    //API URLS
    const postURL = `http://localhost:3000/api/posts/${post._id}`
    const likeURL = `http://localhost:3000/api/posts/${post._id}/like`
    const unlikeURL = `http://localhost:3000/api/posts/${post._id}/unlike`
    
    //check if user liked current post
    const alreadyLiked = post.likes.indexOf(userId)
    useEffect(() => {
        if (alreadyLiked == -1) {
            setLike(<a onClick={likeFn}><FaThumbsUp/> Like</a>)
        } else {
            setLike(<a onClick={unlikeFn}><FaThumbsDown/> Unlike</a>)
        }
    },[])

    //pass to comment and updates post when a new comment is submitted
    const updatePost = () => {
        axios.get(postURL, {headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                setPost(response.data)
            })
    }

    //like and switch like to unlike after click
    const likeFn = () => {
        axios.put(likeURL, '', {headers: {"Authorization": `Bearer ${token}`}})
        .then(() => {
            axios.get(postURL, {headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                setPost(response.data)
                setLike(<a onClick={unlikeFn}><FaThumbsDown/> Unlike</a>)
            })
        })
    }

    //unlike and switch unlike to like after click
    const unlikeFn = () => {
        axios.put(unlikeURL, '', {headers: {"Authorization": `Bearer ${token}`}})
        .then(() => {
            axios.get(postURL, {headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                setPost(response.data)
                setLike(<a onClick={likeFn}><FaThumbsUp/> Like</a>)
            })
        })
    }

    const toggleCommentsModal = () => {
        if (!commentsModal) {
            setCommentsModal('is-active')
        } else {
            setCommentsModal(null)
        }
        
    }

    const [updateLoading,setUpdateLoading] = useState()
    const [editModal, setEditModal] = useState(null)
    const toggleEditModal = () => {
        if (!editModal) {
            setEditModal('is-active')
        } else {
            setEditModal(null)
        }
        
    }

    const postEdit = (e) => {
        setPostContent(e.target.value)
    }

    const submitEdit = () => {

    }

    const cancelEdit = () => {
        setPostContent(post.content)
        toggleEditModal()
    }


    //* delete post

    const postDelete = () => {
        const deleteURL = `http://localhost:3000/api/posts/${post._id}`
        axios.delete(deleteURL, {headers: {"Authorization": `Bearer ${token}`}})
        .then((response) => {
            updatePosts()
        })
    }

  return (
    <div>
        <div>
            <Block>
            <Card>
                <CardContent>

                    <Content>
                        {post.content}
                        <br/>
                    </Content>
                    <Content >
                        <small>{post.likes.length} Likes</small> / <small>{post.comments.length} Comments</small>
                        <div className='help'>Posted on: {DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}</div>   
                    </Content>
                </CardContent>
                <CardFooter>
                    <CardFooterItem>
                        {like}
                    </CardFooterItem>
                    
                    <CardFooterItem>
                        <a onClick={toggleCommentsModal}><FaCommentAlt/> Comments</a>
                    </CardFooterItem>
                    <CardFooterItem>
                        <a onClick={toggleEditModal}><FaEdit/> Edit</a> 
                    </CardFooterItem>
                    <CardFooterItem>
                        <a onClick={postDelete}><FaTrash/> Delete</a>
                    </CardFooterItem>
                </CardFooter>
            </Card>
            </Block>
        </div>
        <div className={`modal ${commentsModal}`}>
            <div className="modal-background" onClick={toggleCommentsModal}></div>
                <div className="modal-content">
                    <PostComments postId={post._id} userId={userId} token={token} updatePost={updatePost}/>
                </div>
            <button onClick={toggleCommentsModal} className="modal-close is-large" aria-label="close"></button>
        </div>
        

        <div className={`modal ${editModal}`}>
            <div className="modal-background" onClick={toggleEditModal}></div>
                <div className="modal-content">
                <Box>

                    
                    <Form.Field >
                      <Form.Field.Label>
                        <Form.Label textAlign={'left'}>
                          Post content:
                        </Form.Label>
                      </Form.Field.Label>
                      <Form.Field.Body>
                        <Form.Field>
                          <Form.Control>
                            <Form.Textarea
                              value={postContent}
                              placeholder=""
                              type="text"
                              name='content'
                              onChange={postEdit}
                            />
                          </Form.Control>
                        </Form.Field>
                      </Form.Field.Body>
                    </Form.Field>

                    
                    <Block></Block>
                    <Container display='flex' justifyContent='space-around'>
                    <Button color={'success'} loading={updateLoading} onClick={submitEdit}>Save</Button>
                    <Button color={'danger'} onClick={cancelEdit}>Cancel</Button>
                    </Container>
                    

                    </Box>

                </div>
            <button onClick={toggleEditModal} className="modal-close is-large" aria-label="close"></button>
        </div>









    </div>
  )
}

export default MyProfilePost