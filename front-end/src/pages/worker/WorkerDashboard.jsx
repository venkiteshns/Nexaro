import React from 'react'
import { useSelector } from 'react-redux'

const WorkerDashboard = () => {

const {user} = useSelector((state) => state.auth)

  console.log(user);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.role}</p>
      <img src={user.selfie} alt="" />

    </div>
  )
}

export default WorkerDashboard