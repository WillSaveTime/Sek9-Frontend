import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import FirebaseService from 'services/FirebaseService'
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Layout,
  Menu,
  Button,
  Table,
  Image,
  Space,
  Input
} from 'antd'
import mq from '../mediaQuery'

import SearchInput from '../components/SearchName/SearchInput'
import Search from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import TextBubbleDefault from '../components/Icons/TextBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'
import HowToUseDefault from '../components/HowToUse/HowToUse'
import ENSLogo from '../assets/sek9-full-logo-white.png'
import { aboutPageURL } from '../utils/utils'
import { connectProvider, disconnectProvider } from '../utils/providerUtils'
import { gql } from '@apollo/client'
import NumberFormat from 'react-number-format'
import {
  MainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'
import EthCard from 'components/EthCard'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import { EyeOutlined } from '@ant-design/icons'
import {
  apiGetCategories,
  apiGetNewestCategories,
  apiGetMostViewedCategories,
  apiGetMostPurchasedCategories
} from 'api/rest/category'
import { apiGetTags } from 'api/rest/tag'
import utils from 'utils'
import { DEFAUT_PAGINATION } from 'configs/ui'

const HeroTop = styled(Layout.Header)`
  padding: 20px;
  position: fixed;
`

const NoAccounts = styled(NoAccountsDefault)``

const Network = styled('div')`
  margin-bottom: 5px;
`
const Name = styled('span')`
  margin-left: 5px;
  text-transform: none;
  display: inline-block;
  width: 100px;
`

const NetworkStatus = styled('div')`
  color: white;
  font-weight: 200;
  text-transform: capitalize;
  margin-bottom: 20px;
  display: none;
  ${mq.small`
    display: block;
  `}
  ${mq.medium`
    left: 40px;
  `}

  &:before {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(-5px, -50%);
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
`

const Nav = styled('nav')`
  display: flex;
  margin-left: 20px;
  justify-content: center;
  ${mq.small`
    justify-content: flex-start;
  `}
  a {
    font-weight: 300;
    color: white;
  }
`

const NavLink = styled(Link)`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`

const ExternalLink = styled('a')`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`

const Announcement = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #5284ff;
  padding: 0 10px;
  border-bottom: #5284ff solid 3px;
  h3 {
    color: white;
    font-weight: 400;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: white;
  }
  a {
    color: white;
    text-decoration: none;
  }
`

const HowToUse = styled(HowToUseDefault)`
  padding: 70px;
`

const Hero = styled(Layout)`
  background: url(${bg});
  background-size: cover;
  min-height: 100vh !important;
  background-attachment: fixed;
`

const Content = styled(Layout.Content)`
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  ${mq.medium`
    min-width: auto;
    max-width: 90%;
  `}
  > h2 {
    color: white;
    font-size: 38px;
    font-weight: 100;
    margin-bottom: 10px;
  }

  > h3 {
    color: white;
    font-weight: 100;
    font-size: 24px;
    margin-top: 0;
  }
`

// const Search = styled(SearchDefault)`
//   min-width: 250;
//   ${mq.medium`
//     min-width: 150px;
//   `}

//   input {
//     width: 100%;
//     border-radius: 0px;
//     padding: 5px 0 5px 25px;
//     ${mq.medium`
//       border-radius: 6px 0 0 6px;
//       font-size: 14px;
//     `}
//   }

//   &:before {
//     content: '';
//     position: absolute;
//     left: 5px;
//     width: 15px;
//     height: 15px;
//   }

//   button {
//     border-radius: 0 6px 6px 0;
//     height: auto;
//   }
// `

const Explanation = styled('div')`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr;
  grid-template-rows: auto;
  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  `}
  grid-gap: 0;
`

const H2 = styled('h2')`
  font-size: 30px;
  font-weight: 500;
`

const Section = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const WhatItIs = styled(Section)`
  padding: 40px 20px 80px;
  p {
    font-size: 18px;
  }
`

const HowItWorks = styled(Section)`
  background: #f0f6fa;
  padding: 40px 20px 80px;
