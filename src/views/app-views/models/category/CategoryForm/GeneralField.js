import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Upload,
  InputNumber,
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
import { apiGetTags } from 'api/rest/tag'

const { Dragger } = Upload
const { Option } = Select

const rules = {
  name: [
    {
      required: true,
      message: 'Please enter category name'
    }
  ],
  description: [
    {
      required: true,
      message: 'Please enter category description'
    }
  ],
  short_name: [
    {
      required: true,
      message: 'Please enter category short name'
    }
  ],
  floor: [
    {
      required: false,
      message: 'Please enter floorprice price. Default is 0.'
    }
  ],
  owners: [
    {
      required: false,
      message: 'Please enter numbers of owners. Default is 0.'
    }
  ],
  available: [
    {
      required: false,
      message: 'Please enter available numbers. Default is 0.'
    }
  ],
  community_discord: [
    {
      required: false,
      message: 'Please enter name of Discord.'
    }
  ],
  community_twitter: [
    {
      required: false,
      message: 'Please enter name of Twitter.'
    }
  ],
  regular_expression: [
    {
      required: false,
      message: 'Please enter general regular expression of ETH names.'
    }
  ],
  wiki_url: [
    {
      required: false,
      message: 'Please enter Wikipedia or website url including ETH names.'
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
  const propsCategory = props.category
  console.log('==== propsCategory: ', propsCategory)
  const [tags, setTags] = useState([])

  useEffect(() => {
    getTags()
  }, [])

  const getTags = async () => {
    const res = await apiGetTags({ per_page: 100 })

    if (res || res.error) {
      console.log('==== res: ', res.dataset)
      const tagArray = res.dataset.map(t => t.name)
      setTags(tagArray)
    }
  }

  let fileListProps = {}
  if (props.uploadedFiles.length > 0) {
    fileListProps.fileList = props.uploadedFiles
  }

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Category name" rules={rules.name}>
            <Input placeholder="Category Name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={rules.description}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="short_name"
            label="Short Name"
            rules={rules.short_name}
          >
            <Input placeholder="Short Name" />
          </Form.Item>
        </Card>
        <Card title="Organization">
          {tags && tags.length > 0 && (
            <Form.Item name="tags" label="Tags">
              <Select mode="tags" style={{ width: '100%' }} placeholder="Tags">
                {tags.map(elm => (
                  <Option key={elm}>{elm}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="community_discord"
                label="Community Discord"
                rules={rules.community_discord}
              >
                <Input placeholder="Community Discord" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="community_twitter"
                label="Community Twitter"
                rules={rules.community_twitter}
              >
                <Input placeholder="Community Twitter" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="List of Ethereum Names">
          <Form.Item
            name="regular_expression"
            label="Regular Expression"
            rules={rules.regular_expression}
          >
            <Input placeholder="Regular Expression" />
          </Form.Item>
          <Form.Item name="wiki_url" label="Wiki URL" rules={rules.wiki_url}>
            <Input placeholder="Wiki URL" />
          </Form.Item>
        </Card>
        <Card title="Pricing">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="floor" label="Price" rules={rules.floor}>
                <InputNumber
                  className="w-100"
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Other">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="count" label="Counts" rules={rules.owners}>
                <InputNumber
                  className="w-100"
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="available"
                label="Available"
                rules={rules.available}
              >
                <InputNumber
                  className="w-100"
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item name="owners" label="Owners" rules={rules.owners}>
                <InputNumber
                  className="w-100"
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
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
        <Card title="List files">
          <Upload
            accept=".txt, .csv"
            multiple={true}
            {...fileListProps}
            onChange={e => props.handleCsvUploadChange(e)}
            customRequest={e => props.handleCsvCustomUpload(e)}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
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
