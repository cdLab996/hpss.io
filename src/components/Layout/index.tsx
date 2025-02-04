/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

'use client'
import React, { useState, useEffect } from 'react'
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  ConfigProvider,
  type MenuProps,
} from 'antd'
import getNavList from './menu'
import LocaleSwitcher from '../LocaleSwitcher'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { getThemeBg } from '@/utils'
import styles from './index.module.less'
import { Link } from '@/i18n/routing'

const { Header, Content, Footer, Sider } = Layout

interface IProps {
  children: React.ReactNode
  curActive: string
  defaultOpen?: string[]
}

const onLogout = () => {
  localStorage.removeItem('isDarkTheme')
}

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target='_blank' rel='noopener noreferrer' href='#'>
        个人中心
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target='_blank' rel='noopener noreferrer' href='#'>
        切换账户
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target='_blank' onClick={onLogout} rel='noopener noreferrer' href='/user/login'>
        退出登录
      </a>
    ),
  },
]

const CommonLayout: React.FC<IProps> = ({ children, curActive, defaultOpen = ['/'] }) => {
  const {
    token: { borderRadiusLG, colorTextBase, colorWarningText },
  } = theme.useToken()

  const t = useTranslations('global')
  const router = useRouter()
  // const pathname = usePathname()
  const navList = getNavList(t)

  const [curTheme, setCurTheme] = useState<boolean>(false)
  const toggleTheme = () => {
    const _curTheme = !curTheme
    setCurTheme(_curTheme)
    localStorage.setItem('isDarkTheme', _curTheme ? 'true' : '')
  }

  const handleSelect = (row: { key: string }) => {
    if (row.key.includes('http')) {
      window.open(row.key)
      return
    }
    router.push(row.key)
  }

  useEffect(() => {
    const isDark = !!localStorage.getItem('isDarkTheme')
    setCurTheme(isDark)
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: curTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          theme={curTheme ? 'dark' : 'light'}
          breakpoint='lg'
          collapsedWidth='0'
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          {/* <span className={styles.logo} style={getThemeBg(curTheme)}>
            Next-Admin
          </span> */}

          <Link href='/' className={styles.logo} style={getThemeBg(curTheme)}>
            Next-Admin
          </Link>
          <Menu
            theme={curTheme ? 'dark' : 'light'}
            mode='inline'
            defaultSelectedKeys={[curActive]}
            items={navList}
            defaultOpenKeys={defaultOpen}
            onSelect={handleSelect}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, ...getThemeBg(curTheme), display: 'flex' }}>
            <div className={styles.rightControl}>
              <LocaleSwitcher />
              <span onClick={toggleTheme} className={styles.theme}>
                {!curTheme ? (
                  <SunOutlined style={{ color: colorWarningText }} />
                ) : (
                  <MoonOutlined />
                )}
              </span>
              <div className={styles.avatar}>
                <Dropdown menu={{ items }} placement='bottomLeft' arrow>
                  <Avatar style={{ color: '#fff', backgroundColor: colorTextBase }}>
                    Admin
                  </Avatar>
                </Dropdown>
              </div>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: 520,
                ...getThemeBg(curTheme),
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Next-Admin ©{new Date().getFullYear()} Created by{' '}
            <a href='https://github.com/zzci/hpss.io'>hpss.io</a>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default CommonLayout
