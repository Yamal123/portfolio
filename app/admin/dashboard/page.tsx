'use client'

import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Spin } from 'antd'
import {
  FileTextOutlined,
  EditOutlined,
  UserOutlined,
  EyeOutlined,
  PlusOutlined,
  BarChartOutlined,
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

const quickActions = [
  {
    title: '新建项目',
    icon: <PlusOutlined style={{ fontSize: 24 }} />,
    link: '/admin/projects?action=create',
    disabled: false,
  },
  {
    title: '修改个人信息',
    icon: <UserOutlined style={{ fontSize: 24 }} />,
    link: '/admin/profile',
    disabled: false,
  },
  {
    title: '查看统计',
    icon: <BarChartOutlined style={{ fontSize: 24 }} />,
    link: '/admin/analytics',
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
    <Tag color={config[actionType]?.color || 'default'}>{config[actionType]?.text || actionType}</Tag>
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
    {
      title: '总项目数',
      value: stats.project_count || 0,
      change: 0,
      icon: <FileTextOutlined />,
      color: '#1890ff',
    },
    {
      title: '总技能数',
      value: stats.total_skills || 0,
      change: 0,
      icon: <EditOutlined />,
      color: '#52c41a',
    },
    {
      title: '今日访客',
      value: overview.today_uv || 0,
      change: 0,
      icon: <UserOutlined />,
      color: '#faad14',
    },
    {
      title: '总浏览量',
      value: overview.total_pv || 0,
      change: 0,
      icon: <EyeOutlined />,
      color: '#eb2f96',
    },
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
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
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
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
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
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>仪表盘</Title>

      <Row gutter={[16, 16]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              style={{
                width: '100%',
                height: 120,
                borderRadius: 8,
              }}
            >
              <Statistic
                title={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {card.icon}
                    <span>{card.title}</span>
                  </span>
                }
                value={card.value}
                prefix={null}
                valueStyle={{ color: card.color, fontSize: 28 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={5}>7日访问趋势</Title>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="uv"
              name="UV"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="pv"
              name="PV"
              stroke="#52c41a"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>快捷操作</Title>
      <Row gutter={[16, 16]}>
        {quickActions.map((action, index) => (
          <Col xs={12} sm={8} key={index}>
            <Link href={action.link}>
              <Card
                hoverable={!action.disabled}
                style={{
                  textAlign: 'center',
                  opacity: action.disabled ? 0.5 : 1,
                  cursor: action.disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <div style={{ marginBottom: 8 }}>{action.icon}</div>
                <div>{action.title}</div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={5}>最近日志</Title>
        <Table
          columns={logColumns}
          dataSource={logDataSource}
          pagination={false}
          size="middle"
          locale={{ emptyText: '暂无操作日志' }}
        />
      </Card>
    </div>
  )
}
