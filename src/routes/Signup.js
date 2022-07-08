import React from 'react'
import RegisterForm from 'views/auth-views/components/RegisterForm'
import { Card, Typography } from 'antd'

export default function Signup(props) {
  return (
    <Card>
      <Typography.Title>Sign Up</Typography.Title>
      <Typography.Paragraph>
        Do you have the account? <a href="/login">Sign in</a>
      </Typography.Paragraph>
      <RegisterForm />
    </Card>
  )
}
