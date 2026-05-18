'use client'

import React from 'react'
import { Card, Row, Col, Table, Tag, Typography, Button, Spin } from 'antd'
import {
  FileTextOutlined,
  EditOutlined,
  UserOutlined,
  EyeOutlined,
  PlusOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'
import useSWR from 'swr'
import { get } from '@/lib/admin/api'

const { Title } = Typography

const statCardGradients = [
  { from: '#667eea', to: '#764ba2', icon: FileTextOutlined },
  { from: '#f093fb', to: '#f5576c', icon: EditOutlined },
  { from: '#4facfe', to: '#00f2fe', icon: UserOutlined },
  { from: '#43e97b', to: '#38f9d7', icon: EyeOutlined },
]

const quickActions = [
  {
    title: '新建项目',
    icon: PlusOutlined,
    link: '/admin/projects?action=create',
    color: '#f97316',
    bgColor: '#fff7ed',
    disabled: false,
  },
  {
    title: '修改个人信息',
    icon: UserOutlined,
    link: '/admin/profile',
    color: '#6366f1',
    bgColor: '#eef2ff',
    disabled: false,
  },
  {
    title: '查看统计',
    icon: BarChartOutlined,
    link: '/admin/analytics',
    color: '#10b981',
    bgColor: '#ecfdf5',
    disabled: false,
  },
  {
    title: '系统设置',
    icon: SettingOutlined,
    link: '/admin/settings',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    disabled: false,
  },
]

const getActionTag = (actionType: string) => {
  const config: Record<string, { color: string; text: string }> = {
    login: { color: 'purple', text: '登录' },
    create: { color: 'green', text: '新增' },
    update: { color: 'blue', text: '修改' },
    delete: { color: 'red', text: '删除' },
    backup: { color: 'cyan', text: '备份' },
    restore: { color: 'magenta', text: '恢复' },
  }
  return (
    <Tag color={config[actionType]?.color || 'default'} style={{ borderRadius: 4, fontWeight: 500 }}>
      {config[actionType]?.text || actionType}
    </Tag>
  )
}

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useSWR('/stats', () => get<any>('/stats'))
  const { data: analyticsOverview } = useSWR('/analytics/overview', () => get<any>('/analytics/overview'))
  const { data: trendData } = useSWR('/analytics/trend?days=7', () => get<any>('/analytics/trend?days=7'))
  const { data: logsData } = useSWR('/logs?page=1&pageSize=10', () => get<any>('/logs?page=1&pageSize=10'))

  const stats = statsData?.data || {}
  const overview = analyticsOverview?.data || {}
  const trend = trendData?.data || []
  const logs = logsData?.data

  const statCards = [
    { title: '总项目数', value: stats.project_count || 0 },
    { title: '总技能数', value: stats.total_skills || 0 },
    { title: '今日访客', value: overview.today_uv || 0 },
    { title: '总浏览量', value: overview.total_pv || 0 },
  ]

  const chartData = Array.isArray(trend) ? trend.map((item: any) => ({
    date: item.date ? item.date.slice(5) : '',
    uv: item.uv || 0,
    pv: item.pv || 0,
  })) : []

  const logList = logs?.list || []
  const logDataSource = logList.map((log: any, index: number) => ({
    key: String(log.id || index),
    time: log.created_at || '',
    operator: log.admin_name || '',
    action: log.action_type || '',
    target: log.target_module || '',
    detail: typeof log.content === 'string' ? log.content : JSON.stringify(log.content),
    ip: log.ip_address || '',
  }))

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (t: string) => <span style={{ color: '#666', fontSize: 13 }}>{t}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      render: (actionType: string) => getActionTag(actionType),
    },
    {
      title: '操作对象',
      dataIndex: 'target',
      key: 'target',
      width: 150,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: (d: string) => <span style={{ color: '#888', fontSize: 13 }}>{d}</span>,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (ip: string) => <span style={{ fontFamily: 'monospace', color: '#999', fontSize: 12 }}>{ip}</span>,
    },
  ]

  if (statsLoading && !statsData) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#999' }}>加载仪表盘数据...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <Title level={4} style={{ marginBottom: 24, fontWeight: 700, fontSize: 20 }}>
        仪表盘
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[20, 20]}>
        {statCards.map((card, index) => {
          const gradient = statCardGradients[index]
          const IconComp = gradient.icon
          return (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                bordered={false}
                style={{
                  background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  height: 130,
                  cursor: 'default',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                styles={{
                  body: { padding: '24px', position: 'relative', zIndex: 1, height: '100%' },
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12, fontWeight: 500 }}>
                      {card.title}
                    </div>
                    <div style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1.2, letterSpacing: -1 }}>
                      {card.value.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 13,
                    marginTop: 8,
                  }}>
                    <ArrowUpOutlined style={{ fontSize: 11 }} />
                    <span>较昨日</span>
                  </div>
                </div>

                {/* 背景装饰图标 */}
                <div style={{
                  position: 'absolute',
                  right: -8,
                  bottom: -12,
                  fontSize: 90,
                  opacity: 0.12,
                  color: '#fff',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}>
                  <IconComp />
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* 趋势图表 */}
      <Card
        bordered={false}
        style={{
          marginTop: 28,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '24px 24px 8px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>7日访问趋势</Title>
          <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#6366f1',
                display: 'inline-block',
              }} />
              UV（访客）
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#f97316',
                display: 'inline-block',
              }} />
              PV（浏览）
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '12px 16px',
                fontSize: 13,
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="uv"
              name="UV"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradientUv)"
              dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="pv"
              name="PV"
              stroke="#f97316"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{ r: 4, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* 快捷操作 */}
      <Title level={5} style={{ marginTop: 28, marginBottom: 16, fontWeight: 700, fontSize: 16 }}>
        快捷操作
      </Title>
      <Row gutter={[16, 16]}>
        {quickActions.map((action, index) => {
          const IconComp = action.icon
          return (
            <Col xs={12} sm={12} md={6} key={index}>
              <Link href={action.link} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable={!action.disabled}
                  bordered={false}
                  style={{
                    textAlign: 'center',
                    opacity: action.disabled ? 0.45 : 1,
                    cursor: action.disabled ? 'not-allowed' : 'pointer',
                    borderRadius: 14,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                  }}
                  styles={{ body: { padding: '28px 16px' } }}
                  onMouseEnter={(e) => {
                    if (!action.disabled) {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'
                      e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}25`
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: action.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    transition: 'transform 0.3s',
                  }}>
                    <IconComp style={{ fontSize: 26, color: action.color }} />
                  </div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#333',
                  }}>
                    {action.title}
                  </div>
                </Card>
              </Link>
            </Col>
          )
        })}
      </Row>

      {/* 最近日志 */}
      <Card
        bordered={false}
        style={{
          marginTop: 28,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '24px 24px 8px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>最近日志</Title>
          <span style={{ fontSize: 13, color: '#999' }}>最近 10 条操作记录</span>
        </div>
        <Table
          columns={logColumns}
          dataSource={logDataSource}
          pagination={false}
          size="small"
          locale={{ emptyText: '暂无操作日志' }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'table-row-light' : ''
          }
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
        <style jsx global>{`
          .table-row-light {
            background-color: #fafbfc;
          }
          .ant-table-thead > tr > th {
            background-color: #f8f9fb !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            color: #555 !important;
            border-bottom: 2px solid #eee !important;
          }
          .ant-table-tbody > tr:hover > td {
            background-color: #f0f4ff !important;
          }
          .ant-table-small .ant-table-cell {
            padding: 10px 12px !important;
          }
        `}</style>
      </Card>
    </div>
  )
}
