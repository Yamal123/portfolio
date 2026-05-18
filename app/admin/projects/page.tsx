'use client'

import React, { useState, useCallback, useEffect } from 'react'
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
  Spin,
  Empty,
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
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { get, post, put, del } from '@/lib/admin/api'

const { TextArea } = Input
const { Option } = Select

interface ProjectItem {
  id: number | string
  slug: string
  name_zh: string
  name_en: string
  thumbnail?: string
  content_zh?: string
  content_en?: string
  tags: string
  external_url?: string
  view_count: number
  cate_id: number | string
  status: number
  sort_num: number
  deleted_at?: string
  created_at: string
  updated_at?: string
}

interface ProjectCate {
  id: number | string
  cate_name: string
  sort_num: number
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [categories, setCategories] = useState<ProjectCate[]>([])
  const [total, setTotal] = useState(0)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, any> = {
        page: currentPage,
        pageSize: pageSize,
      }
      if (categoryFilter !== 'all') {
        params.cateId = categoryFilter
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter === 'published' ? 1 : 0
      }
      if (searchKeyword) {
        params.keyword = searchKeyword
      }

      const res = await get('/projects', params)
      if (res.code === 1000 || res.data) {
        const data = res.data
        if (data?.list) {
          setProjects(data.list)
          setTotal(data.total || data.list.length)
        } else if (Array.isArray(data)) {
          setProjects(data)
          setTotal(data.length)
        } else {
          setProjects([])
          setTotal(0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, categoryFilter, statusFilter, searchKeyword])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await get('/project-cates')
      if (res.code === 1000 || res.data) {
        setCategories(res.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [fetchProjects, fetchCategories])

  const getCategoryName = (cateId: number | string) => {
    const cate = categories.find(c => c.id === cateId)
    return cate?.cate_name || String(cateId)
  }

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
    form.setFieldsValue({
      ...project,
      nameZh: project.name_zh,
      nameEn: project.name_en,
      categoryId: project.cate_id,
      categoryName: getCategoryName(project.cate_id),
      tags: project.tags ? project.tags.split(',').filter(Boolean) : [],
      externalUrl: project.external_url,
      viewCount: project.view_count,
      sortOrder: project.sort_num,
      status: project.status === 1,
      contentZh: project.content_zh,
      contentEn: project.content_en,
    })
    setDrawerVisible(true)
  }

  const handleDelete = async (id: number | string) => {
    try {
      await del(`/projects/${id}`)
      message.success('删除成功')
      fetchProjects()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleToggleStatus = async (id: number | string) => {
    try {
      const project = projects.find(p => p.id === id)
      const newStatus = project?.status === 1 ? 0 : 1
      await put(`/projects/${id}`, { status: newStatus })
      message.success('状态已更新')
      fetchProjects()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  const convertToApiFormat = (values: Record<string, any>) => ({
    slug: values.slug,
    cate_id: values.categoryId || values.cate_id,
    name_zh: values.nameZh,
    name_en: values.nameEn,
    thumbnail: values.thumbnail || '',
    content_zh: values.contentZh || '',
    content_en: values.contentEn || '',
    tags: Array.isArray(values.tags) ? values.tags.join(',') : (values.tags || ''),
    external_url: values.externalUrl || values.external_url || '',
    sort_num: values.sortOrder || values.sort_num || 0,
    status: values.status ? 1 : 0,
  })

  const handleDrawerOk = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const payload = convertToApiFormat(values)

      if (editingProject) {
        await put(`/projects/${editingProject.id}`, payload)
        message.success('更新成功')
      } else {
        await post('/projects', payload)
        message.success('创建成功')
      }
      setDrawerVisible(false)
      form.resetFields()
      fetchProjects()
    } catch (error: any) {
      if (error?.errorFields) {
        return
      }
      console.error('Submit failed:', error)
      message.error(editingProject ? '更新失败' : '创建失败')
    } finally {
      setSubmitting(false)
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
      dataIndex: 'name_zh',
      key: 'name_zh',
      width: 200,
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.name_en}</div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'cate_id',
      key: 'cate_id',
      width: 100,
      render: (cateId: number | string) => <Tag color="blue">{getCategoryName(cateId)}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string) => {
        const tagList = tags ? tags.split(',').filter(Boolean) : []
        return (
          <>
            {tagList.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag.trim()}</Tag>
            ))}
            {tagList.length > 3 && <Tag>+{tagList.length - 3}</Tag>}
          </>
        )
      },
    },
    {
      title: '外部链接',
      dataIndex: 'external_url',
      key: 'external_url',
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
      dataIndex: 'view_count',
      key: 'view_count',
      width: 80,
      render: (count: number) => count?.toLocaleString() || '0',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Badge
          status={status === 1 ? 'success' : 'default'}
          text={status === 1 ? '上架' : '下架'}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort_num',
      key: 'sort_num',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-',
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
          <Popconfirm
            title="确认操作"
            description={`确定要${record.status === 1 ? '下架' : '上架'}吗？`}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              icon={record.status === 1 ? <DownOutlined /> : <UpOutlined />}
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
            onChange={(value) => { setCategoryFilter(value); setCurrentPage(1) }}
            style={{ width: 140 }}
            allowClear
          >
            <Option value="all">全部分类</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={String(cat.id)}>
                {cat.cate_name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={(value) => { setStatusFilter(value); setCurrentPage(1) }}
            style={{ width: 120 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="published">上架</Option>
            <Option value="unpublished">下架</Option>
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
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchProjects()}
          >
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建项目
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        {viewMode === 'table' ? (
          <>
            <Table
              columns={columns}
              dataSource={projects}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1400 }}
              size="middle"
            />
            {total > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 16,
              }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
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
            )}
          </>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 24,
            }}>
              {projects.map(project => (
                <Card
                  key={project.id}
                  hoverable
                  cover={
                    project.thumbnail ? (
                      <img
                        alt={project.name_zh}
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
                    <Badge
                      key="status"
                      status={project.status === 1 ? 'success' : 'default'}
                      text={project.status === 1 ? '上架' : '下架'}
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
                    title={project.name_zh}
                    description={
                      <div>
                        <div style={{ marginBottom: 8, color: '#666', fontSize: 13 }}>
                          {project.name_en}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Tag color="blue">{getCategoryName(project.cate_id)}</Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          {(project.tags ? project.tags.split(',').filter(Boolean) : []).slice(0, 3).map((tag, index) => (
                            <Tag key={index}>{tag.trim()}</Tag>
                          ))}
                        </div>
                        <div style={{ color: '#999', fontSize: 12 }}>
                          <EyeOutlined /> {project.view_count?.toLocaleString() || '0'} 次浏览
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>

            {!loading && projects.length === 0 && (
              <Empty description="暂无项目数据" style={{ padding: '60px 0' }} />
            )}

            {total > 0 && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
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
            )}
          </>
        )}
      </Spin>

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={drawerVisible}
        onOk={handleDrawerOk}
        onCancel={() => setDrawerVisible(false)}
        width={720}
        destroyOnClose
        confirmLoading={submitting}
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
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>
                  {cat.cate_name}
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
