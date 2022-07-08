import { jsonQuery, query } from './common'

export async function apiGetFeedbackAnswers(searchParams) {
  return await query('/feedback_answer/all/', { searchParams })
}

export async function apiGetFeedbackAnswerById(id) {
  return await query(`/feedback_answer/${id}/`)
}

export async function apiUpdateFeedbackAnswerById(id, data) {
  return await jsonQuery(`/feedback_answer/${id}/`, 'PUT', data)
}

export async function apiCreateFeedbackAnswer(data) {
  return await jsonQuery('/feedback_answer/create/', 'POST', data)
}

export async function apiDeleteFeedbackAnswer(id) {
  return await jsonQuery(`/feedback_answer/${id}/`, 'DELETE')
}
