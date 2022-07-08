import styled from '@emotion/styled/macro'
import mq from '../../mediaQuery'

const AuthContainer = styled('div')`
  padding: 0;
  margin: auto auto;

  ${mq.medium`
    padding: 0 40px 0;
  `}
`

export default AuthContainer
