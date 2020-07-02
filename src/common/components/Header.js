import React, { useState, useCallback, useRef } from 'react'
import Switch from 'react-switch'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/images/airbnb.svg'
import nighIcon from '../../assets/images/night-icon.svg'
import sunnyIcon from '../../assets/images/sunny-icon.svg'

const HeaderContainer = styled.header`
  height: 80px;
  position: fixed;
  width: 100%;
  z-index: 100;
  .header-inner {
    display: flex;
    height: 100%;
    align-items: center;
    padding-left: 24px;
    padding-right: 24px;
    margin-left: auto;
    margin-right: auto
  }
  .header-image {
    height: 32px;
    width: 32px;
  }
  .header-tab {
    flex: 1;
    justify-content: flex-end;
    display: flex
  }
  .theme-icon {
    width: 20px;
    height: 20px;
    margin-top: 4px;
    margin-left: 5px;
  }
  .menu-icon {
    color: ${({ theme }) => theme.highlightText};
    font-size: 28px
  }
  .header-nav-item {
    margin-left: 2rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4375rem;
    color: ${({ theme }) => theme.highlightText};
    text-decoration: none;
    transition: all 0.3s ease 0s;
  }
  .topnav a.icon {
    display: none;
  }

  @media screen and (max-width: 600px) {
    .topnav a {display: none;}
    .topnav a.icon {
      float: right;
      display: block;
    }
  }
  
  @media screen and (max-width: 600px) {
    .topnav.responsive {
      position: absolute;
      width: 100%;
      left: 0px;
      top: 80px;
      background-color: ${({ theme }) => theme.primaryBackground};
      padding-bottom: 20;
      animation-name: slideUp;
      animation-duration: 0.5s;
      transition-timing-function: ease-in-out;
    }
    .theme-switch {
      margin-right: 10px;
    }
    .theme-switch-active {
      margin-right: 34px;
    }
    .topnav.responsive .icon {
      position: absolute;
      top: -54px;
      right: 24px;
    }
    .topnav.responsive .header-nav-item {
      padding-top: 14px;
      padding-bottom: 14px;
    }
    .topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
    }
  }

  @keyframes slideUp {
    from { left: 60px; }
    to { left: 0px; }
  }
`
const MENU = [
  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/in/d%C6%B0%C6%A1ng-t%E1%BA%A5n-h%C3%B9ng-633132131/'
  },
  {
    title: 'Github',
    href: 'https://github.com/zrg-team'
  },
  {
    title: 'Source Code',
    href: 'https://github.com/zrg-team/some-demo'
  },
  {
    title: 'Profile',
    href: 'https://zrg-team.github.io/store/'
  }
]
function Header ({ theme, setTheme }) {
  const navRef = useRef(null)
  const switchRef = useRef(null)
  const [selectTheme, setSelectTheme] = useState(theme === 'dark')
  const handleSelectTheme = (checked) => {
    const newTheme = checked ? 'dark' : 'light'
    setTheme(newTheme)
    setSelectTheme(checked)
  }
  const handleToggeMenu = useCallback(() => {
    const element = navRef.current
    if (element.className === 'topnav') {
      element.className += ' responsive'
      switchRef.current.className = 'theme-switch-active'
    } else {
      element.className = 'topnav'
      switchRef.current.className = 'theme-switch'
    }
  }, [navRef])
  return (
    <HeaderContainer>
      <div className='header-inner'>
        <img src={logo} className='header-image' alt='header-image' />
        <div className='header-tab'>
          <div
            ref={switchRef}
            className='theme-switch'
          >
            <Switch
              onChange={handleSelectTheme}
              checked={selectTheme}
              offColor='#555555'
              onColor='#555555'
              // offHandleColor="#0ff"
              // onHandleColor="#08f"
              uncheckedIcon={
                <img src={sunnyIcon} className='theme-icon' alt='sunny-icon' />
              }
              checkedIcon={
                <img src={nighIcon} className='theme-icon' alt='nigh-icon' />
              }
            />
          </div>
          <nav ref={navRef} className='topnav'>
            {
              MENU.map(
                item => (
                  <a
                    className='header-nav-item'
                    key={item.href}
                    href={item.href}
                    title={item.title}
                  >
                    {item.title}
                  </a>
                )
              )
            }
            <a className='icon' onClick={handleToggeMenu}>
              <FontAwesomeIcon icon={faBars} className='menu-icon' />
            </a>
          </nav>
        </div>
      </div>
    </HeaderContainer>
  )
}

export default Header
