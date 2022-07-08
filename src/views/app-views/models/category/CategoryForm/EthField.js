import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import {
  Radio,
  Button,
  Row,
  Col,
  Tooltip,
  Tag,
  Avatar,
  Card,
  Image,
  Spin,
  Pagination
} from 'antd'
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  HeartFilled
} from '@ant-design/icons'
import NumberFormat from 'react-number-format'
import FirebaseService from 'services/FirebaseService'
import { apiGetEthereums } from 'api/rest/ethereum'

import Flex from 'components/shared-components/Flex'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import { DEFAUT_PAGINATION } from 'configs/ui'

const VIEW_LIST = 'LIST'
const VIEW_GRID = 'GRID'

const ItemHeader = ({ name }) => (
  <Tooltip title={name} key={`avatar-${name}`}>
    <div className="d-flex">
      <AvatarStatus
        size={18}
        type="circle"
        src={'/img/icons/ens-144x144.png'}
        name={name}
      />
    </div>
  </Tooltip>
)

const ItemInfo = ({ price, statusColor }) => (
  <Flex alignItems="center">
    <Tag
      className={statusColor === 'none' ? 'bg-gray-lightest' : ''}
      color={statusColor !== 'none' ? statusColor : ''}
      style={{ margin: '0px', fontSize: '14px' }}
    >
      <Image
        height={13}
        src={'/img/icons/ethereum-icon-28.png'}
        name={'price'}
      />
      <NumberFormat
        displayType={'text'}
        value={(Math.round(price * 1000) / 1000).toFixed(3)}
        prefix={''}
        thousandSeparator={true}
        className="ml-2 font-weight-semibold"
      />
    </Tag>
  </Flex>
)

const ItemMember = ({ data }) => (
  <>
    <Tooltip title={'Buy on OpenSea'} key={`avatar-opensea`}>
      <Avatar
        size={20}
        className={`ml-1 cursor-pointer`}
        src={'/img/icons/opensea-disabled.png'}
        style={{ backgroundColor: 'gray' }}
      />
    </Tooltip>
    <Tooltip title={'Add to Watchlist'} key={`avatar-watchlist`}>
      <Avatar
        size={20}
        className={`ml-1 cursor-pointer`}
        src={<HeartFilled style={{ color: '#808080' }} />}
      />
    </Tooltip>
  </>
)

const ListItem = ({ data }) => (
  <a href={`/name/${data.name}.eth/details`} target="_blank">
    <div
      className="bg-white rounded p-3 mb-3 border"
      style={{ backgroundColor: data.labelHash ? 'white' : '#8080803b' }}
    >
      <Row align="middle">
        <Col xs={24} sm={24} md={8}>
          <ItemHeader
            name={`${data.name}.eth`}
            category={`${data.starting_price}`}
          />
        </Col>
        <Col xs={24} sm={24} md={6}>
          <ItemInfo price={`${data.starting_price}`} statusColor={'orange'} />
        </Col>
        <Col xs={24} sm={24} md={5} />
        <Col xs={24} sm={24} md={3} />
        <Col xs={24} sm={24} md={2}>
          <div className="text-right">
            <ItemMember eth={data} />
          </div>
        </Col>
      </Row>
    </div>
  </a>
)

const GridItem = ({ data }) => (
  <a href={`/name/${data.name}.eth/details`} target="_blank">
    <Card style={{ backgroundColor: data.address ? 'white' : '#8080803b' }}>
      <Flex alignItems="center" justifyContent="between">
        <ItemHeader name={`${data.eth_name}`} />
        <ItemInfo price={`${data.balance}`} statusColor={'orange'} />
      </Flex>
      <div className="mt-2 text-right">
        <ItemMember eth={data} />
      </div>
    </Card>
  </a>
)

const EthFeild = props => {
  const [view, setView] = useState(VIEW_GRID)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)

  useEffect(() => {
    if (props.category) {
      setLoading(true)
      // FirebaseService.getEthereums(props.category, 0, '', setEthereums)
      getEthereums(props.category.id, props.domain)
    }
  }, [props])

  useEffect(() => {
    paginating && getEthereums(props.category.id)
    setPaginating(false)
  }, [paginating, pagination])

  const getEthereums = async (category_id, domain_name) => {
    setLoading(true)
    const searchParams = {
      per_page: pagination.per_page,
      page_no: pagination.current_page,
      category_id: category_id
    }

    if (domain_name !== 'All') {
      searchParams.domain_name = domain_name
    }

    const res = await apiGetEthereums(searchParams)
    if (res && !res.error) {
      setEthereums(res.dataset)
      setPagination(res.pagination)
    }
    setLoading(false)
  }

  const setEthereums = data => {
    setLoading(false)
    setList(data)
  }
  const onChangeProjectView = e => {
    setView(e.target.value)
  }

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  const deleteItem = id => {
    const data = list.filter(elm => elm.id !== id)
    setList(data)
  }

  return (
    <>
      <PageHeaderAlt className="border-bottom">
        <div className="container-fluid">
          <Flex justifyContent="between" alignItems="center" className="py-2">
            <h2>{props.domain}</h2>
            <div>
              <Radio.Group
                defaultValue={VIEW_GRID}
                onChange={e => onChangeProjectView(e)}
              >
                <Radio.Button value={VIEW_GRID}>
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value={VIEW_LIST}>
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
              <Button type="primary" className="ml-2">
                <PlusOutlined />
                <span>New</span>
              </Button>
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <div
        className={`my-4 ${
          view === VIEW_LIST ? 'container' : 'container-fluid'
        }`}
      >
        {loading ? (
          <Spin />
        ) : view === VIEW_LIST ? (
          list &&
          list.length > 0 &&
          list.map(elm => <ListItem data={elm} key={elm.id} />)
        ) : (
          <Row gutter={16}>
            {list &&
              list.length > 0 &&
              list.map(elm => (
                <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm.id}>
                  <GridItem data={elm} removeId={id => deleteItem(id)} />
                </Col>
              ))}
          </Row>
        )}
        <Pagination
          defaultCurrent={1}
          total={Number(pagination.total_count)}
          current={Number(pagination.current_page)}
          pageSize={Number(pagination.per_page)}
          showSizeChanger
          defaultPageSize={24}
          pageSizeOptions={[12, 24, 36]}
          onChange={handleChangePage}
        />
      </div>
    </>
  )
}

export default EthFeild
