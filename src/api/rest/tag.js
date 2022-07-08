import { jsonQuery, query } from './common'

export async function apiGetTags(searchParams) {
  return await query('/tag/all/', { searchParams })
}

export async function apiGetTagById(id) {
  return await query(`/tag/${id}/`)
}

export async function apiUpdateTagById(id, data) {
  return await jsonQuery(`/tag/${id}/`, 'PUT', data)
}

export async function apiCreateTag(data) {
  return await jsonQuery('/tag/create/', 'POST', data)
}

export async function apiDeleteTag(id) {
  return await jsonQuery(`/tag/${id}/`, 'DELETE')
}
