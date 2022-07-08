import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Menu, Card, Button, Table, message, Checkbox } from 'antd'
import CategoryListData from 'assets/data/category-list.data.json'
import {
  SearchOutlined,
  EyeOutlined,
  SendOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { apiCreateFeedbackAnswer } from 'api/rest/feedbackAnswer'
import FeedbackAnswerModal from 'components/FeedbackAnswerModal'
import { apiGetFeedbacks } from 'api/rest/feedback'
import { DEFAUT_PAGINATION } from 'configs/ui'

const FeedbackList = ({ history }) => {
  const [list, setList] = useState([])
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)
  const [loading, setLoading] = useState(false)
  const [messageModalVisible, setMessageModalVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRow, setSelectedRow] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getFeedbackList = async () => {
    setLoading(true)
    const res = await apiGetFeedbacks({
      per_page: pagination.per_page,
      page_no: pagination.current_page,
      order_by: 'created_at',
      order_type: '-'
    })
    setLoading(false)
    if (res && !res.error) {
      setList(res.dataset)
      setPagination(res.pagination)
    }
  }

  useEffect(() => {
    paginating && getFeedbackList()
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    getFeedbackList()
  }, [])

  const dropdownMenu = row => (
    <Menu>
      {/* <Menu.Item onClick={() => handleView(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item> */}
      <Menu.Item
        onClick={() => {
          setSelectedRow(row)
          setMessageModalVisible(true)
        }}
      >
        <Flex alignItems="center">
          <SendOutlined />
          <span className="ml-2">
            {selectedRows.length > 0
              ? `Send (${selectedRows.length} answers)`
              : 'Send answer'}
          </span>
        </Flex>
      </Menu.Item>
    </Menu>
  )

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  const handleAdd = () => {
    history.push(`/app/dashboards/feedback/add-feedback`)
  }

  const handleView = row => {
    history.push(`/app/dashboards/feedback/edit-feedback/${row.id}`)
  }

  const handleSendAnswer = async ({ message: _message }) => {
    if (selectedRows.length > 1) {
      let feedbackAnswers = []
      setLoading(true)
      for (const elm of selectedRows) {
        const res = await apiCreateFeedbackAnswer({
          feedback: elm.id,
          message: _message
        })
        if (!res.error) {
          feedbackAnswers.push(elm.sender)
        } else {
          // res.error && message.error(`Failed to answer to ${elm.sender}(${res.error})`)
          message.error(`Failed to answer to ${elm.sender}`)
        }
      }
      feedbackAnswers.length &&
        message.success(`Sent the answers to ${feedbackAnswers.join(', ')}`)
    } else {
      const res = await apiCreateFeedbackAnswer({
        feedback: selectedRow.id,
        message: _message
      })
      if (!res.error) {
        message.success(`Sent the answers to ${selectedRow.sender}`)
      } else {
        // res.error && message.error(`Failed to answer to ${elm.sender}(${res.error})`)
        message.error(`Failed to answer to ${elm.sender}`)
      }
    }
    setLoading(false)
  }

  const tableColumns = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'sender')
    },
    {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'message')
    },

    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      )
    }
  ]

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows)
      setSelectedRowKeys(key)
    }
  }

  const onSearch = e => {
    const value = e.currentTarget.value
    const searchArray = e.currentTarget.value ? list : CategoryListData
    const data = utils.wildCardSearch(searchArray, value)
    setList(data)
    setSelectedRowKeys([])
  }

  return (
    <Card>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={e => onSearch(e)}
            />
          </div>
        </Flex>
        {/* <div>
          <Button
            onClick={handleAdd}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add Feedback
          </Button>
        </div> */}
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={list}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            type: 'checkbox',
            preserveSelectedRowKeys: false,
            ...rowSelection
          }}
          // onRow={(r) => ({
          // 	onClick: () => {console.log('=== r: ', r)}
          // })}
          pagination={{
            defaultCurrent: 1,
            total: Number(pagination.total_count),
            current: Number(pagination.current_page),
            pageSize: Number(pagination.per_page),
            showSizeChanger: true,
            defaultPageSize: 24,
            pageSizeOptions: [15, 18, 24],
            onChange: handleChangePage
          }}
        />
      </div>
      <FeedbackAnswerModal
        visible={messageModalVisible}
        onAnswer={handleSendAnswer}
        onCancel={() => setMessageModalVisible(false)}
      />
    </Card>
  )
}

export default FeedbackList
