'use client'

import React, { useState } from 'react'
import {
  Card,
  Table,
  Input,
  Button,
  Select,
  Tag,
  Badge,
  Space,
  Pagination,
  Modal,
  Form,
  InputNumber,
  Radio,
  Upload,
  message,
  Popconfirm,
  Tooltip,
  Image,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  TableOutlined,
  AppstoreOutlined,
  CopyOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

interface ProjectItem {
  id: string
  nameZh: string
  nameEn: string
  slug: string
  categoryId: string
  categoryName: string
  thumbnail?: string
  tags: string[]
  externalUrl?: string
  viewCount: number
  status: boolean
  sortOrder: number
  createdAt: string
  contentZh?: string
  contentEn?: string
}

const CATEGORIES = [
  { key: 'web', label: 'Web应用' },
  { key: 'mobile', label: '移动应用' },
  { key: 'ai', label: 'AI项目' },
  { key: 'tool', label: '工具软件' },
]

const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: '1',
    nameZh: 'AI智能客服系统',
    nameEn: 'AI Customer Service System',
    slug: 'ai-customer-service',
    categoryId: 'ai',
    categoryName: 'AI项目',
    thumbnail: 'https://via.placeholder.com/400x225/1890ff/ffffff?text=AI+客服',
    tags: ['React', 'Node.js', 'NLP', 'WebSocket'],
    externalUrl: 'https://example.com/ai-service',
    viewCount: 1523,
    status: true,
    sortOrder: 1,
    createdAt: '2025-05-10T08:00:00Z',
    contentZh: '基于自然语言处理的智能客服系统...',
    contentEn: 'An intelligent customer service system based on NLP...',
  },
  {
    id: '2',
    nameZh: '电商平台管理后台',
    nameEn: 'E-commerce Admin Panel',
    slug: 'ecommerce-admin',
    categoryId: 'web',
    categoryName: 'Web应用',
    thumbnail: 'https://via.placeholder.com/400x225/52c41a/ffffff?text=电商+后台',
    tags: ['Vue', 'TypeScript', 'Element UI'],
    externalUrl: 'https://example.com/ecommerce-admin',
    viewCount: 2341,
    status: true,
    sortOrder: 2,
    createdAt: '2025-05-08T10:30:00Z',
    contentZh: '功能完善的电商管理后台系统...',
    contentEn: 'A comprehensive e-commerce admin panel...',
  },
  {
    id: '3',
    nameZh: '移动端健身APP',
    nameEn: 'Fitness Mobile App',
    slug: 'fitness-app',
    categoryId: 'mobile',
    categoryName: '移动应用',
    thumbnail: 'https://via.placeholder.com/400x225/fa8c16/ffffff?text=健身+APP',
    tags: ['React Native', 'Redux', 'Firebase'],
    externalUrl: '',
    viewCount: 987,
    status: true,
    sortOrder: 3,
    createdAt: '2025-05-05T14:20:00Z',
    contentZh: '跨平台健身追踪应用...',
    contentEn: 'A cross-platform fitness tracking app...',
  },
  {
    id: '4',
    nameZh: '代码质量检测工具',
    nameEn: 'Code Quality Checker',
    slug: 'code-quality-tool',
    categoryId: 'tool',
    categoryName: '工具软件',
    thumbnail: 'https://via.placeholder.com/400x225/722ed1/ffffff?text=代码+工具',
    tags: ['Python', 'AST', 'CLI'],
    externalUrl: 'https://github.com/example/code-checker',
    viewCount: 654,
    status: false,
    sortOrder: 4,
    createdAt: '2025-05-01T09:15:00Z',
    contentZh: '自动化代码质量分析工具...',
    contentEn: 'An automated code quality analysis tool...',
  },
  {
    id: '5',
    nameZh: '数据可视化大屏',
    nameEn: 'Data Visualization Dashboard',
    slug: 'data-dashboard',
    categoryId: 'web',
    categoryName: 'Web应用',
    thumbnail: 'https://via.placeholder.com/400x225/eb2f96/ffffff?text=数据+大屏',
    tags: ['ECharts', 'D3.js', 'WebSocket'],
    externalUrl: 'https://example.com/data-dashboard',
    viewCount: 1876,
    status: true,
    sortOrder: 5,
    createdAt: '2025-04-28T16:45:00Z',
    contentZh: '实时数据可视化展示平台...',
    contentEn: 'A real-time data visualization platform...',
  },
  {
    id: '6',
    nameZh: '在线协作白板',
    nameEn: 'Collaborative Whiteboard',
    slug: 'collab-whiteboard',
    categoryId: 'web',
    categoryName: 'Web应用',
    thumbnail: 'https://via.placeholder.com/400x225/13c2c2/ffffff?text=协作+白板',
    tags: ['Canvas', 'Socket.io', 'CRDT'],
    externalUrl: 'https://example.com/whiteboard',
    viewCount: 1234,
    status: true,
    sortOrder: 6,
    createdAt: '2025-04-25T11:30:00Z',
    contentZh: '多人实时协作绘图工具...',
    contentEn: 'A real-time collaborative drawing tool...',
  },
]

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [form] = Form.useForm()

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchSearch = !searchKeyword ||
      project.nameZh.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      project.nameEn.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))
    const matchCategory = categoryFilter === 'all' || project.categoryId === categoryFilter
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && project.status) ||
      (statusFilter === 'unpublished' && !project.status)

    return matchSearch && matchCategory && matchStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'viewCount':
        return b.viewCount - a.viewCount
      case 'sortOrder':
        return a.sortOrder - b.sortOrder
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    message.success('链接已复制到剪贴板')
  }

  const handleAdd = () => {
    setEditingProject(null)
    form.resetFields()
    form.setFieldsValue({
      status: true,
      sortOrder: 0,
    })
    setDrawerVisible(true)
  }

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project)
    form.setFieldsValue(project)
    setDrawerVisible(true)
  }

  const handleDelete = (id: string) => {
    message.success('删除成功')
  }

  const handleToggleStatus = (id: string) => {
    message.success('状态已更新')
  }

  const handleDrawerOk = async () => {
    try {
      await form.validateFields()
      if (editingProject) {
        message.success('更新成功')
      } else {
        message.success('创建成功')
      }
      setDrawerVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns: ColumnsType<ProjectItem> = [
    {
      title: '缩略图',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      render: (url: string) => (
        url ? (
          <Image
            src={url}
            alt="缩略图"
            width={80}
            height={45}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        ) : (
          <div style={{
            width: 80,
            height: 45,
            background: '#f0f0f0',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: 12,
          }}>
            无图片
          </div>
        )
      ),
    },
    {
      title: '名称',
      dataIndex: 'nameZh',
      key: 'nameZh',
      width: 200,
      sorter: (a, b) => a.nameZh.localeCompare(b.nameZh),
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.nameEn}</div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.slice(0, 3).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
        </>
      ),
    },
    {
      title: '外部链接',
      dataIndex: 'externalUrl',
      key: 'externalUrl',
      width: 150,
      render: (url: string) =>
        url ? (
          <Tooltip title="点击复制">
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyUrl(url)}
            >
              复制链接
            </Button>
          </Tooltip>
        ) : (
          '-'
        ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      sorter: (a, b) => a.viewCount - b.viewCount,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean) => (
        <Badge
          status={status ? 'success' : 'default'}
          text={status ? '上架' : '下架'}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: (a, b) => a.sortOrder - b.sortOrder,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
          >
            查看
          </Button>
          <Popconfirm
            title="确认操作"
            description={`确定要${record.status ? '下架' : '上架'}吗？`}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              icon={record.status ? <DownOutlined /> : <UpOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="删除确认"
            description="确定要删除该项目吗？此操作不可恢复。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <Space wrap>
          <Input.Search
            placeholder="搜索项目..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={(value) => setSearchKeyword(value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="分类筛选"
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 140 }}
            allowClear
          >
            <Option value="all">全部分类</Option>
            {CATEGORIES.map(cat => (
              <Option key={cat.key} value={cat.key}>
                {cat.label}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="published">上架</Option>
            <Option value="unpublished">下架</Option>
          </Select>
          <Select
            placeholder="排序方式"
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 140 }}
          >
            <Option value="createdAt">创建时间</Option>
            <Option value="viewCount">浏览量</Option>
            <Option value="sortOrder">排序</Option>
          </Select>
        </Space>

        <Space>
          <Button.Group>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              icon={<TableOutlined />}
              onClick={() => setViewMode('table')}
            />
            <Button
              type={viewMode === 'card' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('card')}
            />
          </Button.Group>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建项目
          </Button>
        </Space>
      </div>

      {viewMode === 'table' ? (
        <>
          <Table
            columns={columns}
            dataSource={paginatedProjects}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1400 }}
            size="middle"
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 16,
          }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={sortedProjects.length}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              onChange={(page, size) => {
                setCurrentPage(page)
                setPageSize(size)
              }}
              pageSizeOptions={['10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}>
            {paginatedProjects.map(project => (
              <Card
                key={project.id}
                hoverable
                cover={
                  project.thumbnail ? (
                    <img
                      alt={project.nameZh}
                      src={project.thumbnail}
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      height: 180,
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                    }}>
                      无封面图
                    </div>
                  )
                }
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEdit(project)} />,
                  <EyeOutlined key="view" />,
                  <Badge
                    key="status"
                    status={project.status ? 'success' : 'default'}
                    text={project.status ? '上架' : '下架'}
                  />,
                  <Popconfirm
                    key="delete"
                    title="删除确认"
                    description="确定要删除吗？"
                    onConfirm={() => handleDelete(project.id)}
                  >
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={project.nameZh}
                  description={
                    <div>
                      <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
                        {project.nameEn}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        {project.tags.slice(0, 3).map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                        {project.tags.length > 3 &&
                          <Tag>+{project.tags.length - 3}</Tag>}
                      </div>
                      <div style={{ color: '#999', fontSize: 12 }}>
                        <EyeOutlined /> {project.viewCount.toLocaleString()} 次浏览
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={sortedProjects.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            onChange={(page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            }}
            pageSizeOptions={['10', '20', '50']}
            style={{ textAlign: 'right' }}
          />
        </>
      )}

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={drawerVisible}
        onOk={handleDrawerOk}
        onCancel={() => setDrawerVisible(false)}
        width={720}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true,
            sortOrder: 0,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>基础信息</div>

          <Form.Item
            name="nameZh"
            label="中文名称"
            rules={[
              { required: true, message: '请输入中文名称' },
              { max: 50, message: '最多50个字符' },
            ]}
          >
            <Input placeholder="请输入项目中文名" maxLength={50} showCount />
          </Form.Item>

          <Form.Item
            name="nameEn"
            label="英文名称"
            rules={[
              { required: true, message: '请输入英文名称' },
              { max: 100, message: '最多100个字符' },
            ]}
          >
            <Input placeholder="请输入项目英文名" maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL标识"
            rules={[
              { required: true, message: '请输入URL标识' },
              { max: 30, message: '最多30个字符' },
              {
                pattern: /^[a-z0-9-]+$/,
                message: '只能包含小写字母、数字和连字符',
              },
            ]}
          >
            <Input placeholder="如: my-project-name" maxLength={30} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {CATEGORIES.map(cat => (
                <Option key={cat.key} value={cat.key}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="封面图片"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
            <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
              建议尺寸 16:9，支持 JPG/PNG 格式
            </div>
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="输入标签后按回车添加"
              maxTagCount={10}
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="externalUrl"
            label="外部链接"
          >
            <Input placeholder="https://" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
          >
            <Radio.Group>
              <Radio value={true}>上架</Radio>
              <Radio value={false}>下架</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label="排序"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ fontWeight: 600, margin: '24px 0 16px', fontSize: 15 }}>详情内容</div>

          <Form.Item
            name="contentZh"
            label="中文详情"
          >
            <TextArea
              rows={6}
              placeholder="请输入中文详细描述"
              maxLength={10000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="contentEn"
            label="英文详情"
          >
            <TextArea
              rows={6}
              placeholder="请输入英文详细描述"
              maxLength={10000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
