import React, { useState, useEffect } from 'react'
import { Input, Row, Col, Card, Form } from 'antd'

const rules = {
  sender: [
    {
      required: true,
      message: 'Please enter feedback sender'
    }
  ],
  message: [
    {
      required: true,
      message: 'Please enter feedback message'
    }
  ]
}

const GeneralField = ({ disabled }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card title="Basic Info">
          <Form.Item name="sender" label="Feedback sender" rules={rules.sender}>
            <Input placeholder="Feedback sender" disabled={disabled} />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={rules.message}>
            <Input.TextArea rows={2} disabled={disabled} />
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
