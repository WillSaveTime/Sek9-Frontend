/* eslint-disable jsx-a11y/anchor-is-valid */
export const restApiSettings = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://www.sek9.com/api/v1'
  // baseURL:
  // process.env.REACT_APP_API_BASE_URL || 'http://192.168.0.121:8000/api/v1'
}

export const notifyExceptionUrlPrefixs = [
  '/auth/register/',
  '/auth/login/',
  '/auth/logout/',
  '/auth/forget_password/',
  '/member/search/',
  '/message/send_message/',
  '/fetch_events/',
  '/push_token/create/',
  'ipr/create/',
  '/notification/',
  '/notifications/',
  '/activity/',
  '/activities/'
]

export const networkStatusExceptionUrlPrefixs = [
  '/counts/',
  '/invoice_counts/',
  '/fetch_events/',
  '/push_token/create/',
  'ipr/create/',
  '/notification/',
  '/notifications/',
  '/activity/',
  '/activities/'
]
