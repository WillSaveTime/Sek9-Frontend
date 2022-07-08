import React, { useState, useEffect } from 'react'
import { Input, Row, Col, Card, Form, Checkbox } from 'antd'

const rules = {
  subject: [
    {
      required: true,
      message: 'Please enter newsletter subject'
    }
  ],
  message: [
    {
      required: true,
      message: 'Please enter newsletter message'
    }
  ]
}

const GeneralField = ({ disabled }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card title="Basic Info">
          <Form.Item
            name="subject"
            label="Newsletter subject"
            rules={rules.subject}
          >
            <Input placeholder="Newsletter subject" disabled={disabled} />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={rules.message}>
            <Input.TextArea rows={2} disabled={disabled} />
          </Form.Item>
          <Form.Item name="is_sent" valuePropName="checked">
            <Checkbox disabled>Sent</Checkbox>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
