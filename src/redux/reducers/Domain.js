import {
  SET_DOMAINS,
  DELETE_DOMAINS,
  SHOW_DOMAIN_LOADING,
  SET_DOMAINS_PAGINTATION
} from '../constants/Domain'
import { DEFAUT_PAGINATION } from 'configs/ui'

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  pagination: DEFAUT_PAGINATION,
  domains: []
}

const DOMAIN = (state = initState, action) => {
  switch (action.type) {
    case SET_DOMAINS:
      return {
        ...state,
        loading: false,
        domains: action.domains
      }
    case SET_DOMAINS_PAGINTATION:
      return {
        ...state,
        pagination: action.pagination
      }
    case DELETE_DOMAINS:
      return {
        ...state,
        loading: false,
        domains: [],
        pagination: DEFAUT_PAGINATION
      }
    case SHOW_DOMAIN_LOADING: {
      return {
        ...state,
        loading: true
      }
    }
    default:
      return state
  }
}

export default DOMAIN
