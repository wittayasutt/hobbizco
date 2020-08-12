import axios from 'axios'

const login = (params) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/user/login`, params)

const getMe = (accessToken) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/user/me`, {
    headers: {
      authorization: accessToken,
    },
  })

export default { login, getMe }
