'use client'

import React, { useState } from 'react'
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
} from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  WechatOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const { Title } = Typography
const { TextArea } = Input

interface ContactData {
  email: string
  emailDisplayed: boolean
  phone: string
  phoneDisplayed: boolean
  wechatId: string
  qrcodeImage?: string
  wechatDisplayed: boolean
}

const INITIAL_CONTACT: ContactData = {
  email: 'contact@example.com',
  emailDisplayed: true,
  phone: '13800138000',
  phoneDisplayed: false,
  wechatId: 'your_wechat_id',
  qrcodeImage: undefined,
  wechatDisplayed: true,
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactData>(INITIAL_CONTACT)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    form.setFieldsValue(contact)
  }, [contact, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      setTimeout(() => {
        setContact(values)
        setLoading(false)
        message.success('联系方式保存成功')
      }, 500)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleValuesChange = (changedValues: Partial<ContactData>) => {
    setContact(prev => ({ ...prev, ...changedValues }))
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>联系方式管理</Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={INITIAL_CONTACT}
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
              opacity: contact.emailDisplayed ? 1 : 0.6,
              border: contact.emailDisplayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.emailDisplayed && (
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
              opacity: contact.phoneDisplayed ? 1 : 0.6,
              border: contact.phoneDisplayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.phoneDisplayed && (
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
              opacity: contact.wechatDisplayed ? 1 : 0.6,
              border: contact.wechatDisplayed ? undefined : '1px dashed #d9d9d9',
            }}
            extra={
              !contact.wechatDisplayed && (
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
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传二维码</div>
                </div>
              </Upload>
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
