import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LockOutlined, MailOutlined, ProfileOutlined } from '@ant-design/icons'
import { Button, Form, Input, Alert, Typography, Row, Col } from 'antd'
import {
  signUp,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  setError
} from 'redux/actions/Auth'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { keys, values } from 'lodash-es'

const rules = {
  email: [
    {
      required: true,
      message: 'Please input your email address'
    },
    {
      type: 'email',
      message: 'Please enter a validate email!'
    }
  ],
  first_name: [
    {
      required: true,
      message: 'Please input your first name'
    }
  ],
  last_name: [
    {
      required: true,
      message: 'Please input your last name'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input your password'
    }
  ],
  confirm: [
    {
      required: true,
      message: 'Please confirm your password!'
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject('Passwords do not match!')
      }
    })
  ]
}

export const RegisterForm = props => {
  const {
    signUp,
    error,
    showLoading,
    token,
    loading,
    redirect,
    message,
    showMessage,
    setError,
    hideAuthMessage,
    allowRedirect
  } = props
  const [form] = Form.useForm()
  let history = useHistory()

  const onSignUp = () => {
    form
      .validateFields()
      .then(values => {
        showLoading()
        signUp({ ...values, type: 'USER' })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect)
    }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage()
      }, 3000)
    }
    if (keys(error).length) {
      setTimeout(() => {
        setError({})
      }, 3000)
    }
  })
  useEffect(() => {
    const errorKeys = keys(error)
    const errors = []
    for (const errorKey of errorKeys) {
      errors.push({ name: errorKey, errors: error[errorKey] })
    }
    form.setFields(errors)
  }, [error])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0
        }}
      >
        <Alert type="success" showIcon message={message} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: keys(error).length > 0 ? 1 : 0,
          marginBottom: keys(error).length > 0 ? 20 : 0
        }}
      >
        <Alert type="error" showIcon message={values(error)} />
      </motion.div>

      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={rules.email}
              hasFeedback
            >
              <Input prefix={<MailOutlined className="text-primary" />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={rules.first_name}
              hasFeedback
            >
              <Input prefix={<ProfileOutlined className="text-primary" />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={rules.last_name}
              hasFeedback
            >
              <Input prefix={<ProfileOutlined className="text-primary" />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={rules.password}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirm"
              label="ConfirmPassword"
              rules={rules.confirm}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect, error } = auth
  return { loading, message, showMessage, token, redirect, error }
}

const mapDispatchToProps = {
  signUp,
  showAuthMessage,
  hideAuthMessage,
  setError,
  showLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm)
