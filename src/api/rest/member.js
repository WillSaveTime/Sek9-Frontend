import { jsonQuery, query } from './common'

export async function apiGetMembers(searchParams) {
  return await query('/member/list/', { searchParams })
}

export async function apiGetMemberById(id) {
  return await query(`/member/${id}/`)
}

export async function apiUpdateMemberById(id, data) {
  return await jsonQuery(`/member/${id}/`, 'PUT', data)
}

export async function apiCreateMember(data) {
  return await jsonQuery('/member/create/', 'POST', data)
}
