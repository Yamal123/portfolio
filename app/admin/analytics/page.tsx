'use client'

import React, { useState, useMemo } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Radio,
  Typography,
  Tag,
} from 'antd'
import {
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const { Title } = Typography

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16']

interface TrendData {
  date: string
  uv: number
  pv: number
}

interface ProjectRankItem {
  rank: number
  name: string
  views: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

interface CategoryData {
  name: string
  value: number
}

const MOCK_TREND_DATA_7D: TrendData[] = [
  { date: '05-10', uv: 1200, pv: 4500 },
  { date: '05-11', uv: 1350, pv: 5200 },
  { date: '05-12', uv: 1100, pv: 4800 },
  { date: '05-13', uv: 1450, pv: 5800 },
  { date: '05-14', uv: 1600, pv: 6200 },
  { date: '05-15', uv: 1380, pv: 5500 },
  { date: '05-16', uv: 1520, pv: 6000 },
]

const MOCK_TREND_DATA_30D: TrendData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `04-${String(17 + i).padStart(2, '0')}`,
  uv: Math.floor(Math.random() * 2000) + 800,
  pv: Math.floor(Math.random() * 8000) + 3000,
}))

const MOCK_TREND_DATA_90D: TrendData[] = Array.from({ length: 90 }, (_, i) => ({
  date: `02-${String(16 + i).padStart(2, '0')}`,
  uv: Math.floor(Math.random() * 3000) + 500,
  pv: Math.floor(Math.random() * 12000) + 2000,
}))

const MOCK_PROJECT_RANKS: ProjectRankItem[] = [
  { rank: 1, name: 'AI智能客服系统', views: 2341, percentage: 18.2, trend: 'up' },
  { rank: 2, name: '电商平台管理后台', views: 1987, percentage: 15.5, trend: 'up' },
  { rank: 3, name: '数据可视化大屏', views: 1654, percentage: 12.9, trend: 'down' },
  { rank: 4, name: '在线协作白板', views: 1432, percentage: 11.2, trend: 'stable' },
  { rank: 5, name: '移动端健身APP', views: 1234, percentage: 9.6, trend: 'up' },
  { rank: 6, name: '代码质量检测工具', views: 987, percentage: 7.7, trend: 'down' },
  { rank: 7, name: '智能数据分析平台', views: 876, percentage: 6.8, trend: 'stable' },
  { rank: 8, name: '自动化测试系统', views: 765, percentage: 6.0, trend: 'up' },
  { rank: 9, name: '实时通讯应用', views: 654, percentage: 5.1, trend: 'down' },
  { rank: 10, name: '内容管理系统', views: 543, percentage: 4.2, trend: 'stable' },
]

const MOCK_CATEGORY_DATA: CategoryData[] = [
  { name: 'AI项目', value: 3521 },
  { name: 'Web应用', value: 2876 },
  { name: '移动应用', value: 2134 },
  { name: '工具软件', value: 1654 },
  { name: '其他', value: 987 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  const trendData = useMemo(() => {
    switch (timeRange) {
      case '30d':
        return MOCK_TREND_DATA_30D
      case '90d':
        return MOCK_TREND_DATA_90D
      case '7d':
      default:
        return MOCK_TREND_DATA_7D
    }
  }, [timeRange])

  const totalPV = useMemo(() =>
    trendData.reduce((sum, item) => sum + item.pv, 0),
    [trendData]
  )

  const todayUV = useMemo(() =>
    trendData[trendData.length - 1]?.uv || 0,
    [trendData]
  )

  const avgDuration = useMemo(() => {
    const avg = (Math.random() * 180 + 60).toFixed(1)
    return parseFloat(avg)
  }, [timeRange])

  const bounceRate = useMemo(() => {
    const rate = (Math.random() * 40 + 20).toFixed(1)
    return parseFloat(rate)
  }, [timeRange])

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />
      case 'down':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
      case 'stable':
        return <MinusOutlined style={{ color: '#999' }} />
    }
  }

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: rank <= 3 ? '#1890ff' : '#f0f0f0',
          color: rank <= 3 ? '#fff' : '#666',
          fontWeight: 600,
          fontSize: 13,
        }}>
          {rank}
        </span>
      ),
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 120,
      sorter: (a: ProjectRankItem, b: ProjectRankItem) => a.views - b.views,
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 100,
      render: (percentage: number) => `${percentage}%`,
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 80,
      align: 'center' as const,
      render: (trend: 'up' | 'down' | 'stable') => getTrendIcon(trend),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>数据统计</Title>

      {/* 概览区 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总浏览量(PV)"
              value={totalPV}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 28 }}
              formatter={(value) => Number(value).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="今日访客(UV)"
              value={todayUV}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="平均停留时长"
              value={avgDuration}
              suffix="秒"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontSize: 28 }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="跳出率"
              value={bounceRate}
              suffix="%"
              valueStyle={{ color: '#eb2f96', fontSize: 28 }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 时间范围切换 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Title level={5} style={{ margin: 0 }}>访问趋势</Title>
        <Radio.Group
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="7d">近7天</Radio.Button>
          <Radio.Button value="30d">近30天</Radio.Button>
          <Radio.Button value="90d">近90天</Radio.Button>
        </Radio.Group>
      </div>

      {/* 趋势图 */}
      <Card style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#1890ff" />
            <YAxis yAxisId="right" orientation="right" stroke="#52c41a" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="uv"
              name="访客数(UV)"
              stroke="#1890ff"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pv"
              name="页面浏览量(PV)"
              stroke="#52c41a"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 项目TOP10 */}
        <Col xs={24} lg={16}>
          <Card title="热门项目 TOP10">
            <Table
              columns={columns}
              dataSource={MOCK_PROJECT_RANKS}
              rowKey="rank"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* 分类占比 */}
        <Col xs={24} lg={8}>
          <Card title="分类占比">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={MOCK_CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MOCK_CATEGORY_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
