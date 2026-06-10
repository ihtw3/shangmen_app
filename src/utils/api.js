const BASE_URL = 'http://localhost:8000/api'

export async function request(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, defaultOptions)
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

export async function login(username, password) {
  return await request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

export async function register(username, password) {
  return await request('/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

export async function getOrders(username) {
  return await request(`/orders?username=${encodeURIComponent(username)}`)
}

export async function createOrder(orderData) {
  return await request('/order', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

export async function getAddresses(username) {
  return await request(`/addresses?username=${encodeURIComponent(username)}`)
}

export async function addAddress(addressData) {
  return await request('/address', {
    method: 'POST',
    body: JSON.stringify(addressData)
  })
}

export async function updateAddress(id, addressData) {
  return await request(`/address/${id}`, {
    method: 'PUT',
    body: JSON.stringify(addressData)
  })
}

export async function deleteAddress(id) {
  return await request(`/address/${id}`, {
    method: 'DELETE'
  })
}
