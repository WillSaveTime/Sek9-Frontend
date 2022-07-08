import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from '../mediaQuery'

import ENSLogo from '../assets/sek9-full-logo-blue.png'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 73%;
  ${mq.medium`
    width: 60%
  `}
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: auto;

  ${mq.medium`
    width: 200px;
  `}
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ENSLogo} />
    {/* <LogoTyped color={color} /> */}
  </LogoContainer>
)

export default Logo
