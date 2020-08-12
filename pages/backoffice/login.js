import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Row,
  Col,
  FormGroup,
  Button,
  Form,
  Input,
  FormFeedback,
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import cookie from 'js-cookie'
import styled from 'styled-components'

import { UserContext } from '../../components/hooks'
import { auth } from '../../services'

const Login = () => {
  const router = useRouter()
  const { setUser } = useContext(UserContext)
  const { register, handleSubmit, errors, setError } = useForm()
  const [isLoading, setIsLoading] = useState(false)

  const redirectToCallbackUrl = () => {
    const { query } = router

    if (query?.callback) {
      router.push(query?.callback)
    } else {
      router.push('/backoffice/all-videos')
    }
  }

  const onSubmit = async (params) => {
    setIsLoading(true)
    try {
      const { data } = await auth.login(params)
      const { data: userResponse } = await auth.getMe(data?.accessToken)

      cookie.set('accessToken', data?.accessToken)
      setUser(userResponse)
      redirectToCallbackUrl()
    } catch (err) {
      setError('username', 'invalid', 'ข้อมูลไม่ถูกต้อง')
      setError('password', 'invalid', 'ข้อมูลไม่ถูกต้อง')
    }
    setIsLoading(false)
  }

  return (
    <LayoutStyled>
      <Container>
        <Row>
          <Col className="text-center" xs={{ offset: 4, size: 4 }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="display-4 _mgbt-16px">BACKOFFICE</h3>
              <FormGroup className="d-block">
                <Input
                  invalid={!!errors?.username?.message}
                  type="text"
                  id="username"
                  name="username"
                  innerRef={register({
                    required: 'กรุณากรอกข้อมูล',
                  })}
                />
                <FormFeedback className="_tal-l">
                  {errors?.username?.message}
                </FormFeedback>
              </FormGroup>
              <FormGroup className="d-block">
                <Input
                  invalid={!!errors?.password?.message}
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="on"
                  innerRef={register({
                    required: 'กรุณากรอกข้อมูล',
                  })}
                />
                <FormFeedback className="_tal-l">
                  {errors?.password?.message}
                </FormFeedback>
              </FormGroup>
              <Button className="_mgt-32px" block disabled={isLoading} color="primary">
                Log in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </LayoutStyled>
  )
}

export default Login

const LayoutStyled = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;

  .container {
    margin: auto;
  }
`
