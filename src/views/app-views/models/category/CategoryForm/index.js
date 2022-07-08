import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import EthField from './EthField'
import FirebaseService from 'services/FirebaseService'
import {
  apiGetCategoryById,
  apiCreateCategory,
  apiUpdateCategoryById
} from 'api/rest/category'
import moment from 'moment'
import { setCategories, showCategoryLoading } from 'redux/actions/Category'
import { apiGetDomains } from 'api/rest/domain'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const CategoryForm = props => {
  const { mode = ADD, param, propsCategories } = props

  const [form] = Form.useForm()
  const [uploadedImg, setImage] = useState('')
  const [uploadedFiles, setFiles] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [category, setCategory] = useState(null)
  const [domains, setDomains] = useState(['All'])
  const [selectedDomain, setSelectedDomain] = useState('All')

  useEffect(() => {
    console.log('param', param)
    console.log('props', props)

    if (mode === EDIT) {
      console.log('is edit')
      getCategory()
      getDomains()
    }
  }, [form, mode, param, props])

  const getCategory = async () => {
    const { id } = param
    const objectId = parseInt(id)
    if (!id) return
    const categoryData = propsCategories.categories.filter(
      category => category.id === objectId
    )
    let cat = categoryData[0]
    if (!cat) {
      const res = await apiGetCategoryById(objectId)
      console.log('=== cat: ', res)
      if (res || res.error) {
        return
      }
      cat = res
    }
    form.setFieldsValue({
      ...cat,
      floor: cat.floor
    })
    setImage(cat.image_url)
    console.log('==== cat: ', cat)
    setFiles(
      cat.files
        ? typeof cat.files === 'string'
          ? JSON.parse(cat.files)
          : cat.files
        : []
    )
    setCategory(cat)
  }

  const getDomains = async () => {
    const res = await apiGetDomains({ per_page: 100 })

    if (res || res.error) {
      const tagArray = res.dataset.map(t => t.name)
      setDomains(['All', ...tagArray])
    }
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

  const handleCsvCustomUpload = async ({ onError, onSuccess, file }) => {
    const metadata = {
      contentType: file.type
    }
    const categoryName = category
      ? category.name
      : momenttz.tz('America/New_York').format('x')
    let existFile = uploadedFiles.find(uf => uf.name == file.name)
    if (existFile && existFile.status == 'done') {
      onError && onError('File already exist')
      message.error('File already exist. Please upload other file.')
      return
    }
    try {
      const csvUrl = await FirebaseService.uploadCsvFile(
        categoryName,
        file.name,
        file,
        metadata
      )
      onSuccess && onSuccess(null, csvUrl)
    } catch (e) {
      onError && onError(e)
    }
  }

  const handleCsvUploadChange = info => {
    const file = info.file
    let tmpFiles = [...uploadedFiles]
    let existFile = tmpFiles.find(uf => uf.name == file.name)
    if (file.status === 'uploading') {
      if (!existFile) {
        tmpFiles.push({
          name: file.name,
          url: '',
          type: file.type,
          size: file.size,
          uid: file.uid,
          status: 'uploading'
        })
        setFiles(tmpFiles)
        setUploadLoading(true)
      }
      return
    }
    if (file.status === 'done') {
      // Check the status of all files.
      if (existFile) {
        existFile.status = file.status
        existFile.url = file.xhr
        setFiles(tmpUploadedFiles)
      }
    }
    if (file.status === 'removed') {
      let tmpFiles = [...uploadedFiles]
      let index = tmpFiles.findIndex(uf => uf.name == file.name)
      if (index >= 0) {
        tmpFiles.splice(index, 1)
        setFiles(tmpFiles)
        return true
      }
    }
  }

  const onFinish = () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async values => {
        if (mode === ADD) {
          console.log('==== values: ', values)
          let newValue = {
            category: 0,
            name: '',
            description: '',
            short_name: '',
            image_url: '',
            available: 0,
            count: 0,
            owners: 0,
            tags: [],
            community_discord: '',
            community_twitter: '',
            floor: 0,
            regular_expression: '',
            wiki_url: '',
            ...values
          }
          newValue.floor = values.floor
          if (!!uploadedImg) {
            newValue.image_url = uploadedImg
          }
          if (uploadedFiles && uploadedFiles.length > 0) {
            newValue.files = uploadedFiles
          }
          console.log('==== newValue: ', newValue)
          // FirebaseService.addCategory(newValue)
          const res = await apiCreateCategory(newValue)
          const newValueTags = newValue.tags
        }
        if (mode === EDIT) {
          const { id } = param
          const objectId = parseInt(id)
          const categoryData = propsCategories.categories.filter(
            cat => cat.id === objectId
          )
          const cat = categoryData[0]
          let updatedValue = {
            ...cat,
            ...values
          }
          updatedValue.floor = values.floor
          updatedValue.community_discord = updatedValue.community_discord || ''
          updatedValue.community_twitter = updatedValue.community_twitter || ''
          updatedValue.wiki_url = updatedValue.wiki_url || ''
          updatedValue.regular_expression =
            updatedValue.regular_expression || ''
          if (!!uploadedImg) {
            updatedValue.image_url = uploadedImg
          }
          if (uploadedFiles && uploadedFiles.length > 0) {
            updatedValue.files = uploadedFiles
          }
          // FirebaseService.updateCategory(updatedValue)
          const res = await apiUpdateCategoryById(cat.id, updatedValue)
        }

        setTimeout(() => {
          setSubmitLoading(false)
          if (mode === ADD) {
            message.success(`Created ${values.name} to category list`)
          }
          if (mode === EDIT) {
            message.success(`Category saved`)
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
        initialValues={{
          heightUnit: 'cm',
          widthUnit: 'cm',
          weightUnit: 'kg'
        }}
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
                {mode === 'ADD' ? 'Add New Category' : `Edit Category`}{' '}
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
                category={category}
                handleUploadChange={handleUploadChange}
                handleCsvUploadChange={handleCsvUploadChange}
                handleCsvCustomUpload={handleCsvCustomUpload}
              />
            </TabPane>
            {/* <TabPane tab="ETH" key="2">
              <EthField category={category || null} />
            </TabPane> */}
            {domains.map((domain, index) => (
              <TabPane tab={domain} key={domain}>
                <EthField category={category || null} domain={domain} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Form>
    </>
  )
}

const mapStateToProps = ({ category }) => {
  return { propsCategories: category }
}

const mapDispatchToProps = {
  setCategories,
  showCategoryLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryForm)
