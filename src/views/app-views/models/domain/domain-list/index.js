import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Input, Menu, Card, Button, Table, message } from 'antd'
import CategoryListData from 'assets/data/category-list.data.json'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import Flex from 'components/shared-components/Flex'
import { useHistory } from 'react-router-dom'
import utils from 'utils'
import { apiGetDomains, apiDeleteDomain } from 'api/rest/domain'
import { setDomains, showDomainLoading, setPagination } from 'redux/actions'

const DomainList = ({
  propsDomain,
  setDomains,
  showDomainLoading,
  setPagination
}) => {
  let history = useHistory()
  const { pagination, domains, loading } = propsDomain
  const [list, setList] = useState(domains)
  const [paginating, setPaginating] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getDomainList = async () => {
    showDomainLoading()
    const res = await apiGetDomains({
      per_page: pagination.per_page,
      page_no: pagination.current_page,
      order_by: 'created_at',
      order_type: '-'
    })
    if (res && !res.error) {
      setDomainList(res.dataset)
      setPagination(res.pagination)
    }
  }

  useEffect(() => {
    paginating && getDomainList()
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    getDomainList()
  }, [])

  const setDomainList = domains => {
    setList(domains)
    setDomains(domains)
  }

  const dropdownMenu = row => (
    <Menu>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => deleteRow(row)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">
            {selectedRows.length > 0
              ? `Delete (${selectedRows.length})`
              : 'Delete'}
          </span>
        </Flex>
      </Menu.Item>
    </Menu>
  )

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  const handleAddCategory = () => {
    history.push(`/app/models/domain/add-domain`)
  }

  const viewDetails = row => {
    history.push(`/app/models/domain/view-domain/${row.id}`)
  }

  const deleteRow = async row => {
    const objKey = 'id'
    let data = [...list]
    if (selectedRows.length > 1) {
      let deletedRows = []
      for (const elm of selectedRows) {
        const res = await apiDeleteDomain(elm.id)
        if (!res.error) {
          deletedRows.push(elm.name)
          setDomainList(utils.deleteArrayRow(data, objKey, elm.id))
        }
      }
      message.success(`Deleted ${deletedRows.join(', ')} from domain list`)
    } else {
      const res = await apiDeleteDomain(row.id)
      if (!res.error) {
        setDomainList(utils.deleteArrayRow(data, objKey, row.id))
        message.success(`Deleted ${row.name} from domain list`)
      }
    }
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => (
        <div onClick={() => viewDetails(record)}>
          <a href="#" title={record.name}>
            <div className="d-flex">
              <AvatarStatus
                size={60}
                type="square"
                name={record.name}
                noImage
              />
            </div>
          </a>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
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
        <div>
          <Button
            onClick={handleAddCategory}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add domain
          </Button>
        </div>
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
    </Card>
  )
}

const mapStateToProps = ({ domain }) => {
  return { propsDomain: domain }
}

const mapDispatchToProps = { setDomains, showDomainLoading, setPagination }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainList)
