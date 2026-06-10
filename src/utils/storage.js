export function setLoginStatus(isLoggedIn) {
  localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false')
}

export function getLoginStatus() {
  return localStorage.getItem('isLoggedIn') === 'true'
}

export function setUsername(username) {
  localStorage.setItem('username', username)
}

export function getUsername() {
  return localStorage.getItem('username') || ''
}

export function clearLoginInfo() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
}
