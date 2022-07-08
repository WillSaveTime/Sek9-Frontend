import { jsonQuery, query } from './common'

export async function apiGetFavorites(searchParams) {
  return await query('/favorit/all/', { searchParams })
}

export async function apiGetFavoriteById(id) {
  return await query(`/favorit/${id}/`)
}

export async function apiUpdateFavoriteById(id, data) {
  return await jsonQuery(`/favorit/${id}/`, 'PUT', data)
}

export async function apiCreateFavorite(data) {
  return await jsonQuery('/favorit/create/', 'POST', data)
}

export async function apiDeleteFavorite(id) {
  return await jsonQuery(`/favorit/${id}/`, 'DELETE')
}
