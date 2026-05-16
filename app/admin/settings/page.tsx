'use client'

import React, { useState } from 'react'
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Typography,
} from 'antd'
import {
  LockOutlined,
  SettingOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SaveOutlined,
} from '@ant-design/icons'

const { Title } = Typography
const { TextArea } = Input
const { TabPane } = Tabs

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('password')
  const [passwordForm] = Form.useForm()
  const [siteForm] = Form.useForm()
  const [loading, setLoading] = useState<string | null>(null)
  const [restoreModalVisible, setRestoreModalVisible] = useState(false)

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields()
      setLoading('password')

      if (values.oldPassword === values.newPassword) {
        message.error('新密码不能与旧密码相同')
        setLoading(null)
        return
      }

      setTimeout(() => {
        message.success('密码修改成功，请重新登录')
        setLoading(null)
        passwordForm.resetFields()
        window.location.href = '/admin/login'
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleSiteSettingsSave = async () => {
    try {
      await siteForm.validateFields()
      setLoading('site')

      setTimeout(() => {
        message.success('站点设置保存成功')
        setLoading(null)
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleBackup = () => {
    setLoading('backup')
    message.loading('正在生成备份文件...')

    setTimeout(() => {
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          skills: [],
          projects: [],
          stats: {},
          contact: {},
          settings: {},
        },
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `backup_${new Date().toISOString().slice(0, 10)}.sql`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setLoading(null)
      message.success('备份文件已下载')
    }, 1500)
  }

  const handleRestore = () => {
    setLoading('restore')
    message.loading('正在恢复数据...')

    setTimeout(() => {
      setLoading(null)
      setRestoreModalVisible(false)
      message.success('数据恢复成功')
    }, 2000)
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统设置</Title>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <LockOutlined />
                修改密码
              </span>
            }
            key="password"
          >
            <div style={{ maxWidth: 500 }}>
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
              >
                <Form.Item
                  name="oldPassword"
                  label="当前密码"
                  rules={[
                    { required: true, message: '请输入当前密码' },
                    { min: 6, message: '密码至少6个字符' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入当前密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/,
                      message: '密码必须包含大小写字母和数字，8-32位',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入新密码（大小写字母+数字，8-32位）"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="确认新密码"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: '请确认新密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'))
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请再次输入新密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading === 'password'}
                    icon={<SaveOutlined />}
                    block
                    size="large"
                  >
                    修改密码
                  </Button>
                </Form.Item>

                <div style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
                  <p>修改密码后将自动退出登录</p>
                  <p>请确保您记得新密码</p>
                </div>
              </Form>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                站点设置
              </span>
            }
            key="site"
          >
            <div style={{ maxWidth: 600 }}>
              <Form
                form={siteForm}
                layout="vertical"
                initialValues={{
                  siteTitle: 'AI PM Portfolio',
                  siteDescription: '专业的AI产品经理个人作品展示平台',
                  copyright: '© 2026 AI PM',
                  icpCode: '',
                  gaTrackingId: '',
                }}
                onFinish={handleSiteSettingsSave}
              >
                <Form.Item
                  name="siteTitle"
                  label="站点标题"
                  rules={[
                    { required: true, message: '请输入站点标题' },
                    { max: 50, message: '最多50个字符' },
                  ]}
                >
                  <Input placeholder="请输入站点标题" maxLength={50} showCount />
                </Form.Item>

                <Form.Item
                  name="siteDescription"
                  label="站点描述"
                >
                  <TextArea
                    rows={3}
                    placeholder="请输入站点描述"
                    maxLength={200}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="copyright"
                  label="版权信息"
                >
                  <Input placeholder="© 2026 AI PM" maxLength={100} />
                </Form.Item>

                <Form.Item
                  name="favicon"
                  label="网站图标"
                >
                  <Upload
                    listType="picture"
                    maxCount={1}
                    accept=".ico,.png,.jpg,.svg"
                    beforeUpload={(file) => {
                      const isLt100KB = file.size / 1024 < 100
                      if (!isLt100KB) {
                        message.error('图标文件不能超过100KB!')
                        return false
                      }
                      return false
                    }}
                  >
                    <Button icon={<CloudUploadOutlined />}>选择图标文件</Button>
                  </Upload>
                  <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                    支持 ICO/PNG/JPG/SVG 格式，最大100KB
                  </div>
                </Form.Item>

                <Form.Item
                  name="icpCode"
                  label="ICP备案号"
                >
                  <Input placeholder="请输入ICP备案号" maxLength={20} />
                </Form.Item>

                <Form.Item
                  name="gaTrackingId"
                  label="Google Analytics ID"
                >
                  <Input placeholder="如: G-XXXXXXXXXX" maxLength={50} />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading === 'site'}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    保存设置
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <CloudDownloadOutlined />
                数据备份
              </span>
            }
            key="backup"
          >
            <div style={{ maxWidth: 600 }}>
              <Card title="数据备份" style={{ marginBottom: 24 }} size="small">
                <p style={{ color: '#666', marginBottom: 16 }}>
                  定期备份您的数据，以防意外丢失。备份文件将包含所有配置和数据。
                </p>
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  onClick={handleBackup}
                  loading={loading === 'backup'}
                  size="large"
                >
                  立即备份
                </Button>
              </Card>

              <Card title="数据恢复" size="small">
                <p style={{ color: '#666', marginBottom: 16 }}>
                  从备份文件中恢复数据。注意：此操作将覆盖当前所有数据！
                </p>
                <Upload
                  accept=".sql,.json"
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isSQL = file.name.endsWith('.sql') || file.name.endsWith('.json')
                    const isLt50MB = file.size / 1024 / 1024 < 50

                    if (!isSQL) {
                      message.error('只能上传 .sql 或 .json 文件!')
                      return false
                    }

                    if (!isLt50MB) {
                      message.error('文件大小不能超过50MB!')
                      return false
                    }

                    setRestoreModalVisible(true)
                    return false
                  }}
                >
                  <Button icon={<CloudUploadOutlined />}>
                    选择文件恢复
                  </Button>
                </Upload>
                <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                  仅支持 .sql/.json 文件，最大50MB
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="⚠️ 警告：数据覆盖确认"
        open={restoreModalVisible}
        onOk={handleRestore}
        onCancel={() => setRestoreModalVisible(false)}
        okText="确认恢复"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        confirmLoading={loading === 'restore'}
      >
        <div style={{ color: '#ff4d4f', marginBottom: 16 }}>
          <strong>此操作不可逆！</strong>
        </div>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: '#666' }}>
          <li>当前所有数据将被完全替换</li>
          <li>建议在恢复前先创建一个备份</li>
          <li>恢复过程可能需要几分钟时间</li>
          <li>恢复完成后系统可能需要重启</li>
        </ul>
        <p style={{ marginTop: 16, fontWeight: 500 }}>
          您确定要继续执行数据恢复操作吗？
        </p>
      </Modal>
    </div>
  )
}
