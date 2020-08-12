/* eslint-disable consistent-return */

import React, { createContext, useState, useEffect } from 'react'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'

import { auth } from '../../services'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)

  const getMe = async () => {
    const accessToken = cookie.get('accessToken')

    if (accessToken) {
      try {
        const { data } = await auth.getMe(accessToken)
        setUser(data)
      } catch (err) {
        setUser('invalid_token')
        console.log('invalid access token')
      }
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  const clearUser = () => {
    setUser(null)
    cookie.remove('accessToken')
    router.push('/backoffice/login')
  }

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}
