/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  Spinner,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

import Router, { useRouter } from 'next/router'
import Select from 'react-select'
import MultiSelect from 'react-multi-select-component'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import { ExclamationIcon, CheckIcon } from '../../components/icon'
import { uploadVideo, uploadCover } from '../../services/upload'
import { getMateriaList } from '../../services/material'

import { getPlayList } from '../../services/playlist'
import {
  createVideo,
  getVideoBySlug,
  updateVideo,
  getVideoNameList,
  getCoverNameList,
} from '../../services/video'

const ErrorRequire = ({ label }) => (
  <ErrorWrapper>
    <ExclamationIcon />
    <span className="_pdl-8px _fs-300">{label}</span>
  </ErrorWrapper>
)

const AddNewVideoPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    getValues,
    watch,
    reset,
    setError,
    clearError,
  } = useForm()
  const watchAllFields = watch()

  const [playlist, setPlaylist] = useState({
    topSeries: [],
    topSeriesInClass: [],
    roles: [],
    rolesSecondary: [],
    subjects: [],
    subjectsSecondary: [],
    wholeSchool: [],
    wholeSchoolSecondary: [],
  })
  const [subPlaylist, setSubPlaylist] = useState({
    subjects: [],
    subjectsSecondary: [],
    wholeSchool: [],
    wholeSchoolSecondary: [],
  })

  const [videoUrl, setVideoUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [modal, setModal] = useState(false)
  const [videUploading, setVideUploading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [materialUrl, setMaterialUrl] = useState([])

  const [videoID, setVideoID] = useState()

  const [nameList, setNameList] = useState({
    video: [],
    cover: [],
    material: [],
  })

  const { slug } = router.query

  const fetchVideoBySlug = async () => {
    const resultVideo = await getVideoBySlug(slug)
    const { data } = resultVideo

    if (data) {
      setVideoID(data.id)
      setValue('title', data.title)
      setValue('sub_title', data.sub_title)
      setValue('slug', data.slug)
      setValue('summary', data.summary.replace(/<br \/>/g, '\r\n'))
      setValue('duration_minute', data.duration_minute)
      setValue('video_url_temp', data.video_url.replace('public/video/', '')) // temp

      setVideoUrl(data.video_url.replace('public/video/', ''))
      setImageUrl(data.image_cover_url.replace('public/cover/', ''))

      const dataPlaylist = { ...playlist }
      const dataSubPlaylist = { ...subPlaylist }

      if (data?.video_materials?.length > 0) {
        setMaterialUrl(
          data?.video_materials.map((item) => ({
            label: `${item.material.name} (${item.material.material_url})`,
            value: item.material_id,
          })),
        )
      }
      data?.video_playlists?.forEach((playlistItem) => {
        const subCateID = playlistItem?.playlist?.sub_category_id
        const cateID = playlistItem?.playlist?.sub_category?.category_id
        switch (cateID) {
          case 2:
            setValue('top-series', true)
            if (subCateID === 1) {
              dataPlaylist.topSeries.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            } else {
              dataPlaylist.topSeriesInClass.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            }
            break
          case 3:
            setValue('subjects', true)
            if (subCateID === 3) {
              dataPlaylist.subjects.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            } else {
              dataPlaylist.subjectsSecondary.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            }
            break
          case 4:
            setValue('roles', true)
            if (subCateID === 5) {
              dataPlaylist.roles.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            } else {
              dataPlaylist.rolesSecondary.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            }
            break
          case 5:
            setValue('wholeSchool', true)
            if (subCateID === 7) {
              dataPlaylist.wholeSchool.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            } else {
              dataPlaylist.wholeSchoolSecondary.push({
                value: playlistItem?.playlist?.id,
                label: playlistItem?.playlist?.name,
              })
            }

            break
          default:
            break
        }
      })

      data?.video_subplaylists?.forEach((subPlaylistItem) => {
        const subCateID = subPlaylistItem?.sub_playlist?.playlist?.sub_category_id
        const cateID = subPlaylistItem?.sub_playlist?.playlist?.sub_category?.category_id
        switch (cateID) {
          case 3:
            if (subCateID === 3) {
              dataSubPlaylist.subjects.push({
                value: subPlaylistItem?.sub_playlist?.id,
                label: subPlaylistItem?.sub_playlist?.name,
              })
            } else {
              dataSubPlaylist.subjectsSecondary.push({
                value: subPlaylistItem?.sub_playlist?.id,
                label: subPlaylistItem?.sub_playlist?.name,
              })
            }

            break
          case 5:
            if (subCateID === 7) {
              dataSubPlaylist.wholeSchool.push({
                value: subPlaylistItem?.sub_playlist?.id,
                label: subPlaylistItem?.sub_playlist?.name,
              })
            } else {
              dataSubPlaylist.wholeSchoolSecondary.push({
                value: subPlaylistItem?.sub_playlist?.id,
                label: subPlaylistItem?.sub_playlist?.name,
              })
            }
            break
          default:
            break
        }
      })
      setPlaylist(dataPlaylist)

      setSubPlaylist(dataSubPlaylist)
    }
  }

  const onSubmit = async (data) => {
    if (!videoUrl && !data.video_url_temp) {
      return setError('file')
    }

    if (!imageUrl) {
      return setError('image')
    }

    const playlist_ids = []
    const sub_playlist_ids = []

    if (data['top-series']) {
      const ids = playlist.topSeries.map((item) => item.value)
      const idsInClass = playlist.topSeriesInClass.map((item) => item.value)
      playlist_ids.push(...ids, ...idsInClass)
    }

    if (data.roles) {
      const ids = playlist.roles.map((item) => item.value)
      const idsSecondary = playlist.rolesSecondary.map((item) => item.value)
      playlist_ids.push(...ids, ...idsSecondary)
    }

    if (data.subjects) {
      const ids = playlist.subjects.map((item) => item.value)
      const idsSecondary = playlist.subjectsSecondary.map((item) => item.value)
      const idsSub = subPlaylist.subjects.map((item) => item.value)
      const idsSubSecondary = subPlaylist.subjectsSecondary.map((item) => item.value)
      playlist_ids.push(...ids, ...idsSecondary)
      sub_playlist_ids.push(...idsSub, ...idsSubSecondary)
    }

    if (data.wholeSchool) {
      const ids = playlist.wholeSchool.map((item) => item.value)
      const idsSecondary = playlist.wholeSchoolSecondary.map((item) => item.value)
      const idsSub = subPlaylist.wholeSchool.map((item) => item.value)
      const idsSubSecondary = subPlaylist.wholeSchoolSecondary.map((item) => item.value)
      playlist_ids.push(...ids, ...idsSecondary)
      sub_playlist_ids.push(...idsSub, ...idsSubSecondary)
    }

    const material_ids = materialUrl?.map((item) => item.value)

    const body = {
      title: data.title,
      slug: data.slug,
      sub_title: data.sub_title,
      video_url: `public/video/${data.video_url_temp || videoUrl}`,
      image_cover_url: `public/cover/${imageUrl}`,
      summary: data.summary.replace(/\r\n|\r|\n/g, '<br />'),
      duration_minute: data.duration_minute,
      playlist_ids,
      sub_playlist_ids,
      material_ids,
    }

    if (videoID) {
      await updateVideo(videoID, body)
    } else {
      await createVideo(body)
    }

    return setModal(true)
  }

  const clearForm = () => {
    reset()
    setPlaylist({
      topSeries: [],
      topSeriesInClass: [],
      roles: [],
      rolesSecondary: [],
      subjects: [],
      subjectsSecondary: [],
      wholeSchool: [],
      wholeSchoolSecondary: [],
    })

    setSubPlaylist({
      subjects: [],
      subjectsSecondary: [],
      wholeSchool: [],
      wholeSchoolSecondary: [],
    })

    setVideoUrl('')
    setImageUrl('')
    setMaterialUrl([])
  }

  const onUploadVideo = async (e) => {
    setVideUploading(true)
    const selectedFile = e.target.files[0]
    const data = new FormData()
    data.append('file', selectedFile)
    const result = await uploadVideo(data)
    const path = result?.data?.path
    setVideoUrl(path.replace('public/video/', ''))
    setValue('video_url_temp', path.replace('public/video/', ''))
    clearError('video_url_temp')
    setVideUploading(false)
  }

  const onUploadImage = async (e) => {
    setImageUploading(true)
    const selectedFile = e.target.files[0]
    const data = new FormData()
    data.append('file', selectedFile)
    const result = await uploadCover(data)
    const path = result?.data?.path
    setImageUrl(path.replace('public/cover/', ''))
    setImageUploading(false)
  }

  const fetchNameList = async () => {
    try {
      const result = await Promise.all([
        getVideoNameList(),
        getCoverNameList(),
        getMateriaList(),
      ])
      setNameList({
        video: result[0]?.data?.map((item) => ({ label: item, value: item })) || [],
        cover: result[1]?.data?.map((item) => ({ label: item, value: item })) || [],
        material:
          result[2]?.data?.rows?.map((item) => ({
            label: `${item.name} (${item.material_url})`,
            value: item.id,
          })) || [],
      })
    } catch (error) {
      setNameList({
        video: [],
        cover: [],
        material: [],
      })
    }
  }

  const onOkModal = async () => {
    await setModal(false)
    document.body.classList.remove('modal-open')
    if (videoID) {
      Router.push('/backoffice/all-videos')
    }
  }

  useEffect(() => {
    if (slug) {
      fetchVideoBySlug()
    }
  }, [slug])

  useEffect(() => {
    fetchNameList()
  }, [])

  // Component
  const TopSeries = () => {
    const [playlistCPD, setPlaylistCPD] = useState([])
    const [playlistInClass, setPlaylistInClass] = useState([])

    const getDataPlaylist = async () => {
      const [resultPlaylistCPD, resultPlaylistInClass] = await Promise.all([
        getPlayList({ sub_category_id: 1 }),
        getPlayList({ sub_category_id: 2 }),
      ])

      setPlaylistCPD(resultPlaylistCPD?.data?.playlists)
      setPlaylistInClass(resultPlaylistInClass?.data?.playlists)
    }

    useEffect(() => {
      getDataPlaylist()
    }, [])

    return (
      <div>
        <div>
          <Title leftColor="#006aa1">TOP SERIES</Title>
          <div className="_pdt-8px">
            <Input
              type="checkbox"
              className="_cs-pt _mgl-0px"
              innerRef={register}
              name="top-series"
            />
            <span className="_pdl-24px">Active</span>
          </div>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#006aa1">SERIES FROM CPD</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('top-series')}
                options={playlistCPD?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.topSeries}
                onChange={(value) => setPlaylist({ ...playlist, topSeries: value })}
                className={`_fs-300 ${!getValues('top-series') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#006aa1">SERIES FROM In-Class</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('top-series')}
                options={playlistInClass?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.topSeriesInClass}
                onChange={(value) =>
                  setPlaylist({ ...playlist, topSeriesInClass: value })}
                className={`_fs-300 ${!getValues('top-series') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  const Roles = () => {
    const [playlistDataPrimary, setPlaylistDataPrimary] = useState([])
    const [playlistDataSecondary, setPlaylistDataSecondary] = useState([])

    const getDataPlaylist = async () => {
      const [resultPlaylistPrimary, resultPlaylistSecondary] = await Promise.all([
        getPlayList({ sub_category_id: 5 }),
        getPlayList({ sub_category_id: 6 }),
      ])

      setPlaylistDataPrimary(resultPlaylistPrimary?.data?.playlists)
      setPlaylistDataSecondary(resultPlaylistSecondary?.data?.playlists)
    }

    useEffect(() => {
      getDataPlaylist()
    }, [])

    return (
      <div>
        <div>
          <Title leftColor="#07c1ff">Roles</Title>
          <div className="_pdt-8px">
            <Input
              type="checkbox"
              className="_cs-pt _mgl-0px"
              innerRef={register}
              name="roles"
            />
            <span className="_pdl-24px">Active</span>
          </div>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#07c1ff">SERIES FROM Primary</Title>

          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('roles')}
                options={playlistDataPrimary?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.roles}
                onChange={(value) => setPlaylist({ ...playlist, roles: value })}
                className={`_fs-300 ${!getValues('roles') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#07c1ff">SERIES FROM Secondary</Title>

          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('roles')}
                options={playlistDataSecondary?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.rolesSecondary}
                onChange={(value) => setPlaylist({ ...playlist, rolesSecondary: value })}
                className={`_fs-300 ${!getValues('roles') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  const Subjects = () => {
    const [playlistDataPrimary, setPlaylistDataPrimary] = useState([])
    const [playlistDataSecondary, setPlaylistDataSecondary] = useState([])

    const [subPlaylistDataPrimary, setSubPlaylistDataPrimary] = useState([])
    const [subPlaylistDataSecondary, setSubPlaylistDataSecondary] = useState([])

    const getDataPlaylist = async () => {
      const [resultPlaylistPrimary, resultPlaylistSecondary] = await Promise.all([
        getPlayList({ sub_category_id: 3 }),
        getPlayList({ sub_category_id: 4 }),
      ])

      setPlaylistDataPrimary(resultPlaylistPrimary?.data?.playlists)
      setPlaylistDataSecondary(resultPlaylistSecondary?.data?.playlists)
    }

    useEffect(() => {
      getDataPlaylist()
    }, [])

    useEffect(() => {
      if (playlist.subjects.length > 0) {
        const idsPlaylist = playlist.subjects.map((item) => item.value)
        const playlistDataPrimarySelect = playlistDataPrimary.filter((item) =>
          idsPlaylist.includes(item.id))

        const subPlaylistSelect = []
        playlistDataPrimarySelect.forEach((item) => {
          subPlaylistSelect.push(...item.sub_playlists)
        })
        setSubPlaylistDataPrimary(subPlaylistSelect)
      }
    }, [playlist.subjects, playlistDataPrimary])

    useEffect(() => {
      if (playlist.subjectsSecondary.length > 0) {
        const idsPlaylist = playlist.subjectsSecondary.map((item) => item.value)
        const playlistDataSecondarySelect = playlistDataSecondary.filter((item) =>
          idsPlaylist.includes(item.id))

        const subPlaylistSelect = []
        playlistDataSecondarySelect.forEach((item) => {
          subPlaylistSelect.push(...item.sub_playlists)
        })
        setSubPlaylistDataSecondary(subPlaylistSelect)
      }
    }, [playlist.subjectsSecondary, playlistDataSecondary])

    return (
      <div>
        <div>
          <Title leftColor="#b8e986">SUBJECTS</Title>
          <div className="_pdt-8px">
            <Input
              type="checkbox"
              className="_cs-pt _mgl-0px"
              innerRef={register}
              name="subjects"
            />
            <span className="_pdl-24px">Active</span>
          </div>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">SUBJECTS FROM Primary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('subjects')}
                options={playlistDataPrimary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.subjects}
                onChange={(value) => {
                  setPlaylist({ ...playlist, subjects: value })
                  setSubPlaylist({ ...subPlaylist, subjects: [] })
                }}
                className={`_fs-300 ${!getValues('subjects') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">SUB-SUBJECTS FROM Primary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('subjects')}
                options={subPlaylistDataPrimary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={subPlaylist.subjects}
                onChange={(value) => setSubPlaylist({ ...subPlaylist, subjects: value })}
                className={`_fs-300 ${!getValues('subjects') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <div className="line-section" />
          <Title className="_bt-t" leftColor="#b8e986">
            SUBJECTS FROM Secondary
          </Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('subjects')}
                options={playlistDataSecondary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.subjectsSecondary}
                onChange={(value) => {
                  setPlaylist({ ...playlist, subjectsSecondary: value })
                  setSubPlaylist({ ...subPlaylist, subjectsSecondary: [] })
                }}
                className={`_fs-300 ${!getValues('subjects') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">SUB-SUBJECTS FROM Secondary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('subjects')}
                options={subPlaylistDataSecondary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={subPlaylist.subjectsSecondary}
                onChange={(value) =>
                  setSubPlaylist({ ...subPlaylist, subjectsSecondary: value })}
                className={`_fs-300 ${!getValues('subjects') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  const WholeSchool = () => {
    const [playlistDataPrimary, setPlaylistDataPrimary] = useState([])
    const [playlistDataSecondary, setPlaylistDataSecondary] = useState([])

    const [subPlaylistDataPrimary, setSubPlaylistDataPrimary] = useState([])
    const [subPlaylistDataSecondary, setSubPlaylistDataSecondary] = useState([])

    const getDataPlaylist = async () => {
      const [resultPlaylistPrimary, resultPlaylistSecondary] = await Promise.all([
        getPlayList({ sub_category_id: 7 }),
        getPlayList({ sub_category_id: 8 }),
      ])

      setPlaylistDataPrimary(resultPlaylistPrimary?.data?.playlists)
      setPlaylistDataSecondary(resultPlaylistSecondary?.data?.playlists)
    }

    useEffect(() => {
      getDataPlaylist()
    }, [])

    useEffect(() => {
      if (playlist.wholeSchool.length > 0) {
        const idsPlaylist = playlist.wholeSchool.map((item) => item.value)
        const playlistDataPrimarySelect = playlistDataPrimary.filter((item) =>
          idsPlaylist.includes(item.id))
        const subPlaylistSelect = []
        playlistDataPrimarySelect.forEach((item) => {
          subPlaylistSelect.push(...item.sub_playlists)
        })
        setSubPlaylistDataPrimary(subPlaylistSelect)
      }
    }, [playlist.wholeSchool, playlistDataPrimary])

    useEffect(() => {
      if (playlist.wholeSchoolSecondary.length > 0) {
        const idsPlaylist = playlist.wholeSchoolSecondary.map((item) => item.value)
        const playlistDataSecondarySelect = playlistDataSecondary.filter((item) =>
          idsPlaylist.includes(item.id))
        const subPlaylistSelect = []
        playlistDataSecondarySelect.forEach((item) => {
          subPlaylistSelect.push(...item.sub_playlists)
        })
        setSubPlaylistDataSecondary(subPlaylistSelect)
      }
    }, [playlist.wholeSchoolSecondary, playlistDataSecondary])

    return (
      <div>
        <div>
          <Title leftColor="#b8e986">WHOLE SCHOOL</Title>
          <div className="_pdt-8px">
            <Input
              type="checkbox"
              className="_cs-pt _mgl-0px"
              innerRef={register}
              name="wholeSchool"
            />
            <span className="_pdl-24px">Active</span>
          </div>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">ISSUE FROM Primary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('wholeSchool')}
                options={playlistDataPrimary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.wholeSchool}
                onChange={(value) => {
                  setPlaylist({ ...playlist, wholeSchool: value })
                  setSubPlaylist({ ...subPlaylist, wholeSchool: [] })
                }}
                className={`_fs-300 ${!getValues('wholeSchool') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">SUB-ISSUE FROM Primary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('wholeSchool')}
                options={subPlaylistDataPrimary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={subPlaylist.wholeSchool}
                onChange={(value) =>
                  setSubPlaylist({ ...subPlaylist, wholeSchool: value })}
                className={`_fs-300 ${!getValues('wholeSchool') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <div className="line-section" />
          <Title leftColor="#b8e986">ISSUE FROM Secondary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('wholeSchool')}
                options={playlistDataSecondary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={playlist.wholeSchoolSecondary}
                onChange={(value) => {
                  setPlaylist({ ...playlist, wholeSchoolSecondary: value })
                  setSubPlaylist({ ...subPlaylist, wholeSchoolSecondary: [] })
                }}
                className={`_fs-300 ${!getValues('wholeSchool') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>

        <div className="_pdt-28px">
          <Title leftColor="#b8e986">SUB-ISSUE FROM Secondary</Title>
          <Row className="_pdt-16px">
            <Col xs={12}>
              <MultiSelect
                disabled={!getValues('wholeSchool')}
                options={subPlaylistDataSecondary.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                value={subPlaylist.wholeSchoolSecondary}
                onChange={(value) =>
                  setSubPlaylist({ ...subPlaylist, wholeSchoolSecondary: value })}
                className={`_fs-300 ${!getValues('wholeSchool') ? '_disabled' : ''}`}
                hasSelectAll={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  const Alert = () => (
    <div>
      <Modal isOpen={modal} toggle={() => setModal(!modal)} onClosed={clearForm}>
        <ModalBody>
          <h3 className="_fs-700">{videoID ? 'Update' : 'Create'} video success</h3>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onOkModal}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )

  const FormUpload = () => {
    useEffect(() => {
      let f_duration = 0
      let obUrl

      document.getElementById('audio').addEventListener('canplaythrough', (e) => {
        f_duration = Math.round(e.currentTarget.duration)
        const durationMin = Math.ceil(f_duration / 60)
        setValue('duration_minute', durationMin)
        URL.revokeObjectURL(obUrl)
      })

      document.getElementById('file').addEventListener('change', (e) => {
        const file = e.currentTarget.files[0]
        if (file.name.match(/\.(avi|mp3|mp4|mpeg|ogg)$/i)) {
          obUrl = URL.createObjectURL(file)
          document.getElementById('audio').setAttribute('src', obUrl)
        }
      })
    }, [])

    return (
      <FormUploadWrapper>
        <Title leftColor="#006aa1">VIDEO INFORMATION</Title>
        <Row>
          <Col xs={2}>
            <StepWrapper>
              <div className="_step-item">
                <div className="_step-number">1</div>
                <span className="_step-label">Video*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">2</div>
                <span className="_step-label">Image*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">3</div>
                <span className="_step-label">Name*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">4</div>
                <span className="_step-label">Slug*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">5</div>
                <span className="_step-label">Excerpt*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">6</div>
                <span className="_step-label">Summary*</span>
              </div>
            </StepWrapper>
          </Col>
          <Col xs={10}>
            <Row>
              <Col xs={4}>
                <Input
                  type="file"
                  id="file"
                  name="file"
                  innerRef={register()}
                  onChange={onUploadVideo}
                />
                {errors.file && <ErrorRequire label="Please select video" />}
                <audio id="audio" />
              </Col>
              <Col xs={1}>
                {videUploading && <Spinner color="primary" />}
                {!videUploading && videoUrl && (
                  <span className="_fs-900 _cl-d-blue _lh-1">
                    <CheckIcon />
                  </span>
                )}
              </Col>
              <Col xs={6}>
                {/* <Select
                  options={nameList.video}
                  value={{ value: videoUrl, label: videoUrl }}
                  onChange={(value) => setVideoUrl(value?.value)}
                  name="video_url2"
                  isClearable
                  placeholder="video url"
                /> */}

                <Input
                  type="text"
                  name="video_url_temp"
                  innerRef={register({ required: (getValues('file') && getValues('file').length === 0) })}
                  placeholder="video name only"
                  onChange={() => setValue('file', '')}

                />
                {errors.video_url_temp && <ErrorRequire label="Please select video" />}
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={4}>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  innerRef={register()}
                  onChange={onUploadImage}
                />
                {errors.image && <ErrorRequire label="Please select image" />}
              </Col>
              <Col xs={1}>
                {imageUploading && <Spinner color="primary" />}
                {!imageUploading && imageUrl && (
                  <span className="_fs-900 _cl-d-blue _lh-1">
                    <CheckIcon />
                  </span>
                )}
              </Col>
              <Col xs={6}>
                <Select
                  options={nameList.cover}
                  value={{ value: imageUrl, label: imageUrl }}
                  onChange={(value) => setImageUrl(value?.value)}
                  name="image_url"
                  isClearable
                  placeholder="image url"
                />
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={4}>
                <Input
                  type="text"
                  name="title"
                  placeholder="Video Name"
                  innerRef={register({ required: true })}
                />
                {errors.title && <ErrorRequire label="Please enter video name" />}
              </Col>
              <Col xs={3}>
                <Input
                  type="number"
                  name="duration_minute"
                  placeholder="Duration"
                  innerRef={register({ required: true })}
                />
                {errors.duration_minute && (
                  <ErrorRequire label="Please enter video duration" />
                )}
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={7}>
                <Input
                  type="text"
                  name="slug"
                  placeholder="Slug"
                  innerRef={register({ required: true })}
                />
                {errors.slug && <ErrorRequire label="Please enter video slug" />}
              </Col>
            </Row>

            <Row className="_pdt-36px">
              <Col xs={7}>
                <Input
                  type="text"
                  name="sub_title"
                  placeholder="Short description about the video"
                  innerRef={register({ required: true })}
                />
                {errors.sub_title && <ErrorRequire label="Please enter video excerpt" />}
              </Col>
            </Row>

            <Row className="_pdt-36px">
              <Col xs={7}>
                <Input
                  type="textarea"
                  name="summary"
                  rows="10"
                  innerRef={register({ required: true })}
                />
                {errors.summary && <ErrorRequire label="Please enter video summary" />}
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="_pdt-48px">
          <Col xs={2}>
            <StepWrapper>
              <div className="_step-item">
                <div className="_step-number">7</div>
                <span className="_step-label">Material</span>
              </div>
            </StepWrapper>
          </Col>
          <Col xs={7}>
            <Select
              value={materialUrl}
              isMulti
              options={nameList.material}
              onChange={(value) => setMaterialUrl(value)}
            />
          </Col>
        </Row>

        <Row className="_pdt-48px">
          <Col xs={10}>
            <Button color="primary" size="lg" block type="submit">
              Publish This Video
            </Button>
          </Col>
        </Row>
        {Alert()}
      </FormUploadWrapper>
    )
  }

  return (
    <Layout page="add-video">
      <Wrapper className="_pd-18px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="_pdh-0px;">
            <Col sx={3}>{TopSeries()}</Col>
            <Col sx={3}>{Roles()}</Col>
            <Col sx={3}>{Subjects()}</Col>
            <Col sx={3}>{WholeSchool()}</Col>
          </Row>

          <Row className="_pdh-0px _mgt-28px">
            <Col sx={3}>{FormUpload()}</Col>
          </Row>
        </form>
      </Wrapper>
    </Layout>
  )
}

export default withAuthGuard(AddNewVideoPage)

const StepWrapper = styled.div`
  ._step-item {
    position: relative;
    padding-bottom: 16px;
    ._step-number {
      display: inline-block;
      border: 1px solid #006aa1;
      color: #006aa1;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 20px;
    }
    ._step-label {
      padding-left: 10px;
      font-weight: bold;
    }
    ._step-line {
      position: absolute;
      border-left: 1px solid #006aa1;
      top: 40px;
      left: 20px;
      height: 36px;
    }
  }
`

const FormUploadWrapper = styled.div`
  border-top: 1px solid #bebebe;
  padding-top: 18px;

  .bi-file-minus-fill {
    color: red;
    font-size: 24px;
    cursor: pointer;
  }

  .bi-plus-square-fill {
    font-size: 24px;
    cursor: pointer;
  }
`

const Wrapper = styled.div`
  ._width-100p {
    width: 100%;
  }

  button.disabled,
  select:disabled {
    background-color: #98a1b1;
    border: none;
    color: #676767;
    opacity: 0.65;
  }

  ._disabled {
    pointer-events: none;
    .dropdown-container {
      background-color: #98a1b1;
      opacity: 0.65;
      .dropdown-heading-value span,
      .dropdown-heading-dropdown-arrow {
        color: #676767;
      }
    }
  }

  .invalid-feedback {
    position: absolute;
  }

  ._lh-1 {
    line-height: 1;
  }

  .line-section {
    padding: 10px 0;
    border-top: 1px solid #bebebe;
  }
`

const Title = styled.h3`
  font-size: 16px;
  padding: 8px;
  border-left: 2px solid ${(props) => props.leftColor};
`

const ErrorWrapper = styled.div`
  color: #f75e70;
  position: absolute;
  svg {
    font-size: 16px;
  }
`
