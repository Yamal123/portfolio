'use client'

import React, { useState, useCallback } from 'react'
import {
  Card,
  Input,
  Button,
  Menu,
  Tag,
  Badge,
  Modal,
  Form,
  Select,
  Slider,
  Switch,
  InputNumber,
  message,
  Progress,
  Space,
  Popconfirm,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const { TextArea } = Input

interface SkillItem {
  id: string
  name: string
  categoryId: string
  level: number
  description: string
  status: boolean
  sortOrder: number
}

const CATEGORIES = [
  { key: 'ai', label: 'AI能力' },
  { key: 'product', label: '产品能力' },
  { key: 'tech', label: '技术技能' },
  { key: 'soft', label: '软技能' },
]

const MOCK_SKILLS: SkillItem[] = [
  { id: '1', name: '机器学习', categoryId: 'ai', level: 85, description: '精通机器学习算法', status: true, sortOrder: 1 },
  { id: '2', name: '自然语言处理', categoryId: 'ai', level: 78, description: 'NLP技术应用', status: true, sortOrder: 2 },
  { id: '3', name: '产品规划', categoryId: 'product', level: 92, description: '产品全生命周期管理', status: true, sortOrder: 3 },
  { id: '4', name: '用户研究', categoryId: 'product', level: 88, description: '用户调研与分析', status: true, sortOrder: 4 },
  { id: '5', name: 'React', categoryId: 'tech', level: 90, description: '前端框架开发', status: true, sortOrder: 5 },
  { id: '6', name: 'TypeScript', categoryId: 'tech', level: 85, description: '类型安全开发', status: true, sortOrder: 6 },
  { id: '7', name: '沟通协调', categoryId: 'soft', level: 95, description: '跨团队协作能力', status: true, sortOrder: 7 },
  { id: '8', name: '项目管理', categoryId: 'soft', level: 88, description: '敏捷项目管理', status: false, sortOrder: 8 },
]

function SortableSkillCard({ skill, onEdit, onDelete, onToggleStatus }: {
  skill: SkillItem
  onEdit: (skill: SkillItem) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getProgressColor = (level: number) => {
    if (level <= 20) return '#ff4d4f'
    if (level <= 40) return '#fa8c16'
    if (level <= 60) return '#faad14'
    if (level <= 80) return '#52c41a'
    return '#1890ff'
  }

  const getCategoryLabel = (categoryId: string) => {
    return CATEGORIES.find(c => c.key === categoryId)?.label || categoryId
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        hoverable
        style={{ marginBottom: 16, cursor: 'move' }}
        {...listeners}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 16 }}>{skill.name}</h4>
          <Badge
            status={skill.status ? 'success' : 'default'}
            text={skill.status ? '上架' : '下架'}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Progress
            percent={skill.level}
            strokeColor={getProgressColor(skill.level)}
            format={(percent) => `${percent}%`}
            size="small"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Tag color="blue">{getCategoryLabel(skill.categoryId)}</Tag>
        </div>

        {skill.description && (
          <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>{skill.description}</p>
        )}

        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(skill)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确认操作"
            description={`确定要${skill.status ? '下架' : '上架'}该技能吗？`}
            onConfirm={() => onToggleStatus(skill.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={skill.status ? <DownOutlined /> : <UpOutlined />}
              size="small"
            >
              {skill.status ? '下架' : '上架'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="删除确认"
            description="确定要删除该技能吗？此操作不可恢复。"
            onConfirm={() => onDelete(skill.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      </Card>
    </div>
  )
}

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [skills, setSkills] = useState<SkillItem[]>(MOCK_SKILLS)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null)
  const [form] = Form.useForm()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredSkills = skills.filter(skill => {
    const matchCategory = selectedCategory === 'all' || skill.categoryId === selectedCategory
    const matchSearch = !searchKeyword ||
      skill.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchKeyword.toLowerCase())
    return matchCategory && matchSearch
  })

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }))
        message.success('排序已更新')
        return newItems
      })
    }
  }, [])

  const handleAdd = () => {
    setEditingSkill(null)
    form.resetFields()
    form.setFieldsValue({
      level: 50,
      status: true,
      sortOrder: 0,
    })
    setModalVisible(true)
  }

  const handleEdit = (skill: SkillItem) => {
    setEditingSkill(skill)
    form.setFieldsValue(skill)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setSkills(skills.filter(s => s.id !== id))
    message.success('删除成功')
  }

  const handleToggleStatus = (id: string) => {
    setSkills(skills.map(s =>
      s.id === id ? { ...s, status: !s.status } : s
    ))
    message.success('状态已更新')
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingSkill) {
        setSkills(skills.map(s =>
          s.id === editingSkill.id ? { ...s, ...values } : s
        ))
        message.success('更新成功')
      } else {
        const newSkill: SkillItem = {
          ...values,
          id: Date.now().toString(),
          sortOrder: skills.length + 1,
        }
        setSkills([...skills, newSkill])
        message.success('添加成功')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getLevelMarks = () => ({
    0: '初学',
    20: '入门',
    40: '熟练',
    60: '精通',
    80: '专家',
    100: '',
  })

  const menuItems = [
    { key: 'all', label: '全部技能' },
    ...CATEGORIES.map(cat => ({ key: cat.key, label: cat.label })),
  ]

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      <div style={{ width: 220, flexShrink: 0 }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedCategory]}
          onClick={({ key }) => setSelectedCategory(key)}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Input
            placeholder="搜索技能..."
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增技能
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredSkills.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {filteredSkills.map((skill) => (
                <SortableSkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {filteredSkills.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}
          >
            暂无数据
          </div>
        )}
      </div>

      <Modal
        title={editingSkill ? '编辑技能' : '新增技能'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            level: 50,
            status: true,
            sortOrder: 0,
          }}
        >
          <Form.Item
            name="name"
            label="技能名称"
            rules={[
              { required: true, message: '请输入技能名称' },
              { max: 30, message: '最多30个字符' },
            ]}
          >
            <Input placeholder="请输入技能名称" maxLength={30} showCount />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {CATEGORIES.map(cat => (
                <Select.Option key={cat.key} value={cat.key}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="熟练度"
          >
            <div>
              <Slider min={0} max={100} marks={getLevelMarks()} />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                <span style={{ color: '#ff4d4f' }}>初学(0-20)</span> |{' '}
                <span style={{ color: '#fa8c16' }}>入门(21-40)</span> |{' '}
                <span style={{ color: '#faad14' }}>熟练(41-60)</span> |{' '}
                <span style={{ color: '#52c41a' }}>精通(61-80)</span> |{' '}
                <span style={{ color: '#1890ff' }}>专家(81-100)</span>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入技能描述"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
