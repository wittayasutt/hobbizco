/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Input, Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import Link from 'next/link'
import { ExclamationIcon } from '../../components/icon'
import { createPlaylist } from '../../services/playlist'
import { SUB_CATEGORY } from '../../constants'

const ErrorRequire = ({ label }) => (
  <ErrorWrapper>
    <ExclamationIcon />
    <span className="_pdl-8px _fs-300">{label}</span>
  </ErrorWrapper>
)

const AddPlaylistPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    getValues,
    watch,
    reset,
    setError,
  } = useForm()
  const watchAllFields = watch()

  const [modal, setModal] = useState(false)
  const [subCategoryList, setSubCategoryList] = useState([])

  const onSubmit = async (data) => {
    if (data.category === '0') {
      return setError('category')
    }

    if (data.sub_category_id === '0') {
      return setError('sub_category_id')
    }

    const body = {
      description: data.description,
      name: data.name,
      slug: data.slug,
      sub_category_id: Number(data.sub_category_id),
    }

    await createPlaylist(body)
    setModal(true)
  }

  useEffect(() => {
    if (getValues('category')) {
      const sub = SUB_CATEGORY.filter(
        (item) => item.categoryID === Number(getValues('category')),
      )
      setSubCategoryList(sub)
    }
  }, [getValues('category')])

  const Alert = () => (
    <div>
      <Modal isOpen={modal} toggle={() => setModal(!modal)} onClosed={() => reset()}>
        <ModalBody>
          <h3 className="_fs-700">Create playlist success</h3>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              setModal(!modal)
            }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )

  // Components
  const AddPlaylist = () => {
    return (
      <AddPlaylistWrapper>
        <Title leftColor="#006aa1">ADD PLAYLIST</Title>
        <Row>
          <Col xs={3}>
            <StepWrapper>
              <div className="_step-item">
                <div className="_step-number">1</div>
                <span className="_step-label">Category*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">2</div>
                <span className="_step-label">Sub Category*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">3</div>
                <span className="_step-label">Playlist Name*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">4</div>
                <span className="_step-label">Slug*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">5</div>
                <span className="_step-label">Description</span>
              </div>
            </StepWrapper>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs={7}>
                <Input
                  type="select"
                  name="category"
                  innerRef={register({ required: true })}
                  onChange={() => setValue('sub_category_id', 0)}
                >
                  <option value={false}>--Select--</option>
                  <option value={2}>Top series</option>
                  <option value={3}>Subjects</option>
                  <option value={4}>Roles</option>
                  <option value={5}>Whole school</option>
                </Input>
                {errors.category && <ErrorRequire label="Please enter category" />}
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={7}>
                <Input
                  type="select"
                  name="sub_category_id"
                  innerRef={register({ required: true })}
                >
                  <option value={0}>--Select--</option>
                  {subCategoryList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.subCategoryName}
                    </option>
                  ))}
                </Input>
                {errors.sub_category_id && (
                  <ErrorRequire label="Please enter sub category" />
                )}
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={7}>
                <Input type="text" name="name" innerRef={register({ required: true })} />
                {errors.name && <ErrorRequire label="Please enter name" />}
              </Col>
            </Row>

            <Row className="_pdt-48px">
              <Col xs={7}>
                <Input type="text" name="slug" innerRef={register({ required: true })} />
                {errors.slug && <ErrorRequire label="Please enter slug" />}
              </Col>
            </Row>

            <Row className="_pdt-36px">
              <Col xs={7}>
                <Input
                  type="textarea"
                  name="description"
                  rows="10"
                  innerRef={register()}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="_pdt-48px">
          <Col xs={10}>
            <Button color="primary" size="lg" block type="submit">
              CREATE
            </Button>
          </Col>
        </Row>
        {Alert()}
      </AddPlaylistWrapper>
    )
  }

  return (
    <Layout page="add-playlist">
      <div className="_pd-18px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="_pdh-0px _mgt-28px">
            <Col sx={3}>{AddPlaylist()}</Col>
          </Row>
        </form>
        <div className="_pdt-36px">
          <Link href="/backoffice/add-playlist-list">
            <a href="/backoffice/add-playlist-list">Click here to see Playlist List</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default withAuthGuard(AddPlaylistPage)

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

const AddPlaylistWrapper = styled.div`
  border-top: 1px solid #bebebe;
  padding-top: 18px;
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
