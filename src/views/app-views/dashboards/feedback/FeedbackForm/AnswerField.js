import React, { useState, useEffect } from 'react'
import { Input, Row, Col, Card, Form, Checkbox } from 'antd'

const rules = {
  message: [
    {
      required: true,
      message: 'Please enter domain name'
    }
  ],
  is_sent: [
    {
      message: 'Please enter domain description'
    }
  ]
}

const AnswerField = ({ disabled }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card title="Basic Info">
          <Form.Item
            name="message"
            label="Feedback message"
            rules={rules.message}
          >
            <Input placeholder="Feedback message" disabled={disabled} />
          </Form.Item>
          <Form.Item name="is_sent" label="Sent" rules={rules.is_sent}>
            <Checkbox disabled={disabled} />
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default AnswerField
