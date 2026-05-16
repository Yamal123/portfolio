'use client'

import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Table,
  Select,
  Switch,
  InputNumber,
  Tag,
  Typography,
  message,
  Space,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  sort_num: number
  is_displayed: boolean
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
  const [previewImage, setPreviewImage] = useState<string>('')
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'AI'])
  const [tagInput, setTagInput] = useState('')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'GitHub',
      url: 'https://github.com/example',
      icon: 'github',
      sort_num: 1,
      is_displayed: true,
    },
    {
      id: '2',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/example',
      icon: 'linkedin',
      sort_num: 2,
      is_displayed: true,
    },
    {
      id: '3',
      platform: 'Twitter',
      url: 'https://twitter.com/example',
      icon: 'twitter',
      sort_num: 3,
      is_displayed: false,
    },
  ])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [basicForm] = Form.useForm()

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    if (info.file.originFileObj) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(info.file.originFileObj)
    }
  }

  const handleSaveBasicInfo = async () => {
    try {
      const values = await basicForm.validateFields()
      message.success('基本信息保存成功')
      console.log('保存的数据:', values)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const addSocialLink = () => {
    if (socialLinks.length >= 10) {
      message.warning('社交链接最多只能添加10条')
      return
    }
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: '',
      sort_num: socialLinks.length + 1,
      is_displayed: true,
    }
    setSocialLinks([...socialLinks, newLink])
    setEditingId(newLink.id)
  }

  const deleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const updateSocialLink = (id: string, field: keyof SocialLink, value: any) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    )
  }

  const addTag = () => {
    if (!tagInput.trim()) return
    if (tags.length >= 15) {
      message.warning('标签最多只能添加15个')
      return
    }
    if (tagInput.length > 20) {
      message.warning('每个标签最长20个字符')
      return
    }
    if (tags.includes(tagInput.trim())) {
      message.warning('该标签已存在')
      return
    }
    setTags([...tags, tagInput.trim()])
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const socialColumns = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 150,
      render: (text: string, record: SocialLink) =>
        editingId === record.id ? (
          <Select
            value={text}
            onChange={(value) => updateSocialLink(record.id, 'platform', value)}
            style={{ width: '100%' }}
          >
            <Option value="GitHub">GitHub</Option>
            <Option value="LinkedIn">LinkedIn</Option>
            <Option value="微博">微博</Option>
            <Option value="Twitter">Twitter</Option>
            <Option value="知乎">知乎</Option>
            <Option value="其他">其他</Option>
          </Select>
        ) : (
          text || '-'
        ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (text: string, record: SocialLink) =>
        editingId === record.id ? (
          <Input
            value={text}
            onChange={(e) => updateSocialLink(record.id, 'url', e.target.value)}
            placeholder="请输入URL"
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (text: string, record: SocialLink) =>
        editingId === record.id ? (
          <Input
            value={text}
            onChange={(e) => updateSocialLink(record.id, 'icon', e.target.value)}
            placeholder="图标名称"
          />
        ) : (
          text || '-'
        ),
    },
    {
      title: '排序',
      dataIndex: 'sort_num',
      key: 'sort_num',
      width: 80,
      render: (text: number, record: SocialLink) =>
        editingId === record.id ? (
          <InputNumber
            value={text}
            onChange={(value) => updateSocialLink(record.id, 'sort_num', value)}
            min={1}
            style={{ width: '100%' }}
          />
        ) : (
          text
        ),
    },
    {
      title: '显示',
      dataIndex: 'is_displayed',
      key: 'is_displayed',
      width: 70,
      render: (checked: boolean, record: SocialLink) => (
        <Switch
          checked={checked}
          onChange={(value) => updateSocialLink(record.id, 'is_displayed', value)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: SocialLink) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingId(editingId === record.id ? null : record.id)}
          >
            {editingId === record.id ? '完成' : '编辑'}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteSocialLink(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>个人主页信息管理</Title>

      <Card style={{ marginBottom: 24 }}>
        <Title level={5}>头像设置</Title>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar src={previewImage || avatarUrl} size={120} />
            <div style={{ marginTop: 8, color: '#666' }}>当前头像</div>
          </div>
          <div style={{ flex: 1 }}>
            <Upload.Dragger
              name="file"
              multiple={false}
              accept="image/*"
              showUploadList={false}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              style={{ padding: '20px' }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持 JPG、PNG、GIF 格式，建议尺寸 200x200px</p>
            </Upload.Dragger>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={5}>基本信息</Title>
        <Form form={basicForm} layout="vertical">
          <Form.Item
            name="nickname"
            label="站点昵称"
            rules={[{ required: true, message: '请输入站点昵称' }, { max: 20, message: '昵称不能超过20个字符' }]}
          >
            <Input placeholder="站点昵称" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="signature"
            label="个人签名"
            rules={[{ required: true, message: '请输入个人签名' }, { max: 100, message: '签名不能超过100个字符' }]}
          >
            <TextArea placeholder="个人签名" rows={3} maxLength={100} showCount />
          </Form.Item>

          <Form.Item
            name="introduction"
            label="简介"
            rules={[{ max: 5000, message: '简介不能超过5000个字符' }]}
          >
            <TextArea placeholder="富文本简介（暂用文本区域代替）" rows={6} maxLength={5000} showCount />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSaveBasicInfo}>
              保存基本信息
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>社交链接</Title>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addSocialLink}>
            添加链接
          </Button>
        </div>
        <Table
          columns={socialColumns}
          dataSource={socialLinks}
          pagination={false}
          size="middle"
          locale={{
            emptyText: '暂无社交链接，点击上方按钮添加',
          }}
        />
      </Card>

      <Card>
        <Title level={5}>个人标签</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => removeTag(tag)}
              color="orange"
              style={{ fontSize: 14, padding: '4px 12px' }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="输入标签后按 Enter 或逗号添加"
            style={{ flex: 1, maxWidth: 300 }}
            maxLength={20}
          />
          <Button type="primary" onClick={addTag}>
            添加标签
          </Button>
        </div>
        <div style={{ marginTop: 8, color: '#999', fontSize: 13 }}>
          已添加 {tags.length}/15 个标签，每个标签最长20个字符
        </div>
      </Card>
    </div>
  )
}
