import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useContext } from 'react'
import { Row } from 'reactstrap'
import styled from 'styled-components'
import Link from 'next/link'

import { ColumnsGapIcon, CardListIcon, FilePlusIcon, PersonIcon } from '../icon'
import { UserContext } from '../../components/hooks'

const menuList = [
  {
    id: 1,
    name: 'Video Management',
    type: 'head',
    key: 'head',
    link: '#',
    icon: <ColumnsGapIcon />,
  },
  {
    id: 2,
    name: 'All Videos',
    type: 'body',
    key: 'all-videos',
    link: '/backoffice/all-videos',
    icon: <CardListIcon />,
  },
  {
    id: 3,
    name: 'Add New Video',
    type: 'body',
    key: 'add-video',
    link: '/backoffice/add-video',
    icon: <FilePlusIcon />,
  },
  {
    id: 4,
    name: 'Add Playlist',
    type: 'body',
    key: 'add-playlist',
    link: '/backoffice/add-playlist',
    icon: <FilePlusIcon />,
  },
  {
    id: 5,
    name: 'Add Sub Playlist',
    type: 'body',
    key: 'add-sub-playlist',
    link: '/backoffice/add-sub-playlist',
    icon: <FilePlusIcon />,
  },
  {
    id: 6,
    name: 'Add Material',
    type: 'body',
    key: 'add-material',
    link: '/backoffice/add-material',
    icon: <FilePlusIcon />,
  },
]

const titlePage = {
  'all-videos': 'All Videos',
  'add-video': 'Add New Video',
  'add-playlist': 'Add New Playlist',
  'add-sub-playlist': 'Add New Sub Playlist',
  'add-material': 'Add New Material',
}
const Layout = ({ page, children }) => {
  const { clearUser } = useContext(UserContext)

  const Menu = () => (
    <MenuWrapper>
      <div className="_pdv-36px _pdh-64px _tal-ct">
        <div className="_bgcl-d-b _line" />
        <img src="/static/logo.png" alt="logo" className="_logo" />
      </div>
      {menuList.map((menuItem) => (
        <Link href={menuItem.link} key={menuItem.id}>
          <a href={menuItem.link} className="_tdcrt-n">
            <div
              className={`_menu-item _menu-${menuItem.type} ${
                page === menuItem.key ? '_active' : ''
              } `}
            >
              {menuItem.icon}
              <span className="_menu-label">{menuItem.name}</span>
            </div>
          </a>
        </Link>
      ))}

      <div
        role="presentation"
        className="_logout _dp-f _jtfct-st _alit-ct"
        onClick={clearUser}
      >
        <span className="_wrapper-icon-logout">
          <PersonIcon />
        </span>

        <span className="_menu-label">Logout</span>
      </div>
    </MenuWrapper>
  )

  const Header = () => <HeaderWrapper>Video Management / {titlePage[page]}</HeaderWrapper>

  return (
    <Wrapper>
      <Row className="_mgh-0px">
        <div className="_left">{Menu()}</div>
        <div className="_right">
          {Header()}
          {children}
        </div>
      </Row>
    </Wrapper>
  )
}

const HeaderWrapper = styled.div`
  position: relative;
  text-align: center;
  color: #006aa1;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  box-shadow: 0px 4px 5px #eee;
`

const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;

  ._left {
    width: 300px;
  }
  ._right {
    width: calc(100% - 300px);
    background-color: #fafafa;
  }
`

const MenuWrapper = styled.div`
  min-height: 100vh;
  height: 100%;
  box-shadow: 4px 0px 5px #eee;
  position: relative;
  display: flex;
  flex-direction: column;

  ._logo {
    margin: 0 auto;
    width: 100%;
    max-width: 200px;
  }
  ._line {
    width: 100%;
    height: 2px;
  }

  ._menu-item {
    padding: 20px 40px;
    margin-top: 2px;

    &._menu-head {
      background-color: #dbdbdb;
      cursor: default;
      color: #000;
    }

    &._menu-body {
      cursor: pointer;

      &._active {
        background-color: #007bff;
        color: #fff;
      }

      &:hover {
        background-color: #007bff;
        color: #fff;
      }
    }
  }

  ._menu-label {
    padding-left: 30px;
  }

  ._logout {
    padding: 20px 40px;
    bottom: 0;
    width: 100%;
    cursor: pointer;
    margin-top: auto;
    border-top: solid 1px var(--color-light-gray);

    ._wrapper-icon-logout {
      background-color: #eb726b;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: inline-block;
      text-align: center;

      svg {
        color: #fff;
      }
    }
  }
`

export default Layout
