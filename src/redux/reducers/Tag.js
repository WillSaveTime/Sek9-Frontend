import {
  SET_TAGS,
  DELETE_TAGS,
  SHOW_TAG_LOADING,
  SET_TAGS_PAGINTATION
} from '../constants/Tag'
import { DEFAUT_PAGINATION } from 'configs/ui'

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  pagination: DEFAUT_PAGINATION,
  tags: []
}

const tag = (state = initState, action) => {
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        loading: false,
        tags: action.tags
      }
    case SET_TAGS_PAGINTATION:
      return {
        ...state,
        pagination: action.pagination
      }
    case DELETE_TAGS:
      return {
        ...state,
        loading: false,
        tags: [],
        pagination: DEFAUT_PAGINATION
      }
    case SHOW_TAG_LOADING: {
      return {
        ...state,
        loading: true
      }
    }
    default:
      return state
  }
}

export default tag
