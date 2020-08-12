import React, { useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'
import styled from 'styled-components'
import Router from 'next/router'
import Link from 'next/link'

import { Divider } from '.'

const Layout = ({ children }) => {
  const [keyword, setKeyword] = useState('')

  const onSearch = () => {
    setKeyword('')
    Router.push(`/search-results?key=${keyword}`)
    window.scroll(0, 0)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  const renderLogo = () => {
    return (
      <Col xs={5} className="_pdl-0px">
        <Divider isTop isLeft isMarginRight />
        <Logo>
          <Link href="/home">
            <a href="/home">
              <img src="/static/logo.png" alt="logo" className="_mgt-4px" />
            </a>
          </Link>
        </Logo>
      </Col>
    )
  }
  const renderNavbar = () => {
    const navbars = [
      {
        text: 'Home',
        link: '/home',
      },
      {
        text: 'Top series',
        link: '/top-series-list',
      },
      {
        text: 'Subjects',
        link: '/subject-list',
      },
      {
        text: 'Roles',
        link: '/role-list',
      },
      {
        text: 'Whole school',
        link: '/whole-school-issue-list',
      },
    ]

    return (
      <Col xs={19}>
        <Row>
          <Col xs={16} className="_pdl-0px">
            <Divider isTop isLeft />
            <h1 className="_fst-itl _cl-pmr-blue _fs-400 _mgv-8px">
              Professional Development for Quality Teaching
            </h1>
          </Col>

          <Col xs={8} className="_pdr-0px">
            <Divider isTop isRight />
            <LinkStyled className="_mgl-at _mgv-0px _fs-100 _mgt-8px">
              <li>
                <Link href="/about-us">
                  <a href="/about-us" className="_tdcrt-n _cl-l-gray">
                    About
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <a href="/contact-us" className="_tdcrt-n _mgl-12px _cl-l-gray ">
                    Contact
                  </a>
                </Link>
              </li>
            </LinkStyled>
          </Col>
        </Row>
        <Row>
          <Col xs={16} className="_pd-0px">
            <NavbarLinkStyled className="_fs-200 _jtfct-spbtw _mgv-0px">
              {navbars.map((navbar) => {
                return (
                  <Link href={navbar.link} key={navbar.text}>
                    <li>
                      <a
                        href={navbar.link}
                        className="_cl-pmr-blue _fw-b _tdcrt-n _pd-8px _tal-r"
                      >
                        {navbar.text}
                      </a>
                    </li>
                  </Link>
                )
              })}
            </NavbarLinkStyled>
            <Divider isBottom isLeft />
          </Col>
          <SearchContainerStyled xs={8}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img
              onClick={onSearch}
              role="presentation"
              src="/static/search.png"
              className="_mgl-4px"
              alt="search"
            />
            <Divider isBottom isRight />
          </SearchContainerStyled>
        </Row>
      </Col>
    )
  }

  const renderFooter = () => {
    return (
      <FooterStyled>
        <Col xs={24} className="_pdv-24px">
          <p className="_tal-ct _fs-100 _mg-0px">
            ProTeachersVideo is an archive of over 3500 Teachers TV videos
            <br />
            for professional development or to use in class.
          </p>
        </Col>
        <Col xs={19} offset={{ xs: 5 }} className="_pdh-0px">
          <p className="_tal-l _fs-100 ">
            <Link href="/terms-of-use">
              <a href="/terms-of-use" className="_cl-l-gray _tdcrt-n">
                Terms of use
              </a>
            </Link>
          </p>
        </Col>
      </FooterStyled>
    )
  }

  return (
    <Container>
      <Row>
        {renderLogo()}
        {renderNavbar()}
      </Row>

      {children}
      {renderFooter()}
    </Container>
  )
}

export default Layout

const Logo = styled.div`
  img {
    max-width: 100%;
    max-height: 100%;
  }
`

const LinkStyled = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-end;

  a:hover {
    color: #000 !important;
  }
`
const NavbarLinkStyled = styled.ul`
  list-style: none;
  display: inline-flex;
  height: 50px;
  padding: 0;

  li {
    border-right: solid 1px var(--color-light-blue);
    display: flex;
    align-items: flex-end;
    cursor: pointer;

    padding-left: 28px;
    &:hover {
      background-color: var(--color-primary-blue);
      a {
        color: #fff !important;
      }
    }
  }
`
const SearchContainerStyled = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 8px;
  padding-right: 0 !important;

  input {
    height: 18px;
    width: 175px;
  }

  img {
    background-color: var(--color-primary-blue);
    width: 12px;
    vertical-align: middle;
    padding: 6px;
    cursor: pointer;
  }
`

const FooterStyled = styled(Row)`
  a:hover {
    color: #000 !important;
  }
`
