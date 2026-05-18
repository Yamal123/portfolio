'use client'

import React from 'react'
import { Card, Form, Input, Button, Checkbox, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/admin/AuthContext'

const { Title, Text } = Typography

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [form] = Form.useForm()

  const onFinish = async (values: { username: string; password: string; rememberMe: boolean }) => {
    try {
      await login({
        username: values.username,
        password: values.password,
      })
      if (values.rememberMe) {
        localStorage.setItem('remembered_username', values.username)
      } else {
        localStorage.removeItem('remembered_username')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  React.useEffect(() => {
    const rememberedUsername = localStorage.getItem('remembered_username')
    if (rememberedUsername) {
      form.setFieldsValue({ username: rememberedUsername, rememberMe: true })
    }
  }, [form])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f2f3f5',
      position: 'relative',
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(51,112,255,0.06) 0%, transparent 70%)',
        top: -200,
        right: -100,
      }} />
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(51,112,255,0.04) 0%, transparent 70%)',
        bottom: -150,
        left: -100,
      }} />

      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          borderRadius: 8,
          border: '1px solid #e5e6eb',
          background: '#fff',
        }}
      >
        {/* Logo 区域 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48,
            height: 48,
            margin: '0 auto 16px',
            borderRadius: 10,
            background: '#3370ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: -0.5,
          }}>
            PM
          </div>
          <Title level={3} style={{ marginBottom: 6, color: '#1d2129', fontWeight: 600, fontSize: 20 }}>
            AI PM 后台管理系统
          </Title>
          <Text type="secondary" style={{ color: '#86909c', fontSize: 13 }}>
            个人主页内容管理系统
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="middle"
          initialValues={{ rememberMe: false }}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#c9cdd4' }} />}
              placeholder="请输入用户名"
              style={{ height: 40, borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, max: 32, message: '密码长度为8-32个字符' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/,
                message: '密码必须包含大小写字母和数字',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#c9cdd4' }} />}
              placeholder="请输入密码"
              style={{ height: 40, borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox style={{ color: '#4e5969', fontSize: 13 }}>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 40,
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 6,
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Text style={{ color: '#c9cdd4', fontSize: 12 }}>
            © 2026 AI PM Portfolio · Powered by Next.js
          </Text>
        </div>
      </Card>
    </div>
  )
}