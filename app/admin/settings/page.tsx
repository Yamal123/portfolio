'use client'

import React, { useState, useEffect } from 'react'
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
  Spin,
  Alert,
  Divider,
} from 'antd'
import {
  LockOutlined,
  SettingOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { get, put } from '@/lib/admin/api'

const { Title, Text } = Typography
const { TextArea } = Input

interface SiteSettings {
  site_title?: string
  site_description?: string
  copyright?: string
  favicon?: string
  icp_number?: string
  ga_id?: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('site')
  const [passwordForm] = Form.useForm()
  const [siteForm] = Form.useForm()
  const [loading, setLoading] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [restoreModalVisible, setRestoreModalVisible] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<SiteSettings>({})

  useEffect(() => {
    loadSiteSettings()
  }, [])

  const loadSiteSettings = async () => {
    try {
      setPageLoading(true)
      const res = await get('/settings/site')
      const data = res.data as SiteSettings
      setCurrentSettings(data)
      siteForm.setFieldsValue({
        siteTitle: data.site_title || '',
        siteDescription: data.site_description || '',
        copyright: data.copyright || '',
        favicon: data.favicon || '',
        icpNumber: data.icp_number || '',
        gaId: data.ga_id || '',
      })
      message.success('站点设置加载成功')
    } catch (error) {
      console.error('加载失败:', error)
      message.error('加载站点设置失败')
    } finally {
      setPageLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields()

      message.warning('密码修改功能暂未开放，请联系管理员')
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleSiteSettingsSave = async () => {
    try {
      await siteForm.validateFields()
      setLoading('site')

      const values = siteForm.getFieldsValue()
      const payload: SiteSettings = {
        site_title: values.siteTitle,
        site_description: values.siteDescription,
        copyright: values.copyright,
        favicon: values.favicon,
        icp_number: values.icpNumber,
        ga_id: values.gaId,
      }

      await put('/settings/site', payload)

      setCurrentSettings(payload)
      message.success('站点设置保存成功')
    } catch (error: any) {
      if (error?.errorFields) {
        console.error('Validation failed:', error)
        return
      }
      console.error('保存失败:', error)
      message.error(error.response?.data?.message || '保存失败，请重试')
    } finally {
      setLoading(null)
    }
  }

  const handleBackup = () => {
    setLoading('backup')
    message.loading('正在生成备份文件...')

    setTimeout(() => {
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        type: 'site_settings_export',
        data: currentSettings,
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `site_settings_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setLoading(null)
      message.success('配置导出成功')
    }, 500)
  }

  const handleRestore = () => {
    message.warning('数据恢复功能暂未开放，请使用导入配置功能')
    setRestoreModalVisible(false)
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
      <Title level={4} style={{ marginBottom: 24 }}>系统设置</Title>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={
              <span>
                <SettingOutlined />
                站点设置
              </span>
            }
            key="site"
          >
            <div style={{ maxWidth: 700 }}>
              <Alert
                message="基本信息"
                description="配置网站的基本信息，包括标题、描述等核心内容"
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: 24 }}
              />

              <Form
                form={siteForm}
                layout="vertical"
                onFinish={handleSiteSettingsSave}
              >
                <Card title="基本配置" size="small" style={{ marginBottom: 16 }}>
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
                      placeholder="请输入站点描述（用于SEO）"
                      maxLength={200}
                      showCount
                    />
                  </Form.Item>

                  <Form.Item
                    name="copyright"
                    label="版权信息"
                  >
                    <Input placeholder="© 2026 Your Name" maxLength={100} />
                  </Form.Item>
                </Card>

                <Divider>SEO 与高级选项</Divider>

                <Card title="SEO 配置" size="small" style={{ marginBottom: 16 }}>
                  <Form.Item
                    name="favicon"
                    label="网站图标 (Favicon)"
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
                    name="icpNumber"
                    label="ICP备案号"
                  >
                    <Input placeholder="请输入ICP备案号" maxLength={20} />
                  </Form.Item>

                  <Form.Item
                    name="gaId"
                    label="Google Analytics ID"
                  >
                    <Input placeholder="如: G-XXXXXXXXXX" maxLength={50} />
                  </Form.Item>
                </Card>

                <Form.Item style={{ marginTop: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading === 'site'}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    保存站点设置
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <LockOutlined />
                修改密码
              </span>
            }
            key="password"
          >
            <div style={{ maxWidth: 500 }}>
              <Alert
                message="功能暂未开放"
                description="密码修改功能正在开发中，暂时无法使用。如需修改密码，请联系系统管理员。"
                type="warning"
                showIcon
                icon={<LockOutlined />}
                style={{ marginBottom: 24 }}
              />

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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                  >
                    修改密码（暂未开放）
                  </Button>
                </Form.Item>

                <div style={{ color: '#999', fontSize: 12, marginTop: 12 }}>
                  <p>⚠️ 此功能当前处于开发阶段</p>
                  <p>修改密码后将自动退出登录</p>
                  <p>请确保您记得新密码</p>
                </div>
              </Form>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <CloudDownloadOutlined />
                数据管理
              </span>
            }
            key="backup"
          >
            <div style={{ maxWidth: 600 }}>
              <Card title="导出配置" style={{ marginBottom: 24 }} size="small">
                <p style={{ color: '#666', marginBottom: 16 }}>
                  将当前站点设置导出为 JSON 文件，可用于备份或迁移配置。
                </p>
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  onClick={handleBackup}
                  loading={loading === 'backup'}
                  size="large"
                >
                  导出配置文件
                </Button>
              </Card>

              <Card title="导入配置" size="small">
                <Alert
                  message="功能说明"
                  description="当前版本支持查看导出的配置文件格式。完整的导入功能将在后续版本中提供。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <p style={{ color: '#666', marginBottom: 16 }}>
                  从之前导出的 JSON 配置文件中恢复设置。
                </p>
                <Upload
                  accept=".json"
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isJSON = file.name.endsWith('.json')
                    const isLt5MB = file.size / 1024 / 1024 < 5

                    if (!isJSON) {
                      message.error('只能上传 .json 文件!')
                      return false
                    }

                    if (!isLt5MB) {
                      message.error('文件大小不能超过5MB!')
                      return false
                    }

                    const reader = new FileReader()
                    reader.onload = (e) => {
                      try {
                        const content = e.target?.result as string
                        const data = JSON.parse(content)
                        Modal.info({
                          title: '配置文件预览',
                          content: (
                            <pre style={{ maxHeight: 400, overflow: 'auto', fontSize: 12 }}>
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          ),
                          width: 600,
                        })
                      } catch (err) {
                        message.error('无效的 JSON 文件格式')
                      }
                    }
                    reader.readAsText(file)

                    return false
                  }}
                >
                  <Button icon={<CloudUploadOutlined />}>
                    选择并预览文件
                  </Button>
                </Upload>
                <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                  仅支持 .json 文件，最大5MB
                </div>
              </Card>
            </div>
          </Tabs.TabPane>
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
          <li>当前所有配置将被完全替换</li>
          <li>建议在恢复前先导出当前配置作为备份</li>
          <li>恢复过程可能需要几秒钟时间</li>
        </ul>
        <p style={{ marginTop: 16, fontWeight: 500 }}>
          您确定要继续执行配置恢复操作吗？
        </p>
      </Modal>
    </div>
  )
}
