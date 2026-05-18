'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Switch,
  Upload,
  Button,
  Tag,
  Typography,
  message,
  Space,
  Spin,
  Image,
} from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  WechatOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { get, put } from '@/lib/admin/api'

const { Title } = Typography
const { TextArea } = Input

interface ContactData {
  id?: number
  email: string
  email_displayed: boolean
  phone: string
  phone_displayed: boolean
  wechat_id: string
  wechat_displayed: boolean
  wechat_qrcode?: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  created_at?: string
  updated_at?: string
}

interface FormData {
  email: string
  emailDisplayed: boolean
  phone: string
  phoneDisplayed: boolean
  wechatId: string
  qrcodeImage?: string
  wechatDisplayed: boolean
}

function toFrontend(data: any): ContactData {
  return {
    id: data.id,
    email: data.email || '',
    email_displayed: data.email_displayed ?? true,
    phone: data.phone || '',
    phone_displayed: data.phone_displayed ?? false,
    wechat_id: data.wechat_id || '',
    wechat_displayed: data.wechat_displayed ?? true,
    wechat_qrcode: data.wechat_qrcode || '',
    github_url: data.github_url || '',
    linkedin_url: data.linkedin_url || '',
    twitter_url: data.twitter_url || '',
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

function toFormData(contact: ContactData): FormData {
  return {
    email: contact.email,
    emailDisplayed: contact.email_displayed,
    phone: contact.phone,
    phoneDisplayed: contact.phone_displayed,
    wechatId: contact.wechat_id,
    qrcodeImage: contact.wechat_qrcode,
    wechatDisplayed: contact.wechat_displayed,
  }
}

function toBackendData(formData: Partial<FormData>): Record<string, any> {
  const map: Record<string, string> = {
    emailDisplayed: 'email_displayed',
    phoneDisplayed: 'phone_displayed',
    wechatId: 'wechat_id',
    wechatDisplayed: 'wechat_displayed',
    qrcodeImage: 'wechat_qrcode',
    githubUrl: 'github_url',
    linkedinUrl: 'linkedin_url',
    twitterUrl: 'twitter_url',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }

  const result: Record<string, any> = {}
  Object.entries(formData).forEach(([key, value]) => {
    const backendKey = map[key] || key
    if (value !== undefined) {
      result[backendKey] = value
    }
  })
  return result
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData>({
    email: '',
    email_displayed: true,
    phone: '',
    phone_displayed: false,
    wechat_id: '',
    wechat_displayed: true,
    wechat_qrcode: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  })
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    loadContact()
  }, [])

  const loadContact = async () => {
    try {
      setPageLoading(true)
      const res = await get('/contact')
      const data = toFrontend(res.data)
      setContact(data)

      const formData = toFormData(data)
      form.setFieldsValue(formData)

      message.success('联系方式数据加载成功')
    } catch (error) {
      console.error('加载失败:', error)
      message.error('加载联系方式数据失败')
    } finally {
      setPageLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload = toBackendData(values as Partial<FormData>)
      await put('/contact', payload)

      message.success('联系方式保存成功')
    } catch (error: any) {
      if (error?.errorFields) {
        console.error('Validation failed:', error)
        return
      }
      console.error('保存失败:', error)
      message.error(error.response?.data?.message || '保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleValuesChange = (changedValues: any) => {
    const map: Record<string, string> = {
      emailDisplayed: 'email_displayed',
      phoneDisplayed: 'phone_displayed',
      wechatId: 'wechat_id',
      wechatDisplayed: 'wechat_displayed',
      qrcodeImage: 'wechat_qrcode',
    }

    const updates: Record<string, any> = {}
    Object.entries(changedValues).forEach(([key, value]) => {
      const fieldKey = map[key] || key
      updates[fieldKey] = value
    })

    setContact(prev => ({ ...prev, ...updates }))
  }

  if (pageLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>联系方式管理</Title>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 24,
        }}>
          {/* 邮箱卡片 */}
          <Card
            style={{
              opacity: contact.email_displayed ? 1 : 0.6,
              border: contact.email_displayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.email_displayed && (
                <Tag color="default">已隐藏</Tag>
              )
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <MailOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={5} style={{ margin: 0 }}>邮箱地址</Title>
            </div>

            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱格式' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱地址"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="emailDisplayed"
              label="显示状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Form.Item>
          </Card>

          {/* 电话卡片 */}
          <Card
            style={{
              opacity: contact.phone_displayed ? 1 : 0.6,
              border: contact.phone_displayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.phone_displayed && (
                <Tag color="default">已隐藏</Tag>
              )
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <PhoneOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <Title level={5} style={{ margin: 0 }}>电话号码</Title>
            </div>

            <Form.Item
              name="phone"
              label="手机号码"
              rules={[
                { required: true, message: '请输入手机号码' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入有效的11位手机号',
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="请输入11位手机号码"
                maxLength={11}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phoneDisplayed"
              label="显示状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Form.Item>
          </Card>

          {/* 微信卡片 */}
          <Card
            style={{
              opacity: contact.wechat_displayed ? 1 : 0.6,
              border: contact.wechat_displayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.wechat_displayed && (
                <Tag color="default">已隐藏</Tag>
              )
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <WechatOutlined style={{ fontSize: 24, color: '#07c160' }} />
              <Title level={5} style={{ margin: 0 }}>微信信息</Title>
            </div>

            <Form.Item
              name="wechatId"
              label="微信号"
              rules={[
                { required: true, message: '请输入微信号' },
                { min: 2, message: '微信号至少2个字符' },
                { max: 30, message: '微信号最多30个字符' },
              ]}
            >
              <Input
                prefix={<WechatOutlined />}
                placeholder="请输入微信号（2-30字符）"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="qrcodeImage"
              label="二维码图片"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                accept="image/*"
                beforeUpload={() => false}
              >
                {contact.wechat_qrcode ? (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>更换二维码</div>
                  </div>
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传二维码</div>
                  </div>
                )}
              </Upload>
              {contact.wechat_qrcode && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    当前二维码预览：
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <Image
                      src={contact.wechat_qrcode}
                      alt="微信二维码"
                      width={120}
                      height={120}
                      style={{ objectFit: 'cover' }}
                      fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij7nlLXohJHkuJrlvoU8L3RleHQ+PC9zdmc+"
                    />
                  </div>
                </div>
              )}
              <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                建议尺寸 200x200，支持 JPG/PNG 格式
              </div>
            </Form.Item>

            <Form.Item
              name="wechatDisplayed"
              label="显示状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Form.Item>
          </Card>

          {/* 社交链接卡片 */}
          <Card>
            <Title level={5}>社交链接</Title>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form.Item label="GitHub">
                <Input
                  placeholder="https://github.com/yourusername"
                  prefix={<span style={{ color: '#333' }}>🔗</span>}
                  defaultValue={contact.github_url}
                  onChange={(e) => setContact(prev => ({ ...prev, github_url: e.target.value }))}
                />
              </Form.Item>

              <Form.Item label="LinkedIn">
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  prefix={<span style={{ color: '#0077b5' }}>💼</span>}
                  defaultValue={contact.linkedin_url}
                  onChange={(e) => setContact(prev => ({ ...prev, linkedin_url: e.target.value }))}
                />
              </Form.Item>

              <Form.Item label="Twitter">
                <Input
                  placeholder="https://twitter.com/yourhandle"
                  prefix={<span style={{ color: '#1da1f2' }}>🐦</span>}
                  defaultValue={contact.twitter_url}
                  onChange={(e) => setContact(prev => ({ ...prev, twitter_url: e.target.value }))}
                />
              </Form.Item>
            </Space>
          </Card>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
            size="large"
            style={{ minWidth: 200 }}
          >
            保存所有设置
          </Button>
        </div>
      </Form>
    </div>
  )
}

const { Text } = Typography