`

const Inner = styled('div')`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;

  > p {
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 1.5em;
  }
`
const NameAnimation = styled(Section)`
  display: block;
  height: 100%;
`

const TextBubble = styled(TextBubbleDefault)`
  margin-right: 10px;
`

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const LogoLarge = styled(motion.img)`
  width: 200px;
  object-fit: cover;
  margin-right: 20px;
  ${mq.medium`
    width: 150px;
  `}
`

const PermanentRegistrarLogo = styled(motion.h1)`
  font-family: Overpass;
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  color: #4258d3;
  letter-spacing: 1.8px;
  text-align: right;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
`

const ReadOnly = styled('span')`
  margin-left: 1em;
`

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

const animation = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    opacity: 1,
    scale: 1
  }
}

export default ({ match, history }) => {
  const { url } = match
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState({
    ...DEFAUT_PAGINATION,
    per_page: 5
  })
  const [newestCategories, setNewestCategories] = useState([])
  const [mostViewed24HrsCategories, setMostViewed24HrsCategories] = useState([])
  const [mostViewed7DaysCategories, setMostViewed7DaysCategories] = useState([])
  const [mostPurchasedCategories, setMostPurchasedCategories] = useState([])
  const [tags, setTags] = useState(['General'])
  const [selectedTag, setSelectedTag] = useState('General')

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

  const {
    data: { network, displayName, isReadOnly, isSafeApp }
  } = useQuery(HOME_DATA, {
    variables: { address: accounts?.[0] }
  })

  useEffect(() => {
    // showCategoryLoading();
    // FirebaseService.getCategories(setAllCategories)
    // FirebaseService.getCategories(setCategories, 'createdAt')
    getCategories()
    getNewestCategories()
    getMostViewed24HrsCategories()
    getMostViewed7DaysCategories()
    getMostPurchasedCategories({ per_page: 5 })
    getTags()
  }, [])

  useEffect(() => {
    paginating && getCategories(selectedTag)
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    getCategories()
  }, [selectedTag])

  const getTags = async () => {
    const res = await apiGetTags({ per_page: 100 })

    if (res || res.error) {
      const tagArray = res.dataset.map(t => t.name)
      setTags(['General', ...tagArray])
    }
  }

  const getCategories = async () => {
    const searchParams = {
      per_page: pagination.per_page,
      page_no: pagination.current_page
    }
    if (selectedTag !== 'General') {
      searchParams.tag = selectedTag
    }
    setCategoriesLoading(true)
    const res = await apiGetCategories(searchParams)
    setCategoriesLoading(false)
    if (res && !res.error) {
      setCategories(res.dataset)
      setPagination(res.pagination)
    }
  }

  const getNewestCategories = async () => {
    const res = await apiGetNewestCategories({ per_page: 5 })
    if (res && !res.error) {
      setNewestCategories(res.dataset)
    }
  }

  const getMostViewed24HrsCategories = async () => {
    const res = await apiGetMostViewedCategories({ per_page: 5, hours: 24 })
    if (res && !res.error) {
      setMostViewed24HrsCategories(res.dataset)
    }
  }

  const getMostViewed7DaysCategories = async () => {
    const res = await apiGetMostViewedCategories({ per_page: 5, hours: 24 * 7 })
    if (res && !res.error) {
      setMostViewed7DaysCategories(res.dataset)
    }
  }

  const getMostPurchasedCategories = async () => {
    const res = await apiGetMostPurchasedCategories({ per_page: 5 })
    if (res && !res.error) {
      setMostPurchasedCategories(res.dataset)
    }
  }

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  const handleClickMenu = index => {
    setSelectedTag(tags[index])
  }

  const handleClickMore = cat => {
    history.push(`/category/${cat.id}`)
  }

  const tableColumns = [
    {
      title: 'Category',
      dataIndex: 'name',
      render: (_, record) => (
        <div onClick={() => handleClickMore(record)}>
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
      )
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
              name={`${Math.round(floor * 1000) / 1000}`}
            />
            <NumberFormat
              displayType={'text'}
              value={Math.round(floor * 1000) / 1000}
              prefix={''}
              thousandSeparator={true}
            />
          </Space>
        </div>
      )
    },
    {
      title: 'Owners',
      dataIndex: 'owners'
    },
    {
      title: 'Supply',
      dataIndex: 'count',
      render: (_, record) => (
        <div>{`${record.count - record.available} / ${record.count}`}</div>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (_, record) => <div>{_.join()}</div>
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleClickMore(record)}
        />
      )
    }
  ]

  return (
    <>
      {/* <Layout.Header
        className="header"
        style={{ background: 'transparent', alignItems: 'center', height: 90 }}
      >
        <LogoLarge
          initial={animation.initial}
          animate={animation.animate}
          src={ENSLogo}
          alt="SEK9 logo"
        />
        <SearchInput />
        <MainPageBannerContainer>
          <DAOBannerContent />
        </MainPageBannerContainer>
        <div
          style={{ display: 'flex', justifyContent: 'sapce-between', flex: 1 }}
        >
          <Nav style={{ flex: 1 }}>
            {accounts?.length > 0 && !isReadOnly && (
              <NavLink
                active={url === '/address/' + accounts[0]}
                to={'/address/' + accounts[0]}
              >
                {t('c.mynames')}
              </NavLink>
            )}
            <NavLink to="/categories">{t('c.category')}</NavLink>
            <NavLink to="/favourites">{t('c.favourites')}</NavLink>
            <ExternalLink href={aboutPageURL()}>{t('c.about')}</ExternalLink>
          </Nav>
          <Space>
            <Button>Connect Wallet</Button>
            <Input.Group compact style={{ display: 'flex' }}>
              <Input placeholder="Email" />
              <Button>Newsletter</Button>
            </Input.Group>
          </Space>
        </div>
      </Layout.Header> */}
      <main>
        {/* <NetworkStatus>
          <Network>
            {`${network} ${t('c.network')}`}
            {isReadOnly && <ReadOnly>({t('c.readonly')})</ReadOnly>}
            {!isReadOnly && displayName && (
              <Name data-testid="display-name">({displayName})</Name>
            )}
          </Network>
          {!isSafeApp && (
            <NoAccounts
              onClick={isReadOnly ? connectProvider : disconnectProvider}
              buttonText={isReadOnly ? t('c.connect') : t('c.disconnect')}
            />
          )}
        </NetworkStatus> */}
        <Row gutter={16}>
          <Col span={6}>
            <Card title="Newest Categories" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={newestCategories}
                renderItem={category => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClickMore(category)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={category.image_url} />}
                      title={category.name}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Most Viewed - 24 hours" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={mostViewed24HrsCategories}
                renderItem={category => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClickMore(category)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={category.image_url} />}
                      title={category.name}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Most Viewed - 7 days" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={mostViewed7DaysCategories}
                renderItem={category => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClickMore(category)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={category.image_url} />}
                      title={category.name}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Most Purchased - 24 hours" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={mostPurchasedCategories}
                renderItem={category => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClickMore(category)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={category.image_url} />}
                      title={category.name}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        {/* <PermanentRegistrarLogo
          initial={animation.initial}
          animate={animation.animate}
        /> */}
        {/* <Search /> */}
        <Menu mode="horizontal" style={{ marginTop: 20, borderRadius: 5 }}>
          {tags.map((tag, index) => (
            <Menu.Item
              key={index}
              title={tag}
              onClick={() => handleClickMenu(index)}
            >
              {tag}
            </Menu.Item>
          ))}
        </Menu>
        <Table
          style={{ marginTop: 20 }}
          columns={tableColumns}
          dataSource={categories}
          rowKey="id"
          loading={categoriesLoading}
          pagination={{
            defaultCurrent: 1,
            total: Number(pagination.total_count),
            current: Number(pagination.current_page),
            pageSize: Number(pagination.per_page),
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 15],
            onChange: handleChangePage
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                handleClickMore(record)
              } // click row
            }
          }}
        />
      </main>
    </>
  )
}
