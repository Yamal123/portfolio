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
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰圆 */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
        top: -100,
        right: -100,
      }} />
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(114,137,218,0.12) 0%, transparent 70%)',
        bottom: -80,
        left: -80,
      }} />

      <Card
        style={{
          width: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 23, 42, 0.85)',
        }}
      >
        {/* Logo 区域 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: -1,
            boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
          }}>
            PM
          </div>
          <Title level={3} style={{ marginBottom: 6, color: '#fff', fontWeight: 600 }}>
            AI PM 后台管理
          </Title>
          <Text type="secondary" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            个人主页内容管理系统
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
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
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
              placeholder="请输入用户名"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#f1f5f9',
                height: 44,
              }}
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
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="请输入密码"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#f1f5f9',
                height: 44,
              }}
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox style={{ color: 'rgba(255,255,255,0.6)' }}>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 500,
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
            © 2026 AI PM Portfolio · Powered by Next.js
          </Text>
        </div>
      </Card>
    </div>
  )
}
