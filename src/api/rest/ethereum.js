import { jsonQuery, query } from './common'

export async function apiGetEthereums(searchParams) {
  return await query('/ethereum/all/', { searchParams })
}

export async function apiGetEthereumById(id) {
  return await query(`/ethereum/${id}/`)
}

export async function apiUpdateEthereumById(id, data) {
  return await jsonQuery(`/ethereum/${id}/`, 'PUT', data)
}

export async function apiCreateEthereum(data) {
  return await jsonQuery('/ethereum/create/', 'POST', data)
}

export async function apiDeleteEthereum(id) {
  return await jsonQuery(`/ethereum/${id}/`, 'DELETE')
}
