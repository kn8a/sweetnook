import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Block } from 'react-bulma-components'
import { toast } from 'react-toastify'
import UserCard from '../components/UserCard'
import ReqRecCard from '../components/RecReqCard'

function ReceivedRequests() {

  const receivedURL = 'http://localhost:3000/api/requests/received'
  const token = localStorage.getItem('palstalkToken')
  const userId = localStorage.getItem('palstalkUserId')
  


  const [requests, setRequests] = useState([])

  
  
  
  
  useEffect(() => {
    axios.get(receivedURL, {headers: {"Authorization": `Bearer ${token}`}})
      .then((response) => {
      setRequests(response.data)
      console.log(response.data)
  }) 
  }, [])

  const updateRequests = ()=> {
    axios.get(receivedURL, {headers: {"Authorization": `Bearer ${token}`}})
      .then((response) => {
      setRequests(response.data)
  })}

  return (
    <div>
    <Block></Block>
    <Block display='flex' flexDirection='row' id='friends-container' flexWrap='wrap'>
        {requests.map((req) => {
            return (<ReqRecCard updateRequests={updateRequests} key={req._id} request={req}/>)
        })}
    </Block>
    </div>
    
  )
}

export default ReceivedRequests