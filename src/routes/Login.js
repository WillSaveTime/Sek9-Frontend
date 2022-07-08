import React from 'react'
import { Card, Typography } from 'antd'
import LoginForm from 'views/auth-views/components/LoginForm'

export default function Login({ history }) {
  return (
    <Card style={{ minWidth: '40vw' }}>
      <Typography.Title>Sign In</Typography.Title>
      <Typography.Paragraph>
        Don't have an account yet? <a href="/signup">Sign Up</a>
      </Typography.Paragraph>
      <LoginForm
        otherSignIn={false}
        allowRedirect
        onSuccess={() => history.push('/')}
      />
    </Card>
  )
}
