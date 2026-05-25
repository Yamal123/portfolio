'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Loader2, Zap, Plus, History, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble } from './MessageBubble'
import { callAgentChat } from '@/lib/agent/client'
import type { ChatMessage } from '@/types/chatbot'
import type { AgentHistoryMessage } from '@/lib/agent/types'

const QUICK_QUESTIONS_ZH = ['有哪些 AI 相关的项目？', '介绍一下你的技能', '怎么联系作者？', '最近写了什么文章？']
const WELCOME_ZH = '您好！我是网站 Agent 助手。\n\n我可以帮您：\n- 搜索项目作品\n- 查询技能专长\n- 检索方法论文章\n- 获取联系方式\n\n请问有什么可以帮到您？'
const STORAGE_PREFIX = 'agent_session_'

// Session storage helpers
function getAllSessions(): string[] {
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) keys.push(key.replace(STORAGE_PREFIX, ''))
    }
    return keys.sort((a, b) => Number(b) - Number(a))
  } catch { return [] }
}

function loadSession(id: string): ChatMessage[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id)
    if (raw) {
      const msgs = JSON.parse(raw)
      return msgs.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
    }
  } catch {}
  return null
}

function saveSession(id: string, msgs: ChatMessage[]) {
  try {
    const serializable = msgs.slice(-30).map(m => ({ ...m, timestamp: m.timestamp.toISOString() }))
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(serializable))
  } catch {}
}

function deleteSession(id: string) {
  try { localStorage.removeItem(STORAGE_PREFIX + id) } catch {}
}

let msgCounter = 0
function nextMsgId() { return `${Date.now()}_${++msgCounter}` }

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [sessions, setSessions] = useState<string[]>([])
  const messagesRef = useRef<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync ref
  useEffect(() => { messagesRef.current = messages }, [messages])

  // Start fresh session
  const startNewSession = useCallback(() => {
    const id = String(Date.now())
    setSessionId(id)
    setMessages([{
      id: nextMsgId(),
      type: 'bot',
      content: WELCOME_ZH,
      timestamp: new Date(),
    }])
    setShowHistory(false)
  }, [])

  // On open
  useEffect(() => {
    if (isOpen) {
      const allSessions = getAllSessions()
      setSessions(allSessions)
      if (allSessions.length > 0) {
        const last = loadSession(allSessions[0])
        if (last && last.length > 0) {
          setSessionId(allSessions[0])
          setMessages(last)
        } else {
          startNewSession()
        }
      } else {
        startNewSession()
      }
      setTimeout(() => inputRef.current?.focus(), 200)
    } else {
      setMessages([])
      setShowHistory(false)
    }
  }, [isOpen, startNewSession])

  // Save on change
  useEffect(() => {
    if (sessionId && messages.length > 1) saveSession(sessionId, messages)
  }, [messages, sessionId])

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text || inputValue).trim()
    if (!msg || isLoading) return

    const userMessage: ChatMessage = {
      id: nextMsgId(),
      type: 'user',
      content: msg,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const history: AgentHistoryMessage[] = messagesRef.current
        .filter(m => !m.content.includes(WELCOME_ZH.slice(0, 20)))
        .map(m => ({ role: m.type === 'user' ? 'user' as const : 'assistant' as const, content: m.content }))

      const response = await callAgentChat({ message: msg, history, locale: 'zh' })

      setMessages(prev => [...prev, {
        id: nextMsgId(),
        type: 'bot',
        content: response.content || '收到您的消息了。',
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
        agentMode: response.mode,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: nextMsgId(),
        type: 'bot',
        content: '抱歉，暂时无法回答，请稍后再试。',
        timestamp: new Date(),
      }])
    }
    setIsLoading(false)
  }, [inputValue, isLoading])

  const loadConversation = (id: string) => {
    const msgs = loadSession(id)
    if (msgs) {
      setSessionId(id)
      setMessages(msgs)
      setShowHistory(false)
    }
  }

  const removeConversation = (id: string) => {
    deleteSession(id)
    setSessions(prev => prev.filter(s => s !== id))
    if (id === sessionId) startNewSession()
  }

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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(!showHistory)} className="h-8 w-8 text-white hover:bg-white/20 rounded-full" title="对话历史">
              <History className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={startNewSession} className="h-8 w-8 text-white hover:bg-white/20 rounded-full" title="新建对话">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700 mb-3">对话历史</p>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">暂无历史对话</p>
            ) : (
              <div className="space-y-2">
                {sessions.map(id => {
                  const msgs = loadSession(id)
                  const preview = msgs?.find(m => m.type === 'user')?.content?.slice(0, 40) || '(空对话)'
                  return (
                    <div key={id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer group" onClick={() => loadConversation(id)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{preview}</p>
                        <p className="text-[10px] text-gray-400">{msgs?.length || 0} 条消息</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeConversation(id) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <button onClick={() => setShowHistory(false)} className="w-full mt-3 text-sm text-orange-500 hover:text-orange-600 py-2">返回对话</button>
          </div>
        ) : (
          <>
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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
                  <button key={i} onClick={() => handleSend(q)} className="px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-colors">{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <Input ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="输入您的问题..." className="flex-1 h-9 rounded-xl text-sm" disabled={isLoading} />
                <Button onClick={() => handleSend()} disabled={isLoading || !inputValue.trim()}
                  className="h-9 w-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
