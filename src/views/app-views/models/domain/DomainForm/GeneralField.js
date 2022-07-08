import React, { useState, useEffect } from 'react'
import { Input, Row, Col, Card, Form } from 'antd'

const rules = {
  name: [
    {
      required: true,
      message: 'Please enter domain name'
    }
  ],
  description: [
    {
      message: 'Please enter domain description'
    }
  ]
}

const GeneralField = ({ disabled }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Domain name" rules={rules.name}>
            <Input placeholder="Domain Name" disabled={disabled} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={rules.description}
          >
            <Input.TextArea rows={2} disabled={disabled} />
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
