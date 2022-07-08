import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import { apiGetTagById, apiCreateTag, apiUpdateTagById } from 'api/rest/tag'
import { setTags, showTagLoading } from 'redux/actions/Tag'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const TagForm = props => {
  const { mode = ADD, param, propsTag } = props

  const [form] = Form.useForm()
  const [uploadedImg, setImage] = useState('')
  const [uploadedFiles, setFiles] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (mode === EDIT) {
      getTag()
    }
  }, [form, mode, param, props])

  const getTag = async () => {
    const { id } = param
    const objectId = parseInt(id)
    if (!id) return
    let _tag = propsTag.tags.find(tag => tag.id === objectId)
    if (!_tag) {
      const res = await apiGetTagById(objectId)
      if (res || res.error) {
        return
      }
      _tag = res
    }
    form.setFieldsValue(_tag)
  }

  const handleUploadChange = info => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setImage(info.file.xhr)
    }
  }

  const onFinish = () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async values => {
        if (mode === ADD) {
          let newValue = {
            name: '',
            description: '',
            priority: '',
            ...values
          }
          if (!!uploadedImg) {
            newValue.image_url = uploadedImg
          }

          // FirebaseService.addCategory(newValue)
          const res = await apiCreateTag(newValue)
        }
        if (mode === EDIT) {
          const { id } = param
          const objectId = parseInt(id)
          const _tag = propsTag.tags.find(tag => tag.id === objectId)
          let updatedValue = {
            ..._tag,
            ...values
          }
          // FirebaseService.updateCategory(updatedValue)
          const res = await apiUpdateTagById(_tag.id, updatedValue)
        }

        setTimeout(() => {
          setSubmitLoading(false)
          if (mode === ADD) {
            message.success(`Created ${values.name} to tag list`)
          }
          if (mode === EDIT) {
            message.success(`Tag saved`)
          }
        }, 1500)
      })
      .catch(info => {
        setSubmitLoading(false)
        console.log('info', info)
        message.error('Please enter all required field ')
      })
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center"
            >
              <h2 className="mb-3">
                {mode === 'ADD' ? 'Add New Tag' : `Edit Tag`}{' '}
              </h2>
              <div className="mb-3">
                <Button className="mr-2">Discard</Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {mode === 'ADD' ? 'Add' : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField
                uploadedImg={uploadedImg}
                uploadedFiles={uploadedFiles}
                uploadLoading={uploadLoading}
                handleUploadChange={handleUploadChange}
              />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

const mapStateToProps = ({ tag }) => {
  return { propsTag: tag }
}

const mapDispatchToProps = { setTags, showTagLoading }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagForm)
