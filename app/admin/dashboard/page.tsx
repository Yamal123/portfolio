'use client'

import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button } from 'antd'
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

const { Title } = Typography

const statCards = [
  {
    title: '总项目数',
    value: 128,
    change: 12.5,
    icon: <FileTextOutlined />,
    color: '#1890ff',
  },
  {
    title: '总文章数',
    value: 56,
    change: 8.3,
    icon: <EditOutlined />,
    color: '#52c41a',
  },
  {
    title: '今日访客',
    value: 1234,
    change: -3.2,
    icon: <UserOutlined />,
    color: '#faad14',
  },
  {
    title: '总浏览量',
    value: 45678,
    change: 15.7,
    icon: <EyeOutlined />,
    color: '#eb2f96',
  },
]

const trendData = [
  { date: '05-10', uv: 400, pv: 2400 },
  { date: '05-11', uv: 300, pv: 1398 },
  { date: '05-12', uv: 200, pv: 9800 },
  { date: '05-13', uv: 278, pv: 3908 },
  { date: '05-14', uv: 189, pv: 4800 },
  { date: '05-15', uv: 239, pv: 3800 },
  { date: '05-16', uv: 349, pv: 4300 },
]

const quickActions = [
  {
    title: '新建项目',
    icon: <PlusOutlined style={{ fontSize: 24 }} />,
    link: '/admin/projects?action=create',
    disabled: false,
  },
  {
    title: '发布文章',
    icon: <EditOutlined style={{ fontSize: 24 }} />,
    link: '#',
    disabled: true,
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

const logData = [
  {
    key: '1',
    time: '2025-05-16 14:30:22',
    operator: '管理员',
    action: '新增',
    target: '项目案例',
    detail: '创建了新项目"AI智能客服系统"',
    ip: '192.168.1.100',
  },
  {
    key: '2',
    time: '2025-05-16 14:25:18',
    operator: '管理员',
    action: '修改',
    target: '专业技能',
    detail: '更新了"React"技能等级为专家',
    ip: '192.168.1.100',
  },
  {
    key: '3',
    time: '2025-05-16 14:20:45',
    operator: '管理员',
    action: '删除',
    target: '文章管理',
    detail: '删除了草稿文章"测试内容"',
    ip: '192.168.1.100',
  },
  {
    key: '4',
    time: '2025-05-16 14:15:33',
    operator: '管理员',
    action: '登录',
    target: '系统',
    detail: '用户登录系统',
    ip: '192.168.1.100',
  },
  {
    key: '5',
    time: '2025-05-16 10:30:12',
    operator: '管理员',
    action: '新增',
    target: '联系方式',
    detail: '添加了新的联系邮箱',
    ip: '192.168.1.101',
  },
  {
    key: '6',
    time: '2025-05-16 09:45:28',
    operator: '管理员',
    action: '修改',
    target: '系统设置',
    detail: '修改了站点名称为"AI PM 个人主页"',
    ip: '192.168.1.100',
  },
  {
    key: '7',
    time: '2025-05-15 18:20:55',
    operator: '管理员',
    action: '新增',
    target: '履历数据',
    detail: '添加了新的工作经历记录',
    ip: '192.168.1.102',
  },
  {
    key: '8',
    time: '2025-05-15 17:35:40',
    operator: '管理员',
    action: '删除',
    target: '项目案例',
    detail: '删除了过期的项目展示',
    ip: '192.168.1.100',
  },
  {
    key: '9',
    time: '2025-05-15 16:50:18',
    operator: '管理员',
    action: '修改',
    target: '个人主页信息',
    detail: '更新了个人简介内容',
    ip: '192.168.1.100',
  },
  {
    key: '10',
    time: '2025-05-15 15:22:33',
    operator: '管理员',
    action: '登录',
    target: '系统',
    detail: '用户登录系统',
    ip: '192.168.1.103',
  },
]

const getActionTag = (action: string) => {
  const config: Record<string, { color: string; text: string }> = {
    新增: { color: 'green', text: '新增' },
    修改: { color: 'blue', text: '修改' },
    删除: { color: 'red', text: '删除' },
    登录: { color: 'purple', text: '登录' },
  }
  return (
    <Tag color={config[action]?.color || 'default'}>{config[action]?.text || action}</Tag>
  )
}

export default function DashboardPage() {
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
      render: (action: string) => getActionTag(action),
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
                suffix={
                  <span
                    style={{
                      fontSize: 14,
                      marginLeft: 8,
                      color: card.change > 0 ? '#52c41a' : '#ff4d4f',
                    }}
                  >
                    {card.change > 0 ? '+' : ''}{card.change}%
                  </span>
                }
                valueStyle={{ color: card.color, fontSize: 28 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={5}>7日访问趋势</Title>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={trendData}>
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
          <Col xs={12} sm={12} key={index}>
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
          dataSource={logData}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}
