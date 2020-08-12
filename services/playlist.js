import axios from 'axios'

const getPlayList = (params) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/playlist/list`, {
    params,
  })

const getSubPlayListByID = (id, params = {}) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/sub-playlist/${id}`, {
    params,
  })

const getVideoListByPlaylistID = (playlistID, params = {}) =>
  axios.get(
    `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/playlist/${playlistID}/video-list`,
    {
      params,
    },
  )

const getVideoListBySubplaylistID = (subplaylistID, params = {}) =>
  axios.get(
    `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/sub-playlist/${subplaylistID}/video-list`,
    {
      params,
    },
  )

const searchPlaylist = (params) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/search/playlist`, {
    params,
  })

const searchVideo = (params) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/search/video`, {
    params,
  })

const createPlaylist = (data) =>
  axios.post(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/playlist/create`, data)

const createSubPlaylist = (data) =>
  axios.post(
    `${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/sub-playlist/create`,
    data,
  )
const getSubPlaylist = (data) =>
  axios.get(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/sub-playlist/list`, data)

const deletePlaylist = (id) =>
  axios.delete(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/playlist/${id}`)

const deleteSubPlaylist = (id) =>
  axios.delete(`${process.env.NEXT_PUBLIC_SERVICE_PREFIX_URL}/api/sub-playlist/${id}`)

export {
  getPlayList,
  getVideoListByPlaylistID,
  getVideoListBySubplaylistID,
  getSubPlayListByID,
  searchPlaylist,
  searchVideo,
  createPlaylist,
  createSubPlaylist,
  deletePlaylist,
  deleteSubPlaylist,
  getSubPlaylist,
}
