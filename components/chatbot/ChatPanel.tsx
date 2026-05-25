'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Loader2, Zap, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble } from './MessageBubble'
import { callAgentChat } from '@/lib/agent/client'
import type { ChatMessage } from '@/types/chatbot'
import type { AgentHistoryMessage } from '@/lib/agent/types'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

const QUICK_QUESTIONS_ZH = [
  '有哪些 AI 相关的项目？',
  '介绍一下你的技能',
  '怎么联系作者？',
  '最近写了什么文章？',
]

const WELCOME_ZH = '您好！我是网站 Agent 助手。\n\n我可以帮您：\n- 搜索项目作品\n- 查询技能专长\n- 检索方法论文章\n- 获取联系方式\n\n请问有什么可以帮到您？'

const STORAGE_KEY = 'chat_history'

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveHistory(msgs: ChatMessage[]) {
  try {
    const trimmed = msgs.slice(-20) // keep last 20
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {}
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history on open
  useEffect(() => {
    if (isOpen) {
      const history = loadHistory()
      if (history.length > 0) {
        setMessages(history)
      } else {
        setMessages([{
          id: 'welcome',
          type: 'bot',
          content: WELCOME_ZH,
          timestamp: new Date(),
        }])
      }
      setTimeout(() => inputRef.current?.focus(), 200)
    } else {
      setMessages([])
    }
  }, [isOpen])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save history on change
  useEffect(() => {
    if (messages.length > 1) saveHistory(messages)
  }, [messages])

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text || inputValue).trim()
    if (!msg || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: msg,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const history: AgentHistoryMessage[] = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.type === 'user' ? 'user' as const : 'assistant' as const, content: m.content }))

      const response = await callAgentChat({ message: msg, history, locale: 'zh' })

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
        agentMode: response.mode,
      }
      setMessages(prev => [...prev, botMessage])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
        timestamp: new Date(),
      }])
    }
    setIsLoading(false)
  }, [inputValue, isLoading, messages])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col" style={{ height: '520px' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">AI 助手</p>
              <p className="text-white/60 text-xs">在线</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {isLoading && (
            <div className="flex gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-3 py-2 flex flex-wrap gap-1.5 flex-shrink-0 border-t border-gray-100">
            {QUICK_QUESTIONS_ZH.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="输入您的问题..."
              className="flex-1 h-9 rounded-xl text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={isLoading || !inputValue.trim()}
              className="h-9 w-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">按 Enter 发送</p>
        </div>
      </div>
    </div>
  )
}
