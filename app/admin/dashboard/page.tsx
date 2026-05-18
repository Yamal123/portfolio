'use client'

import React from 'react'
import { Card, Row, Col, Table, Tag, Typography, Spin } from 'antd'
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

const statCardColors = ['#3370ff', '#00b42a', '#ff7d00', '#f53f3f']

const quickActions = [
  { title: '新建项目', icon: PlusOutlined, link: '/admin/projects?action=create' },
  { title: '修改个人信息', icon: UserOutlined, link: '/admin/profile' },
  { title: '查看统计', icon: BarChartOutlined, link: '/admin/analytics' },
  { title: '系统设置', icon: SettingOutlined, link: '/admin/settings' },
]

const getActionTag = (actionType: string) => {
  const config: Record<string, { color: string; text: string }> = {
    login: { color: 'processing', text: '登录' },
    create: { color: 'success', text: '新增' },
    update: { color: 'blue', text: '修改' },
    delete: { color: 'error', text: '删除' },
    backup: { color: 'cyan', text: '备份' },
    restore: { color: 'purple', text: '恢复' },
  }
  return (
    <Tag color={config[actionType]?.color || 'default'} style={{ borderRadius: 4, fontSize: 12 }}>
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
    { title: '总项目数', value: stats.project_count || 0, trend: '+12%', trendUp: true },
    { title: '总技能数', value: stats.total_skills || 0, trend: '+8%', trendUp: true },
    { title: '今日访客', value: overview.today_uv || 0, trend: '+23%', trendUp: true },
    { title: '总浏览量', value: overview.total_pv || 0, trend: '-5%', trendUp: false },
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
      render: (t: string) => <span style={{ color: '#86909c', fontSize: 13 }}>{t}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
      render: (name: string) => <span style={{ fontWeight: 500, color: '#1d2129', fontSize: 13 }}>{name}</span>,
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
      render: (t: string) => <span style={{ color: '#4e5969', fontSize: 13 }}>{t}</span>,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: (d: string) => <span style={{ color: '#86909c', fontSize: 13 }}>{d}</span>,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (ip: string) => <span style={{ fontFamily: 'monospace', color: '#c9cdd4', fontSize: 12 }}>{ip}</span>,
    },
  ]

  if (statsLoading && !statsData) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#86909c', fontSize: 14 }}>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                position: 'relative',
                height: 120,
              }}
              styles={{ body: { padding: '20px 20px 16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
            >
              {/* 左侧彩色竖条 */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: statCardColors[index],
              }} />

              <div>
                <div style={{ color: '#86909c', fontSize: 13 }}>{card.title}</div>
                <div style={{ color: '#1d2129', fontSize: 30, fontWeight: 600, marginTop: 8, letterSpacing: -0.5 }}>
                  {card.value.toLocaleString()}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                marginTop: 8,
                color: card.trendUp ? '#00b42a' : '#f53f3f',
              }}>
                <ArrowUpOutlined style={{ fontSize: 11, transform: card.trendUp ? 'none' : 'rotate(180deg)' }} />
                <span>{card.trend} 较上周</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 趋势图表 */}
      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '24px 24px 8px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#1d2129' }}>访问趋势</Title>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4e5969' }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#3370ff',
                display: 'inline-block',
              }} />
              UV（访客）
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4e5969' }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#86909c',
                display: 'inline-block',
              }} />
              PV（浏览）
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3370ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3370ff" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86909c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#86909c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f2f3f5" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#86909c', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#86909c', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: '1px solid #e5e6eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                padding: '10px 14px',
                fontSize: 13,
              }}
              labelStyle={{ fontWeight: 500, marginBottom: 4, color: '#1d2129' }}
            />
            <Area
              type="monotone"
              dataKey="uv"
              name="UV"
              stroke="#3370ff"
              strokeWidth={2}
              fill="url(#gradientUv)"
              dot={{ r: 3, fill: '#3370ff', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#3370ff', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="pv"
              name="PV"
              stroke="#86909c"
              strokeWidth={2}
              dot={{ r: 3, fill: '#86909c', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#86909c', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* 快捷操作 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {quickActions.map((action, index) => {
          const IconComp = action.icon
          return (
            <Col xs={12} sm={12} md={6} key={index}>
              <Link href={action.link} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  bordered={false}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                  }}
                  styles={{ body: { padding: '24px 16px' } }}
                >
                  <IconComp style={{ fontSize: 24, color: '#4e5969', marginBottom: 8 }} />
                  <div style={{
                    fontWeight: 400,
                    fontSize: 13,
                    color: '#1d2129',
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
          marginTop: 24,
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '24px 24px 8px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#1d2129' }}>最近日志</Title>
          <span style={{ fontSize: 13, color: '#86909c' }}>最近 10 条操作记录</span>
        </div>
        <Table
          columns={logColumns}
          dataSource={logDataSource}
          pagination={false}
          size="middle"
          locale={{ emptyText: '暂无操作日志' }}
          rowClassName={(_, index) =>
            index % 2 === 1 ? 'table-row-stripe' : ''
          }
          style={{
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
        <style jsx global>{`
          .table-row-stripe {
            background-color: #fafbfc;
          }
          .ant-table-thead > tr > th {
            background-color: #f2f3f5 !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            color: #4e5969 !important;
            border-bottom: 1px solid #e5e6eb !important;
          }
          .ant-table-tbody > tr:hover > td {
            background-color: #f7f8fa !important;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #f2f3f5 !important;
          }
        `}</style>
      </Card>
    </div>
  )
}