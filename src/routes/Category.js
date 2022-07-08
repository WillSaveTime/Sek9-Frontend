import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import DomainItem from '../components/DomainItem/DomainItem'
import mq from '../mediaQuery'

import { H2 as DefaultH2 } from '../components/Typography/Basic'
import LargeHeart from '../components/Icons/LargeHeart'
import FirebaseService from 'services/FirebaseService'
import { apiGetCategories } from 'api/rest/category'
import {
  NonMainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'
import CategoryItem from 'components/CategoryItem'
import { Row, Col, Typography, Pagination, Spin } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { first, last } from 'lodash-es'
import { DEFAUT_PAGINATION } from 'configs/ui'

function Category() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = 'SEK9'
  }, [])

  const [categories, setCategories] = useState([])
  const [paginating, setPaginating] = useState(false)
  const [pagination, setPagination] = useState(DEFAUT_PAGINATION)
  const [loading, setLoading] = useState(false)

  // const handleChangePage = current_page => {
  //   setPaginating(true)
  //   setPagination({ ...pagination, current_page })
  // }

  const handleChangePage = (current_page, per_page) => {
    setPaginating(true)
    setPagination({ ...pagination, current_page, per_page })
  }

  useEffect(() => {
    paginating && getCategories()
    setPaginating(false)
  }, [paginating, pagination])

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    setLoading(true)
    const searchParams = {
      per_page: pagination.per_page,
      page_no: pagination.current_page
    }
    const res = await apiGetCategories(searchParams)
    setLoading(false)
    if (res && !res.error) {
      setCategories(res.dataset)
      setPagination(res.pagination)
    }
  }

  return (
    <>
      {/* <NonMainPageBannerContainer>
        <DAOBannerContent />
      </NonMainPageBannerContainer> */}
      <Typography.Title style={{ textAlign: 'center', color: '#FFF' }}>
        {t('category.categoryTitle')}
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
            {categories &&
              categories.length > 0 &&
              categories.map(category => (
                <Col span={6}>
                  <CategoryItem
                    category={category}
                    key={category.id.toString()}
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

const CategoryContainer = styled('div')`
  padding-bottom: 60px;
`

export default Category
