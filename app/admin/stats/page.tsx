'use client'

import React, { useState } from 'react'
import { Card, Row, Col, InputNumber, Button, Typography, message } from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface StatItem {
  key: string
  label: string
  value: number | string
  unit: string
  min: number
  max: number
  step: number | null
  precision: number
}

const INITIAL_STATS: StatItem[] = [
  {
    key: 'yearsOfExperience',
    label: '从业年限',
    value: 8,
    unit: '年',
    min: 0,
    max: 50,
    step: 1,
    precision: 0,
  },
  {
    key: 'projectCount',
    label: '项目数量',
    value: 128,
    unit: '个',
    min: 0,
    max: 999,
    step: 1,
    precision: 0,
  },
  {
    key: 'successRate',
    label: '成功率',
    value: 95.5,
    unit: '%',
    min: 0,
    max: 100,
    step: null,
    precision: 1,
  },
  {
    key: 'efficiencyGain',
    label: '效率提升',
    value: 45.8,
    unit: '%',
    min: 0,
    max: 999,
    step: null,
    precision: 1,
  },
]

function EditableStatCard({ stat, onSave }: {
  stat: StatItem
  onSave: (key: string, value: number) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(stat.value as number)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditValue(stat.value as number)
  }

  const handleSave = () => {
    if (editValue < stat.min || editValue > stat.max) {
      message.error(`请输入 ${stat.min}-${stat.max} 之间的数值`)
      return
    }
    onSave(stat.key, editValue)
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 1000)
  }

  const handleBlur = () => {
    handleSave()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(stat.value as number)
    }
  }

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        opacity: showSuccess ? 1 : 1,
        transition: 'all 0.3s ease-in-out',
        animation: showSuccess ? 'fadeIn 0.5s ease-in-out' : undefined,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>
          {stat.label}
        </Text>

        {isEditing ? (
          <div>
            <InputNumber
              value={editValue}
              onChange={(value) => setEditValue(value || 0)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              min={stat.min}
              max={stat.max}
              step={stat.step || undefined}
              precision={stat.precision}
              size="large"
              style={{
                width: 160,
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1890ff',
              }}
              suffix={stat.unit}
            />
            <div style={{ marginTop: 12 }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSave}
                size="small"
              >
                保存
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="small"
                style={{ marginLeft: 8 }}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleEdit}
            style={{ cursor: 'pointer', position: 'relative', padding: '20px 0' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 4,
            }}>
              <span style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1890ff',
                lineHeight: 1,
              }}>
                {typeof stat.value === 'number'
                  ? stat.value.toFixed(stat.precision)
                  : stat.value}
              </span>
              <span style={{
                fontSize: 24,
                color: '#666',
                fontWeight: 500,
              }}>
                {stat.unit}
              </span>
            </div>

            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                opacity: 0.6,
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  )
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatItem[]>(INITIAL_STATS)

  const handleSave = (key: string, value: number) => {
    setStats(prev =>
      prev.map(item =>
        item.key === key ? { ...item, value } : item
      )
    )
    message.success('数据已更新')
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>履历数据管理</Title>

      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.key}>
            <EditableStatCard stat={stat} onSave={handleSave} />
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={5}>说明</Title>
        <ul style={{ paddingLeft: 20, color: '#666', lineHeight: 2 }}>
          <li>点击数值区域或编辑按钮进入编辑模式</li>
          <li>编辑完成后按 Enter 或点击其他区域自动保存</li>
          <li>所有修改会实时更新到前端展示页面</li>
          <li>请确保数据的准确性和合理性</li>
        </ul>
      </Card>
    </div>
  )
}
