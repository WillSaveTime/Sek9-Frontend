import { message } from 'antd'
import React from 'react'
import LoginOne from '../login-1'

const Login = ({ history }) => {
  const handleSuccess = (member, redirect) => {
    if (member.type === 'ADMIN') {
      history.push(redirect)
    } else {
      message.error('You have not permission in admin site')
    }
  }
  return (
    <LoginOne
      allowRedirect={true}
      onSuccess={handleSuccess}
      otherSignIn={false}
      initialCredential={{
        email: 'admin@email.com',
        password: '123qweasd'
      }}
    />
  )
}

export default Login
