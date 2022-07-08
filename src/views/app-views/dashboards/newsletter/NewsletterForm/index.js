import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import {
  apiCreateNewsletter,
  apiGetNewsletterById,
  apiUpdateNewsletterById
} from 'api/rest/newsletter'
import { useHistory } from 'react-router'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const NewsletterForm = ({ mode = ADD, param }) => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [newsletter, setNewsletter] = useState({})

  useEffect(() => {
    if (mode === EDIT) {
      param.id && getNewsletter(param.id)
    }
  }, [mode, param])

  const getNewsletter = async id => {
    const res = await apiGetNewsletterById(id)
    if (res && !res.error) {
      form.setFieldsValue(res)
      setNewsletter(res)
    }
  }

  const onFinish = () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async values => {
        let res
        if (mode === ADD) {
          let newValue = {
            subject: '',
            message: '',
            ...values
          }
          res = await apiCreateNewsletter(newValue)
        }
        if (mode === EDIT) {
          let newValue = {
            newsletter,
            ...values
          }
          res = await apiUpdateNewsletterById(newsletter.id, newValue)
        }
        setSubmitLoading(false)
        if (res && !res.error) {
          if (mode === ADD) {
            message.success(`Created "${res.subject}" to newsletter list`)
          }
          if (mode === EDIT) {
            message.success(`Newsletter "${res.subject}" saved`)
          }
        } else {
          res.error && message.error(res.error)
          !res.error && message.error(`Faile to ${mode}`)
        }
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
                {mode === 'ADD' ? 'Add New Newsletter' : `Edit Newsletter`}{' '}
              </h2>
              <div className="mb-3">
                <Button className="mr-2" onClick={history.goBack}>
                  Discard
                </Button>
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
              <GeneralField disabled={newsletter.is_sent} />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default NewsletterForm
