import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Spin } from 'antd'

import { validateName, parseSearchTerm } from '../utils/utils'
import { useScrollTo } from '../components/hooks'
import { GET_SINGLE_NAME } from '../graphql/queries'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'
import Name from '../components/SingleName/Name'

const SINGLE_NAME = gql`
  query singleNameQuery @client {
    isENSReady
    networkId
  }
`

function SingleName({
  match: {
    params: { name: searchTerm }
  },
  location: { pathname }
}) {
  useScrollTo(0)

  const [valid, setValid] = useState(undefined)
  const [type, setType] = useState(undefined)
  const [name, setNormalisedName] = useState('')
  let errorMessage

  const {
    data: { isENSReady }
  } = useQuery(SINGLE_NAME)
  const { data, loading, error, refetch } = useQuery(GET_SINGLE_NAME, {
    variables: { name },
    fetchPolicy: 'no-cache',
    context: {
      queryDeduplication: false
    }
  })

  useEffect(() => {
    let normalisedName
    if (isENSReady) {
      try {
        // This is under the assumption that validateName never returns false
        normalisedName = validateName(searchTerm)
        setNormalisedName(normalisedName)
        document.title = searchTerm
      } catch {
        document.title = 'Error finding name'
      } finally {
        parseSearchTerm(normalisedName || searchTerm).then(_type => {
          if (_type === 'supported' || _type === 'tld' || _type === 'search') {
            setValid(true)

            setType(_type)
          } else {
            if (_type === 'invalid') {
              setType('domainMalformed')
            } else {
              setType(_type)
            }
            setValid(false)
          }
        })
      }
    }
  }, [searchTerm, isENSReady])

  if (valid) {
    if (loading)
      return (
        <Spin
          style={{ margin: 'auto', width: '100%' }}
          size="large"
          className="white-spin"
        />
      )
    if (error) return <div>{(console.log(error), JSON.stringify(error))}</div>
    if (data?.singleName)
      return (
        <Name
          details={data.singleName}
          name={name}
          pathname={pathname}
          type={type}
          refetch={refetch}
        />
      )
  }

  if (valid === false) {
    if (type === 'invalid') {
      errorMessage = 'domainMalformed'
    } else if (type === 'short') {
      errorMessage = 'tooShort'
    } else {
      errorMessage = type
    }
    return (
      <SearchErrors errors={[errorMessage]} searchTerm={name || searchTerm} />
    )
  } else {
    return (
      <Spin
        style={{ margin: 'auto', width: '100%' }}
        size="large"
        className="white-spin"
      />
    )
  }
}

export default SingleName
