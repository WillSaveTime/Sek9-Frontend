import React, { Fragment } from 'react'
import Header from '../Header/Header'
import AuthContainer from './AuthContainer'
import styled from '@emotion/styled/macro'
import bg from 'assets/heroBG.jpg'
import { Layout } from 'antd'
import SideNav from '../SideNav/SideNav'
import Main from './Main'

const Hero = styled(Layout)`
  background: url(${bg});
  background-size: cover;
  min-height: 100vh !important;
  background-attachment: fixed;
`

const AuthLayout = ({ children }) => (
  <Hero>
    <Header />
    <AuthContainer>
      {/* <SideNav /> */}
      {children}
    </AuthContainer>
  </Hero>
)

export default AuthLayout
