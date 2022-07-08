import { jsonQuery, query } from './common'

export async function apiGetFeedbacks(searchParams) {
  return await query('/feedback/all/', { searchParams })
}

export async function apiGetFeedbackById(id) {
  return await query(`/feedback/${id}/`)
}

export async function apiUpdateFeedbackById(id, data) {
  return await jsonQuery(`/feedback/${id}/`, 'PUT', data)
}

export async function apiCreateFeedback(data) {
  return await jsonQuery('/feedback/create/', 'POST', data)
}

export async function apiDeleteFeedback(id) {
  return await jsonQuery(`/feedback/${id}/`, 'DELETE')
}
