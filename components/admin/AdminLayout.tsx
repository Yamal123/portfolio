'use client'

import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, theme, Typography, ConfigProvider, Breadcrumb, Badge } from 'antd'
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
  BellOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
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

const pageTitleMap: Record<string, string> = {
  '/admin/dashboard': '仪表盘',
  '/admin/profile': '个人主页信息',
  '/admin/skills': '专业技能',
  '/admin/projects': '项目案例',
  '/admin/stats': '履历数据',
  '/admin/contact': '联系方式',
  '/admin/settings': '系统设置',
  '/admin/analytics': '数据统计',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [fullscreen, setFullscreen] = useState(false)

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const breadcrumbItems = pathname.split('/').filter(Boolean).slice(1).map((segment, index, arr) => {
    const path = `/admin/${arr.slice(0, index + 1).join('/')}`
    const title = pageTitleMap[path] || segment
    return {
      title: index === arr.length - 1 ? (
        <span style={{ color: '#1d2129', fontWeight: 500 }}>{title}</span>
      ) : (
        <Link href={path} style={{ color: '#3370ff' }}>{title}</Link>
      ),
    }
  })

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3370ff',
          borderRadius: 6,
          fontFamily: `-apple-system, 'SF Pro Text', 'PingFang SC', sans-serif`,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f2f3f5' }}>
        {/* 侧边栏 */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          collapsedWidth={64}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: '#001529',
            zIndex: 10,
          }}
        >
          {/* Logo 区域 */}
          <div
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 0 : '0 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              gap: 10,
              background: 'rgba(0,0,0,0.15)',
            }}
            onClick={() => router.push('/admin/dashboard')}
          >
            <div style={{
              width: collapsed ? 28 : 32,
              height: collapsed ? 28 : 32,
              borderRadius: 8,
              background: '#3370ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: collapsed ? 13 : 16,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              Y
            </div>
            {!collapsed && (
              <Text strong style={{ fontSize: 16, color: '#fff', letterSpacing: -0.3 }}>
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
              marginTop: 8,
              background: 'transparent',
              fontSize: 14,
              paddingInline: 0,
            }}
            inlineIndent={16}
          />

          {/* 底部折叠区域 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 40,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                color: 'rgba(255,255,255,0.45)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 16 }} /> : <MenuFoldOutlined style={{ fontSize: 16 }} />}
            </div>
            {!collapsed && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.5 }}>
                v1.0.0
              </span>
            )}
          </div>

          {/* 自定义菜单样式 */}
          <style jsx global>{`
            .ant-layout-sider .ant-menu-item {
              margin: 2px 8px !important;
              padding-inline: 12px !important;
              border-radius: 6px !important;
              height: 44px !important;
              line-height: 44px !important;
              color: rgba(255,255,255,0.65) !important;
              position: relative;
              transition: all 0.2s !important;
            }
            .ant-layout-sider .ant-menu-item:hover {
              color: rgba(255,255,255,0.85) !important;
              background: rgba(255,255,255,0.04) !important;
            }
            .ant-layout-sider .ant-menu-item-selected {
              color: #fff !important;
              background: rgba(255,255,255,0.08) !important;
            }
            .ant-layout-sider .ant-menu-item-selected::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 20px;
              background: #3370ff;
              border-radius: 0 2px 2px 0;
            }
            .ant-layout-sider .ant-menu-item .anticon {
              font-size: 18px !important;
              margin-right: 10px !important;
            }
            .ant-menu-inline-collapsed .ant-menu-item {
              padding-inline: calc(50% - 14px) !important;
            }
            .ant-menu-inline-collapsed .ant-menu-item-selected::before {
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          `}</style>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 64 : 220, transition: 'margin-left 0.2s', background: '#f2f3f5' }}>
          {/* 顶栏 */}
          <Header
            style={{
              padding: '0 24px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e6eb',
              position: 'sticky',
              top: 0,
              zIndex: 9,
              height: 48,
              lineHeight: '48px',
            }}
          >
            {/* 左侧面包屑 */}
            <Breadcrumb
              items={breadcrumbItems.length > 0 ? [{ title: <Link href="/admin/dashboard" style={{ color: '#86909c' }}>首页</Link> }, ...breadcrumbItems] : []}
              style={{ fontSize: 14 }}
            />

            {/* 右侧操作区 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* 全屏切换 */}
              <div
                onClick={toggleFullscreen}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: 6,
                  color: '#4e5969',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f3f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {fullscreen ? <FullscreenExitOutlined style={{ fontSize: 16 }} /> : <FullscreenOutlined style={{ fontSize: 16 }} />}
              </div>

              {/* 刷新 */}
              <div
                onClick={handleRefresh}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: 6,
                  color: '#4e5969',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f3f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <ReloadOutlined style={{ fontSize: 16 }} />
              </div>

              {/* 通知 */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: 6,
                  color: '#4e5969',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f3f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Badge count={3} size="small" offset={[0, 2]}>
                  <BellOutlined style={{ fontSize: 16 }} />
                </Badge>
              </div>

              {/* 分隔线 */}
              <div style={{
                width: 1,
                height: 20,
                background: '#e5e6eb',
                margin: '0 8px',
              }} />

              {/* 用户头像下拉 */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px 4px 4px',
                  borderRadius: 20,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f2f3f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Avatar
                    size={28}
                    icon={<UserOutlined />}
                    style={{
                      background: '#3370ff',
                      fontSize: 13,
                    }}
                  />
                  <Text style={{ fontWeight: 500, fontSize: 13, color: '#1d2129' }}>{user?.username || 'Admin'}</Text>
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* 内容区 */}
          <Content style={{
            margin: 24,
            minHeight: 'calc(100vh - 96px)',
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}