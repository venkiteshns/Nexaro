import React from 'react'
import {useSelector} from 'react-redux'

const PosterDasboard = () => {

  const user = useSelector((state) => state.auth.user)
  console.log(user)
  return (
    <div>
      <h1>Hello {user.name}</h1>
      <p>Your Email: {user.email}</p>
      <p>Id: {user.id}</p>

    </div>
  )
}

export default PosterDasboard