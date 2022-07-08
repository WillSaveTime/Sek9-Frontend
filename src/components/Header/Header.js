import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import ENSLogo from 'assets/sek9-full-logo-white.png'
import { Link, useHistory } from 'react-router-dom'
import { gql } from '@apollo/client'
import { MailOutlined } from '@ant-design/icons'
import { setFavorites, signOut } from 'redux/actions/Auth'
import { Form, Layout, Button, Space, Input } from 'antd'
import SearchInput from '../SearchName/SearchInput'
import { useQuery } from '@apollo/client'
import mq, { useMediaMin, useMediaMax } from '../../mediaQuery'
import { connect } from 'react-redux'
import { apiGetFavorites } from 'api/rest/favorite'
import { NavProfile } from 'components/layout-components/NavProfile'
import { apiCreateNewsletter } from 'api/rest/newsletter'

const LogoLarge = styled(motion.img)`
  width: 200px;
  object-fit: cover;
  margin-right: 20px;
  cursor: pointer;
  ${mq.medium`
    width: 150px;
  `}
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

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

function HeaderContainer({ token, member, setFavorites, signOut }) {
  const history = useHistory()
  const [form] = Form.useForm()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const mediumBP = useMediaMin('medium')
  const mediumBPMax = useMediaMax('medium')
  const toggleMenu = () => setMenuOpen(!isMenuOpen)
  const { t } = useTranslation()
  const url = ''

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

  const {
    data: { network, displayName, isReadOnly, isSafeApp }
  } = useQuery(HOME_DATA, {
    variables: { address: accounts?.[0] }
  })

  useEffect(() => {
    token && getFavorites()
  }, [token])

  const getFavorites = async () => {
    const res = await apiGetFavorites({ user_id: member.id, per_page: 100 })
    if (res && !res.error) {
      setFavorites(res.dataset)
    }
  }
  useEffect(() => {
    setTimeout(() => {
      form.setFields([])
    }, 3000)
  })

  const handleRequestNewsletter = async values => {
    // const res = await apiCreateNewsletter({m})
    console.log('vvv=', values)
  }

  return (
    <Layout.Header
      className="header"
      style={{ background: 'transparent', alignItems: 'center', height: 90 }}
    >
      <LogoLarge
        onClick={() => history.push('/')}
        initial={animation.initial}
        animate={animation.animate}
        src={ENSLogo}
        alt="SEK9 logo"
      />
      <SearchInput />
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
          <NavLink to="/categories">{t('c.categories')}</NavLink>
          <NavLink to="/favourites">{t('c.favourites')}</NavLink>
          {/* <NavLink to="/faq">{t('c.faq')}</NavLink> */}
          <NavLink to="/about">{t('c.about')}</NavLink>
        </Nav>
        <Space>
          {/* <Form form={form} onFinish={handleRequestNewsletter}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="email"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'email', message: 'Invalid email!' }
                ]}
              >
                <Input placeholder="Email Newsletter" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button htmlType="submit" icon={<MailOutlined />} />
              </Form.Item>
            </Input.Group>
          </Form> */}
          <Button>Connect wallet</Button>
          {token ? (
            <NavProfile signOut={signOut} profile={member} />
          ) : (
            <Button onClick={() => history.push('/login')}>Sign in</Button>
          )}
        </Space>
      </div>
    </Layout.Header>
  )
}

const mapStateToProps = ({ auth }) => {
  const { token, member } = auth
  return { token, member }
}

const mapDispatchToProps = { setFavorites, signOut }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)
