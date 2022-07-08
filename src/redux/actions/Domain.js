import {
  SET_DOMAINS,
  DELETE_DOMAINS,
  SET_DOMAINS_PAGINTATION,
  SHOW_DOMAIN_LOADING
} from '../constants/Domain'

export function setDomains(domains) {
  return {
    type: SET_DOMAINS,
    domains
  }
}

export function setPagination(pagination) {
  return {
    type: SET_DOMAINS_PAGINTATION,
    pagination
  }
}

export function deleteDomains() {
  return {
    type: DELETE_DOMAINS
  }
}

export function showDomainLoading() {
  return {
    type: SHOW_DOMAIN_LOADING
  }
}
