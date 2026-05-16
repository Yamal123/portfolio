'use client'

import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, theme, Typography } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ThunderboltOutlined,
  ProjectOutlined,
  CalendarOutlined,
  PhoneOutlined,
  SettingOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/admin/AuthContext'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  UserOutlined: <UserOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  ProjectOutlined: <ProjectOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  PhoneOutlined: <PhoneOutlined />,
  SettingOutlined: <SettingOutlined />,
  BarChartOutlined: <BarChartOutlined />,
}

const menuItems = [
  { key: '/admin/dashboard', label: '仪表盘', icon: <DashboardOutlined /> },
  { key: '/admin/profile', label: '个人主页信息', icon: <UserOutlined /> },
  { key: '/admin/skills', label: '专业技能', icon: <ThunderboltOutlined /> },
  { key: '/admin/projects', label: '项目案例', icon: <ProjectOutlined /> },
  { key: '/admin/stats', label: '履历数据', icon: <CalendarOutlined /> },
  { key: '/admin/contact', label: '联系方式', icon: <PhoneOutlined /> },
  { key: '/admin/settings', label: '系统设置', icon: <SettingOutlined /> },
  { key: '/admin/analytics', label: '数据统计', icon: <BarChartOutlined /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { token: themeToken } = theme.useToken()

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
      onClick: () => router.push('/admin/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: themeToken.colorBgContainer,
          borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
            cursor: 'pointer',
          }}
          onClick={() => router.push('/admin/dashboard')}
        >
          <Text strong style={{ fontSize: collapsed ? 16 : 20 }}>
            {collapsed ? 'Admin' : '管理后台'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map((item) => ({
            ...item,
            key: item.key,
          }))}
          onClick={({ key }) => router.push(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div
            style={{ cursor: 'pointer', fontSize: 18 }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user?.username || 'Admin'}</Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: themeToken.colorBgContainer, borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
