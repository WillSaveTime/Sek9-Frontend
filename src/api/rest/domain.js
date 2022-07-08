import { jsonQuery, query } from './common'

export async function apiGetDomains(searchParams) {
  return await query('/domain/all/', { searchParams })
}

export async function apiGetDomainById(id) {
  return await query(`/domain/${id}/`)
}

export async function apiUpdateDomainById(id, data) {
  return await jsonQuery(`/domain/${id}/`, 'PUT', data)
}

export async function apiCreateDomain(data) {
  return await jsonQuery('/domain/create/', 'POST', data)
}

export async function apiDeleteDomain(id) {
  return await jsonQuery(`/domain/${id}/`, 'DELETE')
}
