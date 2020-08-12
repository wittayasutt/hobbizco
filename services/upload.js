import axios from 'axios'

const uploadVideo = (data) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/file-upload/video`, data)

const uploadCover = (data) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/file-upload/cover`, data)

const uploadMaterial = (data) =>
  axios.post(
    `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/file-upload/material`,
    data,
  )

export { uploadVideo, uploadCover, uploadMaterial }
