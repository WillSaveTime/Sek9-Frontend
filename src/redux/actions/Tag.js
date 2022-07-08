import {
  SET_TAGS,
  DELETE_TAGS,
  SET_TAGS_PAGINTATION,
  SHOW_TAG_LOADING
} from '../constants/Tag'

export function setTags(tags) {
  return {
    type: SET_TAGS,
    tags
  }
}

export function setPagination(pagination) {
  return {
    type: SET_TAGS_PAGINTATION,
    pagination
  }
}

export function deleteTags() {
  return {
    type: DELETE_TAGS
  }
}

export function showTagLoading() {
  return {
    type: SHOW_TAG_LOADING
  }
}
