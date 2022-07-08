import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Menu,
  Spin,
  Image,
  Space,
  Anchor
} from 'antd'
import CategoryListData from 'assets/data/category-list.data.json'
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format'
import { useHistory } from 'react-router-dom'
import utils from 'utils'
import FirebaseService from 'services/FirebaseService'
import { apiGetCategories, apiDeleteCategory } from 'api/rest/category'
import { setCategories, showCategoryLoading } from 'redux/actions/Category'

const { Option } = Select
const { Link } = Anchor
const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']

const CategoryList = props => {
  const { propsCategory, setCategories, showCategoryLoading } = props
  let history = useHistory()
  const [list, setList] = useState(propsCategory.categories)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const getCategoryList = async () => {
    const res = await apiGetCategories({
      per_page: 100,
      order_by: 'created_at',
      order_type: '-'
    })
    if (res && !res.error) {
      setCategoryList(res.dataset)
    }
  }

  useEffect(() => {
    showCategoryLoading()
    getCategoryList()
    // FirebaseService.getCategories(setCategoryList)
  }, [])

  const setCategoryList = cats => {
    setList(cats)
    setCategories(cats)
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

  const addCategory = () => {
    history.push(`/app/models/category/add-category`)
  }

  const viewDetails = row => {
    history.push(`/app/models/category/edit-category/${row.id}`)
  }

  const deleteRow = row => {
    const objKey = 'id'
    let data = list
    if (selectedRows.length > 1) {
      selectedRows.forEach(elm => {
        data = utils.deleteArrayRow(data, objKey, elm.id)
        setList(data)
        setSelectedRows([])
        // FirebaseService.deleteCategory(elm)
        apiDeleteCategory(elm.id)
      })
    } else {
      data = utils.deleteArrayRow(data, objKey, row.id)
      setList(data)
      // FirebaseService.deleteCategory(row)
      apiDeleteCategory(row.id)
    }
  }

  const tableColumns = [
    {
      title: 'Category',
      dataIndex: 'name',
      render: (_, record) => (
        <div onClick={() => viewDetails(record)}>
          <a href="#" title={record.name}>
            <div className="d-flex">
              <AvatarStatus
                size={60}
                type="square"
                src={record.image_url}
                name={record.name}
                subTitle={record.description}
              />
            </div>
          </a>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      render: floor => (
        <div className="space-align-block">
          <Space align="center" size={2}>
            <Image
              height={13}
              src={'/img/icons/ethereum-icon-28.png'}
              name={`${floor}`}
            />
            <NumberFormat
              displayType={'text'}
              value={floor}
              prefix={''}
              thousandSeparator={true}
            />
          </Space>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'floor')
    },
    {
      title: 'Owners',
      dataIndex: 'owners',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'owners')
    },
    {
      title: 'Supply',
      dataIndex: 'count',
      render: (_, record) => (
        <div>{`${record.count - record.available} / ${record.count}`}</div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'count')
    },
    {
      title: 'Tags',
      dataIndex: 'strTags',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'strTags')
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

  const handleShowCategory = value => {
    if (value !== 'All') {
      const key = 'category'
      const data = utils.filterArray(CategoryListData, key, value)
      setList(data)
    } else {
      setList(CategoryListData)
    }
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
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowCategory}
              placeholder="Category"
            >
              <Option value="All">All</Option>
              {categories.map(elm => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <div>
          <Button
            onClick={addCategory}
            type="primary"
            icon={<PlusCircleOutlined />}
            block
          >
            Add category
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        {propsCategory.loading ? (
          <Spin />
        ) : (
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: 'checkbox',
              preserveSelectedRowKeys: false,
              ...rowSelection
            }}
            // onRow={(r) => ({
            // 	onClick: () => {console.log('=== r: ', r)}
            // })}
          />
        )}
      </div>
    </Card>
  )
}

const mapStateToProps = ({ category }) => {
  return { propsCategory: category }
}

const mapDispatchToProps = {
  setCategories,
  showCategoryLoading
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryList)
