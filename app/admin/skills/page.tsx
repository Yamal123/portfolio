'use client'

import React, { useState, useCallback, useEffect } from 'react'
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
  Spin,
  Empty,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  SearchOutlined,
  ReloadOutlined,
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
import { get, post, put, del } from '@/lib/admin/api'

const { TextArea } = Input

interface SkillItem {
  id: number | string
  name: string
  cate_id: number | string
  level: number
  description: string
  status: number
  sort_num: number
  tags?: string
  icon_url?: string
  created_at?: string
  updated_at?: string
}

interface SkillCate {
  id: number | string
  cate_name: string
  cate_icon?: string
  sort_num: number
}

function SortableSkillCard({ skill, categories, onEdit, onDelete, onToggleStatus }: {
  skill: SkillItem
  categories: SkillCate[]
  onEdit: (skill: SkillItem) => void
  onDelete: (id: number | string) => void
  onToggleStatus: (id: number | string) => void
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

  const getCategoryLabel = (cateId: number | string) => {
    const cate = categories.find(c => c.id === cateId)
    return cate?.cate_name || String(cateId)
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
            status={skill.status === 1 ? 'success' : 'default'}
            text={skill.status === 1 ? '上架' : '下架'}
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
          <Tag color="blue">{getCategoryLabel(skill.cate_id)}</Tag>
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
            description={`确定要${skill.status === 1 ? '下架' : '上架'}该技能吗？`}
            onConfirm={() => onToggleStatus(skill.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={skill.status === 1 ? <DownOutlined /> : <UpOutlined />}
              size="small"
            >
              {skill.status === 1 ? '下架' : '上架'}
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
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [categories, setCategories] = useState<SkillCate[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      const res = await get('/skills', { page: 1, pageSize: 100 })
      if (res.code === 200 || res.data) {
        setSkills(res.data?.list || res.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await get('/skills/skill-cates')
      if (res.code === 200 || res.data) {
        setCategories(res.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchSkills()
    fetchCategories()
  }, [fetchSkills, fetchCategories])

  const filteredSkills = skills.filter(skill => {
    const matchCategory = selectedCategory === 'all' || String(skill.cate_id) === selectedCategory
    const matchSearch = !searchKeyword ||
      skill.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchKeyword.toLowerCase())
    return matchCategory && matchSearch
  })

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSkills((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          sort_num: index + 1,
        }))
        return newItems
      })

      try {
        const newSkills = [...skills]
        const oldIndex = newSkills.findIndex((i) => i.id === active.id)
        const newIndex = newSkills.findIndex((i) => i.id === over.id)
        const reorderedSkills = arrayMove(newSkills, oldIndex, newIndex).map((item, index) => ({
          ...item,
          sort_num: index + 1,
        }))

        await Promise.all(
          reorderedSkills.map(skill =>
            put(`/skills/${skill.id}`, { sort_num: skill.sort_num })
          )
        )
        message.success('排序已更新')
        fetchSkills()
      } catch (error) {
        message.error('排序更新失败')
        fetchSkills()
      }
    }
  }, [skills, fetchSkills])

  const handleAdd = () => {
    setEditingSkill(null)
    form.resetFields()
    form.setFieldsValue({
      level: 50,
      status: 1,
      sort_num: 0,
    })
    setModalVisible(true)
  }

  const handleEdit = (skill: SkillItem) => {
    setEditingSkill(skill)
    form.setFieldsValue({
      ...skill,
      categoryId: skill.cate_id,
      sortOrder: skill.sort_num,
      status: skill.status === 1,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number | string) => {
    try {
      await del(`/skills/${id}`)
      message.success('删除成功')
      fetchSkills()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleToggleStatus = async (id: number | string) => {
    try {
      const skill = skills.find(s => s.id === id)
      const newStatus = skill?.status === 1 ? 0 : 1
      await put(`/skills/${id}`, { status: newStatus })
      message.success('状态已更新')
      fetchSkills()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const payload = {
        name: values.name,
        cate_id: values.categoryId || values.cate_id,
        level: values.level,
        description: values.description || '',
        tags: values.tags || '',
        sort_num: values.sortOrder || values.sort_num || 0,
        status: values.status ? 1 : 0,
      }

      if (editingSkill) {
        await put(`/skills/${editingSkill.id}`, payload)
        message.success('更新成功')
      } else {
        await post('/skills', payload)
        message.success('添加成功')
      }
      setModalVisible(false)
      form.resetFields()
      fetchSkills()
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      console.error('Submit failed:', error)
      message.error(editingSkill ? '更新失败' : '添加失败')
    } finally {
      setSubmitting(false)
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
    ...categories.map(cat => ({ key: String(cat.id), label: cat.cate_name })),
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
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => { fetchSkills(); fetchCategories() }}
            >
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增技能
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
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
                    categories={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {!loading && filteredSkills.length === 0 && (
            <Empty description="暂无技能数据" style={{ padding: '60px 0' }} />
          )}
        </Spin>
      </div>

      <Modal
        title={editingSkill ? '编辑技能' : '新增技能'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
        confirmLoading={submitting}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            level: 50,
            status: true,
            sort_num: 0,
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
              {categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.cate_name}
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
            name="tags"
            label="标签"
          >
            <Input placeholder="多个标签用逗号分隔" />
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
