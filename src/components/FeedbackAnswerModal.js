import { Button, Form, Input, Modal, Radio } from 'antd'
import React, { useState } from 'react'

const FeedbackAnswerModal = ({ visible, onAnswer, onCancel, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      title="Feedback Answer"
      okText="Ok"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCancel()
            onAnswer(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
      {...props}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public'
        }}
      >
        <Form.Item
          name="message"
          label="Message"
          rules={[
            {
              required: true,
              message: 'Please input the message!'
            }
          ]}
        >
          <Input.TextArea type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FeedbackAnswerModal
