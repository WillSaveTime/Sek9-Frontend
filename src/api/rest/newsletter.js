import { jsonQuery, query } from './common'

export async function apiGetNewsletters(searchParams) {
  return await query('/newsletter/all/', { searchParams })
}

export async function apiGetNewsletterById(id) {
  return await query(`/newsletter/${id}/`)
}

export async function apiUpdateNewsletterById(id, data) {
  return await jsonQuery(`/newsletter/${id}/`, 'PUT', data)
}

export async function apiCreateNewsletter(data) {
  return await jsonQuery('/newsletter/create/', 'POST', data)
}

export async function apiDeleteNewsletter(id) {
  return await jsonQuery(`/newsletter/${id}/`, 'DELETE')
}
