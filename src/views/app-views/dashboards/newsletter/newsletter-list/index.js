import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Menu, Card, Button, Table, message, Checkbox } from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { apiDeleteNewsletter, apiGetNewsletters } from 'api/rest/newsletter'
import { DEFAUT_PAGINATION } from 'configs/ui'
const TABS = [
  { title: 'All', value: '' },
  { title: 'Ready to send', value: true },
  { title: 'Sent', value: false }
]
const NewsletterList = ({ history, match, ...props }) => {
  const [list, setList] = useState([])
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedTab, setSelectedTab] = useState('')

  const getNewsletterList = async () => {
    setLoading(true)
    const res = await apiGetNewsletters({
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
    paginating && getNewsletterList()
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    getNewsletterList()
  }, [selectedTab])

  const dropdownMenu = row => (
    <Menu>
      <Menu.Item onClick={() => handleEdit(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => handleDeleteFeedback(row)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">
            {selectedRows.length > 0
              ? `Delete (${selectedRows.length} newsletters)`
              : 'Delete newsletter'}
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
    history.push(`/app/dashboards/newsletter/add-newsletter`)
  }

  const handleEdit = row => {
    history.push(`/app/dashboards/newsletter/edit-newsletter/${row.id}`)
  }

  const handleDeleteFeedback = async row => {
    const objKey = 'id'
    let data = [...list]
    if (selectedRows.length > 1) {
      let deletedRows = []
      for (const elm of selectedRows) {
        const res = await apiDeleteNewsletter(elm.id)
        if (!res.error) {
          deletedRows.push(elm.subject)
          setList(utils.deleteArrayRow(data, objKey, elm.id))
        }
      }
      message.success(`Deleted ${deletedRows.join(', ')} from newsletter list`)
    } else {
      const res = await apiDeleteNewsletter(row.id)
      if (!res.error) {
        setList(utils.deleteArrayRow(data, objKey, row.id))
        message.success(`Deleted ${row.subject} from newsletter list`)
      }
    }
  }

  const handleClickMenu = value => {
    setSelectedTab(value)
  }

  const tableColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'subject')
    },
    {
      title: 'Message',
      dataIndex: 'message',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'message')
    },
    {
      title: 'Sent',
      dataIndex: 'is_sent',
      render: is_sent => <Checkbox checked={is_sent} />,
      sorter: (a, b) => utils.antdTableSorter(a, b, 'is_sent')
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
    // const value = e.currentTarget.value
    // const searchArray = e.currentTarget.value ? list : CategoryListData
    // const data = utils.wildCardSearch(searchArray, value)
    // setList(data)
    // setSelectedRowKeys([])
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
        <div>
          <Button
            onClick={handleAdd}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add newsletter
          </Button>
        </div>
      </Flex>
      <Menu mode="horizontal">
        {TABS.map((tab, index) => (
          <Menu.Item
            key={index}
            title={tab.title}
            onClick={() => handleClickMenu(tab.value)}
          >
            {tab.title}
          </Menu.Item>
        ))}
      </Menu>
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
    </Card>
  )
}

const mapStateToProps = ({ domain }) => {
  return { propsDomain: domain }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsletterList)
