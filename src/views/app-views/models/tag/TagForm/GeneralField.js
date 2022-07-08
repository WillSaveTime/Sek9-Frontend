import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Upload,
  message,
  Select,
  Button,
  Icon
} from 'antd'
import { ImageSvg } from 'assets/svg/icon'
import CustomIcon from 'components/util-components/CustomIcon'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import momenttz from 'moment-timezone'
import FirebaseService from 'services/FirebaseService'

const { Dragger } = Upload
const { Option } = Select

const rules = {
  name: [
    {
      required: true,
      message: 'Please enter tag name'
    }
  ],
  description: [
    {
      message: 'Please enter tag description'
    }
  ],
  priority: [
    {
      message: 'Please enter category short name'
    }
  ]
}

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const customUpload = async ({ onError, onSuccess, file }) => {
  const metadata = {
    contentType: file.type
  }
  const fileName = momenttz.tz('America/New_York').format('x')
  const ext = file.name.split('.').pop()
  try {
    const imageUrl = await FirebaseService.uploadFile(
      fileName + '.' + ext,
      file,
      metadata
    )
    onSuccess && onSuccess(null, imageUrl)
  } catch (e) {
    onError && onError(e)
  }
}

const imageUploadProps = {
  name: 'file',
  multiple: true,
  listType: 'picture-card',
  showUploadList: false,
  action: ''
}

// const tags = ['numbers', 'letters', 'emojis', '0x']

const GeneralField = props => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Tag name" rules={rules.name}>
            <Input placeholder="Tag Name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={rules.description}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={rules.short_name}>
            <Input placeholder="Priority" type="number" min={0} />
          </Form.Item>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Image">
          <Dragger
            {...imageUploadProps}
            beforeUpload={beforeUpload}
            onChange={e => props.handleUploadChange(e)}
            customRequest={customUpload}
          >
            {props.uploadedImg ? (
              <img src={props.uploadedImg} alt="avatar" className="img-fluid" />
            ) : (
              <div>
                {props.uploadLoading ? (
                  <div>
                    <LoadingOutlined className="font-size-xxl text-primary" />
                    <div className="mt-3">Uploading</div>
                  </div>
                ) : (
                  <div>
                    <CustomIcon className="display-3" svg={ImageSvg} />
                    <p>Click or drag file to upload</p>
                  </div>
                )}
              </div>
            )}
          </Dragger>
        </Card>
      </Col>
    </Row>
  )
}

const mapStateToProps = ({ category }) => {
  return { propsCategories: category }
}

const mapDispatchToProps = {}

// export default GeneralField
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneralField)
