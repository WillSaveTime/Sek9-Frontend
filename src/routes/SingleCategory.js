import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Pagination, Spin, Typography, message, Menu } from 'antd'
import EthCard from 'components/EthCard'
import { apiGetCategoryById } from 'api/rest/category'
import { apiGetEthereums } from 'api/rest/ethereum'
import { DEFAUT_PAGINATION } from 'configs/ui'
import { connect } from 'react-redux'
import { apiCreateFavorite, apiDeleteFavorite } from 'api/rest/favorite'
import { addFavorite, removeFavorite } from 'redux/actions/Auth'
import { apiGetDomains } from 'api/rest/domain'

function SingleCategory({
  match: {
    params: { category: searchTerm }
  },
  auth,
  addFavorite,
  removeFavorite
}) {
  const history = useHistory()
  const [eths, setEths] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState({ name: '' })
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)
  const [domains, setDomains] = useState(['All'])
  const [selectedDomain, setSelectedDomain] = useState('All')

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  useEffect(() => {
    paginating && getEthereums(searchTerm)
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    if (searchTerm) {
      setLoading(true)
      // FirebaseService.getEthereums(searchTerm, 0, '', setEthereums)
      getCategory(searchTerm)
      getEthereums(searchTerm)
    }
  }, [searchTerm, selectedDomain])

  useEffect(() => {
    getDomains()
  }, [])

  const getCategory = async category_id => {
    const res = await apiGetCategoryById(category_id)
    if (res && !res.error) {
      setCategory(res)
    }
  }

  const getEthereums = async category_id => {
    setLoading(true)
    const searchParams = {
      per_page: pagination.per_page,
      page_no: pagination.current_page,
      category_id: category_id
    }

    if (selectedDomain !== 'All') {
      searchParams.domain_name = selectedDomain
    }

    const res = await apiGetEthereums(searchParams)
    if (res && !res.error) {
      setEths(res.dataset)
      setPagination(res.pagination)
    }
    setLoading(false)
  }

  const getDomains = async () => {
    const res = await apiGetDomains({ per_page: 100 })

    if (res || res.error) {
      const tagArray = res.dataset.map(t => t.name)
      setDomains(['All', ...tagArray])
    }
  }

  const handleFavortie = async (etherum, favorite) => {
    console.log('favorite===', favorite)
    if (auth.token) {
      if (favorite) {
        const res = await apiDeleteFavorite(favorite.id)
        if (!res.error) {
          removeFavorite(favorite)
        } else {
          res.error && message.info(res.error)
        }
      } else {
        const res = await apiCreateFavorite({
          member: auth.member.id,
          ethereum: etherum.id
        })
        if (res && !res.error) {
          addFavorite(res)
        } else {
          res.error && message.info(res.error)
        }
      }
    } else {
      message.info('You have to sign in first')
    }
  }
  const handleClickMenu = index => {
    setSelectedDomain(domains[index])
  }
  console.log()
  return (
    <>
      <Typography.Title style={{ textAlign: 'center', color: '#FFF' }}>
        {category.name}
      </Typography.Title>
      <Menu
        mode="horizontal"
        style={{
          marginTop: 20,
          borderRadius: 5,
          justifyContent: 'center',
          marginBottom: 20
        }}
      >
        {domains.map((domain, index) => (
          <Menu.Item
            key={index}
            title={domain}
            onClick={() => handleClickMenu(index)}
            style={{ textTransform: 'uppercase' }}
          >
            {domain}
          </Menu.Item>
        ))}
      </Menu>
      {loading ? (
        <Spin
          style={{ margin: 'auto', width: '100%' }}
          size="large"
          className="white-spin"
        />
      ) : (
        <>
          <Row gutter={16}>
            {eths &&
              eths.length > 0 &&
              eths.map(elm => (
                <Col span={6} key={elm.id}>
                  <EthCard
                    key={elm.id}
                    data={elm}
                    hoverable
                    onClick={() => history.push(`/name/${elm.eth_name}`)}
                    onFavorite={value => handleFavortie(elm, value)}
                    favorite={auth.favorites.find(
                      fav => fav.ethereum.id === elm.id
                    )}
                  />
                </Col>
              ))}
          </Row>
          <Pagination
            defaultCurrent={1}
            total={Number(pagination.total_count)}
            current={Number(pagination.current_page)}
            pageSize={Number(pagination.per_page)}
            showSizeChanger
            defaultPageSize={24}
            pageSizeOptions={[16, 20, 24]}
            onChange={handleChangePage}
          />
        </>
      )}
    </>
  )
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

const mapDispatchToProps = { addFavorite, removeFavorite }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleCategory)
