export const getLocalToken = () =>
  localStorage.getItem('AUTH_INFO') != null
    ? JSON.parse(localStorage.getItem('AUTH_INFO'))
    : null

export const setLocalToken = info =>
  localStorage.setItem('AUTH_INFO', JSON.stringify(info))

export const removeLocalToken = () => {
  localStorage.removeItem('AUTH_INFO')
}
