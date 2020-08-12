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
  Table,
  Spinner,
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { withAuthGuard } from '../../components/hocs'
import { Layout } from '../../components/backoffice'
import { ExclamationIcon, MinusFillIcon, CheckIcon } from '../../components/icon'
import { createMaterial, getMateriaList, deleteMaterial } from '../../services/material'
import { uploadMaterial } from '../../services/upload'

const AddMaterialPage = () => {
  const [materialList, setMaterialList] = useState([])

  const fetchList = async () => {
    const resultList = await getMateriaList()
    setMaterialList(resultList?.data?.rows)
  }

  const onDelete = async (id) => {
    await deleteMaterial(id)
    fetchList()
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Components
  const ListAll = () => {
    return (
      <ListWrapper className="_pdt-48px">
        <h3>Material List</h3>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Url</th>
              <th>Description</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {materialList?.map((material, index) => (
              <tr key={material.id}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{material.name}</th>
                <th scope="row">{material.material_url}</th>
                <th scope="row">{material.description}</th>
                <th scope="row" className="_delete-icon">
                  <span onClick={() => onDelete(material.id)}>
                    <MinusFillIcon />
                  </span>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
      </ListWrapper>
    )
  }

  return (
    <Layout page="add-material">
      <div className="_pd-18px">{ListAll()}</div>
    </Layout>
  )
}

export default withAuthGuard(AddMaterialPage)

const ListWrapper = styled.div`
  ._delete-icon {
    span {
      cursor: pointer;
    }
    svg {
      color: red;
    }
  }
`
