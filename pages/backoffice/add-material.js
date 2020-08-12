/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import { ExclamationIcon, CheckIcon } from '../../components/icon'
import { createMaterial } from '../../services/material'
import { uploadMaterial } from '../../services/upload'

const ErrorRequire = ({ label }) => (
  <ErrorWrapper>
    <ExclamationIcon />
    <span className="_pdl-8px _fs-300">{label}</span>
  </ErrorWrapper>
)

const AddMaterialPage = () => {
  const { register, handleSubmit, errors, watch, reset, setError } = useForm()
  const watchAllFields = watch()

  const [modal, setModal] = useState(false)
  const [materialUploading, setMaterialUploading] = useState(false)
  const [materialUrl, setMaterialUrl] = useState('')

  const onSubmit = async (data) => {
    if (!materialUrl) {
      return setError('file')
    }

    const body = {
      name: data.name,
      description: data.description,
      material_url: materialUrl,
    }

    await createMaterial(body)
    setModal(true)
  }

  const onUpload = async (e) => {
    setMaterialUploading(true)
    const selectedFile = e.target.files[0]
    const data = new FormData()
    data.append('file', selectedFile)
    const result = await uploadMaterial(data)
    const path = result?.data?.path
    setMaterialUrl(path)
    setMaterialUploading(false)
  }

  const clearForm = () => {
    reset()
    setMaterialUrl('')
  }

  const Alert = () => (
    <div>
      <Modal isOpen={modal} toggle={() => setModal(!modal)} onClosed={clearForm}>
        <ModalBody>
          <h3 className="_fs-700">Create Material Success</h3>
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
  const AddMaterial = () => {
    return (
      <AddMaterialWrapper>
        <Title leftColor="#006aa1">Add Material</Title>
        <Row>
          <Col xs={3}>
            <StepWrapper>
              <div className="_step-item">
                <div className="_step-number">1</div>
                <span className="_step-label">File*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">2</div>
                <span className="_step-label">Name*</span>
                <div className="_step-line" />
              </div>
              <div className="_step-item">
                <div className="_step-number">4</div>
                <span className="_step-label">Description*</span>
              </div>
            </StepWrapper>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs={4}>
                <Input
                  type="file"
                  name="file"
                  innerRef={register()}
                  onChange={onUpload}
                />
                {errors.file && <ErrorRequire label="Please select file" />}
              </Col>
              <Col xs={1} className="_lh-1">
                {materialUploading && <Spinner color="primary" />}
                {!materialUploading && materialUrl && (
                  <span className="_fs-900 _cl-d-blue _lh-1">
                    <CheckIcon />
                  </span>
                )}
              </Col>
            </Row>

            <Row className="_pdt-36px">
              <Col xs={7}>
                <Input type="text" name="name" innerRef={register({ required: true })} />
                {errors.name && <ErrorRequire label="Please enter name" />}
              </Col>
            </Row>

            <Row className="_pdt-36px">
              <Col xs={7}>
                <Input
                  type="textarea"
                  name="description"
                  rows="10"
                  innerRef={register({ required: true })}
                />
                {errors.description && <ErrorRequire label="Please enter description" />}
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
      </AddMaterialWrapper>
    )
  }

  return (
    <Layout page="add-material">
      <div className="_pd-18px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="_pdh-0px _mgt-28px">
            <Col sx={3}>{AddMaterial()}</Col>
          </Row>
        </form>
        <div className="_pdt-36px">
          <Link href="/backoffice/add-material-list">
            <a href="/backoffice/add-material-list">Click here to see Material List</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default withAuthGuard(AddMaterialPage)

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

const AddMaterialWrapper = styled.div`
  border-top: 1px solid #bebebe;
  padding-top: 18px;

  ._lh-1 {
    line-height: 1;
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
