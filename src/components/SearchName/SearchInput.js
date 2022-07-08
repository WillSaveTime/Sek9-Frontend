/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from '../../assets/search.svg'
import mq from '../../mediaQuery'
import LanguageSwitcher from '../LanguageSwitcher'

const SearchForm = styled('form')`
  display: flex;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon}) no-repeat;
    background-size: cover;
  }

  input {
    padding: 20px 0 20px 55px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccd4da;
    }
  }

  button {
    ${p => (p && p.hasSearch ? 'background: #5284ff;' : 'background: #c7d3e3;')}
    color: white;
    font-size: 22px;
    font-family: Overpass;
    height: 90px;
    width: 162px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      ${p => (p && p.hasSearch ? 'cursor: pointer;' : 'cursor: default;')}
    }
  }
`

const SEARCH_QUERY = gql`
  query searchQuery {
    isENSReady @client
  }
`

function SearchInput({ className, style }) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(null)
  const {
    data: { isENSReady }
  } = useQuery(SEARCH_QUERY)
  const history = useHistory()
  let input

  const handleParse = e => {
    setInputValue(
      e.target.value
        .split('.')
        .map(term => term.trim())
        .join('.')
    )
  }
  const hasSearch = isENSReady
  return (
    <Input.Search
      placeholder={t('search.placeholder')}
      allowClear
      disabled={!hasSearch}
      onSearch={async e => {
        console.log('==== e: ', e)
        // console.log(e.target.value)
        // e.preventDefault()
        console.log('==== hasSearch: ', hasSearch, inputValue)
        if (!hasSearch) return
        const type = await parseSearchTerm(inputValue)
        console.log('==== type: ', type, input)
        let searchTerm
        if (inputValue) {
          // inputValue doesn't have potential whitespace
          searchTerm = inputValue.toLowerCase()
        }
        if (!searchTerm || searchTerm.length < 1) {
          return
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`)
          return
        }

        // input.value = ''
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`)
          return
        } else {
          history.push(`/search/${searchTerm}`)
        }
      }}
      onChange={handleParse}
      style={{ width: 304 }}
    />
  )
}

export default SearchInput
