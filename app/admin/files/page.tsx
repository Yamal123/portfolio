'use client'

import { useState, useRef } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, Trash2, File, Image, FileText, FolderOpen, AlertCircle } from 'lucide-react'

interface FileItem {
  name: string
  path: string
  size: string
  type: 'image' | 'document' | 'other'
}

function FilesContent() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      Array.from(selectedFiles).forEach(file => {
        formData.append('files', file)
      })

      const token = localStorage.getItem('admin_token') || ''
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: formData,
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '文件上传成功' })
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setMessage({ type: 'error', text: '上传失败，请重试' })
      }
    } catch {
      setMessage({ type: 'error', text: '上传失败，请重试' })
    }

    setUploading(false)
  }

  // Placeholder files to show available assets
  const publicFiles: FileItem[] = [
    { name: 'profile-avatar.png', path: '/images/profile-avatar.png', size: '约 120KB', type: 'image' },
    { name: 'profile.jpg', path: '/images/profile.jpg', size: '约 200KB', type: 'image' },
    { name: 'background.jpg', path: '/images/background.jpg', size: '约 500KB', type: 'image' },
    { name: 'portfolioimage.png', path: '/images/portfolioimage.png', size: '约 150KB', type: 'image' },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-blue-400" />
      case 'document': return <FileText className="w-5 h-5 text-green-400" />
      default: return <File className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <AdminLayout title="文件管理">
      <div className="space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              上传文件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.json,.csv"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500 mb-1">
                  点击或拖拽文件到这里上传
                </p>
                <p className="text-xs text-slate-400">
                  支持图片、PDF、文本、Markdown 等格式，单文件不超过 10MB
                </p>
              </label>
              {uploading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  上传中...
                </div>
              )}
              {message && (
                <div className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              文件列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">文件名</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">路径</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">大小</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {publicFiles.map((file, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm">
                          {getFileIcon(file.type)}
                          <span className="font-medium text-slate-700">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{file.path}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{file.size}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={file.path}
                            download
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors"
                            title="下载"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">文件管理说明</p>
                <p className="text-amber-600">
                  上传的文件保存在服务器静态目录中。编辑文章时，可直接使用以上文件路径作为图片引用地址。
                  如需删除文件，请确认文件未被任何文章或页面引用。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function FilesPage() {
  return (
    <ProtectedRoute>
      <FilesContent />
    </ProtectedRoute>
  )
}
