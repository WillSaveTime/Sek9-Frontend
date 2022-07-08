import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Pagination, Spin, Typography, message, Layout } from 'antd'
import EthCard from 'components/EthCard'
import { DEFAUT_PAGINATION } from 'configs/ui'
import { connect } from 'react-redux'
import { apiDeleteFavorite, apiGetFavorites } from 'api/rest/favorite'
import { addFavorite, removeFavorite } from 'redux/actions/Auth'
import utils from 'utils'

function Favourites({ auth, removeFavorite }) {
  const history = useHistory()
  const [favorites, setFavorites] = useState(auth.favorites)
  const [loading, setLoading] = useState(false)
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  useEffect(() => {
    auth.token && paginating && getEthereums(searchTerm)
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    auth.token && getFavorites()
  }, [auth])

  const getFavorites = async category_id => {
    setLoading(true)
    const res = await apiGetFavorites({
      per_page: pagination.per_page,
      page_no: pagination.current_page,
      user_id: auth.member.id
    })
    if (res && !res.error) {
      setFavorites(res.dataset)
      setPagination(res.pagination)
    }
    setLoading(false)
  }

  const handleFavortie = async (etherum, favorite) => {
    if (auth.token) {
      if (favorite) {
        const res = await apiDeleteFavorite(favorite.id)
        if (!res.error) {
          removeFavorite(favorite)
          setFavorites(utils.deleteArrayRow(favorites, 'id', favorite.id))
        } else {
          res.error && message.info(res.error)
        }
      }
    } else {
      message.info('You have to sign in first')
    }
  }

  if (!auth.token) {
    return (
      <Typography.Title style={{ color: 'white' }}>
        You have not signed in.{' '}
        <Link
          style={{ textDecoration: 'underline', color: 'white' }}
          to="/login"
        >
          Sign in
        </Link>
      </Typography.Title>
    )
  }

  return (
    <Layout.Content style={{ width: '80vw' }}>
      <Typography.Title style={{ textAlign: 'center', color: '#FFF' }}>
        {'Favorites'}
      </Typography.Title>
      {loading ? (
        <Spin
          style={{ margin: 'auto', width: '100%' }}
          size="large"
          className="white-spin"
        />
      ) : (
        <>
          <Row gutter={16}>
            {favorites &&
              favorites.length > 0 &&
              favorites.map(elm => (
                <Col span={6} key={elm.id}>
                  <EthCard
                    data={elm.ethereum}
                    hoverable
                    onClick={() => history.push(`/name/${elm.eth_name}`)}
                    onFavorite={value => handleFavortie(elm.ethereum, value)}
                    favorite={elm}
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
    </Layout.Content>
  )
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

const mapDispatchToProps = { addFavorite, removeFavorite }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Favourites)
