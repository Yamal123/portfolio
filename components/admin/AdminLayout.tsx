'use client'

import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, theme, Typography, ConfigProvider } from 'antd'
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
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
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
          background: '#fff',
          borderRight: '1px solid #e8eaed',
          boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Logo 区域 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            gap: 10,
            background: '#fff',
          }}
          onClick={() => router.push('/admin/dashboard')}
        >
          <div style={{
            width: collapsed ? 32 : 36,
            height: collapsed ? 32 : 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 15 : 18,
            fontWeight: 800,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
          }}>
            Y
          </div>
          {!collapsed && (
            <Text strong style={{ fontSize: 17, letterSpacing: -0.5 }}>
              管理后台
            </Text>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map((item) => ({
            ...item,
            key: item.key,
          }))}
          onClick={({ key }) => router.push(key)}
          style={{
            borderRight: 0,
            marginTop: 12,
            background: 'transparent',
            fontSize: 14,
          }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s', background: '#f5f6fa' }}>
        {/* 顶栏 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e8eaed',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              cursor: 'pointer',
              fontSize: 18,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
            onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 12px 4px 4px',
              borderRadius: 20,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                }}
              />
              <Text style={{ fontWeight: 500, fontSize: 14 }}>{user?.username || 'Admin'}</Text>
            </div>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content style={{
          margin: 20,
          padding: 24,
          background: 'transparent',
          borderRadius: 12,
          minHeight: 'calc(100vh - 104px)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
