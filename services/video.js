import axios from 'axios'

const createVideo = (data) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/create`, data)

const updateVideo = (id, data) =>
  axios.put(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/${id}`, data)

const getVideoBySlug = (slug, params = {}) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/${slug}`, {
    params,
  })

const getVideoSuggestion = (params = {}) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/suggest-video`, {
    params,
  })

const getList = (params = {}) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/list`, {
    params,
  })

const deleteVideo = (id) =>
  axios.delete(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/${id}`)

const getVideoNameList = () =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/asset-name/video`)

const getCoverNameList = () =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/asset-name/cover`)

const getMaterialNameList = () =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/video/asset-name/material`)

export {
  createVideo,
  getVideoBySlug,
  getVideoSuggestion,
  getList,
  deleteVideo,
  updateVideo,
  getVideoNameList,
  getCoverNameList,
  getMaterialNameList,
}
