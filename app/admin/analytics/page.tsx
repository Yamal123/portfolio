'use client'

import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Radio,
  Typography,
  Spin,
  Empty,
} from 'antd'
import {
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import useSWR from 'swr'
import { get } from '@/lib/admin/api'
import type {
  AnalyticsOverview,
  AnalyticsTrendItem,
} from '@/types/admin'

const { Title } = Typography

interface ProjectRankItem {
  id?: number
  name: string
  views: number
  percentage?: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<number>(7)

  const { data: overviewData, isLoading: overviewLoading } = useSWR(
    '/analytics/overview',
    () => get<any>('/analytics/overview')
  )

  const { data: trendData, isLoading: trendLoading } = useSWR(
    `/analytics/trend?days=${timeRange}`,
    () => get<any>(`/analytics/trend?days=${timeRange}`)
  )

  const { data: projectsData, isLoading: projectsLoading } = useSWR(
    '/analytics/top-projects?limit=10',
    () => get<any>('/analytics/top-projects?limit=10')
  )

  const overview = overviewData?.data || ({} as AnalyticsOverview)
  const trend = (trendData?.data || []) as AnalyticsTrendItem[]
  const projects = (projectsData?.data || []) as ProjectRankItem[]

  const chartData = Array.isArray(trend)
    ? trend.map((item) => ({
        date: item.date ? item.date.slice(5) : '',
        uv: item.uv || 0,
        pv: item.pv || 0,
      }))
    : []

  const projectDataSource = projects.map((project, index) => ({
    key: String(project.id || index),
    rank: index + 1,
    name: project.name || '-',
    views: project.views || 0,
    percentage: project.percentage || 0,
  }))

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: rank <= 3 ? '#f97316' : '#f0f0f0',
            color: rank <= 3 ? '#fff' : '#666',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
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
      sorter: (a: any, b: any) => a.views - b.views,
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 100,
      render: (percentage: number) => `${percentage.toFixed(1)}%`,
    },
  ]

  const isLoading = overviewLoading || trendLoading || projectsLoading

  if (isLoading && !overviewData && !trendData && !projectsData) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#999' }}>加载数据统计...</p>
      </div>
    )
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        数据统计
      </Title>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="今日访客(UV)"
              value={overview.today_uv || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#f97316', fontSize: 26 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="今日浏览(PV)"
              value={overview.today_pv || 0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: 26 }}
              formatter={(value) => Number(value).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="总访客(UV)"
              value={overview.total_uv || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: 26 }}
              formatter={(value) => Number(value).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="总浏览(PV)"
              value={overview.total_pv || 0}
              prefix={<ExportOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: 26 }}
              formatter={(value) => Number(value).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="平均停留时长"
              value={overview.avg_duration || 0}
              suffix="秒"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontSize: 26 }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card hoverable>
            <Statistic
              title="跳出率"
              value={overview.bounce_rate || 0}
              suffix="%"
              valueStyle={{ color: '#eb2f96', fontSize: 26 }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          访问趋势
        </Title>
        <Radio.Group
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value={7}>近7天</Radio.Button>
          <Radio.Button value={30}>近30天</Radio.Button>
          <Radio.Button value={90}>近90天</Radio.Button>
        </Radio.Group>
      </div>

      <Card style={{ marginBottom: 24 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradientUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#d9d9d9' }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#f97316"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#d9d9d9' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#1890ff"
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#d9d9d9' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                iconType="circle"
                iconSize={10}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="uv"
                name="访客数(UV)"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#gradientUv)"
                dot={{ r: 3, fill: '#f97316' }}
                activeDot={{ r: 6, fill: '#f97316' }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="pv"
                name="页面浏览量(PV)"
                stroke="#1890ff"
                strokeWidth={2.5}
                fill="url(#gradientPv)"
                dot={{ r: 3, fill: '#1890ff' }}
                activeDot={{ r: 6, fill: '#1890ff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Empty description="暂无趋势数据" style={{ padding: 80 }} />
        )}
      </Card>

      <Card title="热门项目 TOP10">
        {projectDataSource.length > 0 ? (
          <Table
            columns={columns}
            dataSource={projectDataSource}
            rowKey="key"
            pagination={false}
            size="middle"
            locale={{ emptyText: '暂无项目数据' }}
          />
        ) : (
          <Empty description="暂无项目数据" style={{ padding: 60 }} />
        )}
      </Card>
    </div>
  )
}
