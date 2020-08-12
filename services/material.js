import axios from 'axios'

const createMaterial = (data) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/material/create`, data)

const getMateriaList = (params = {}) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/material/list`, {
    params,
  })

const deleteMaterial = (id) =>
  axios.delete(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/material/${id}`)

export { createMaterial, getMateriaList, deleteMaterial }
