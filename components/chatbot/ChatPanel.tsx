'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Loader2, Zap, Plus, History, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageBubble } from './MessageBubble'
import { getAgentBootstrap, streamAgentChat } from '@/lib/agent/client'
import type { ChatMessage } from '@/types/chatbot'
import type { AgentHistoryMessage } from '@/lib/agent/types'

const STORAGE_PREFIX = 'agent_session_'
const MAX_INPUT_LENGTH = 2000

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
  const [bootstrap, setBootstrap] = useState<{ welcomeMessage: { zh: string; en: string }; quickQuestions: Array<{ zh: string; en: string }> } | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const requestIdRef = useRef(0)

  // Sync ref
  useEffect(() => { messagesRef.current = messages }, [messages])

  useEffect(() => {
    getAgentBootstrap().then(setBootstrap).catch(() => setBootstrap({
      welcomeMessage: { zh: '助手暂时不可用，请稍后再试。', en: 'Assistant is temporarily unavailable.' },
      quickQuestions: [],
    }))
  }, [])

  const welcome = bootstrap?.welcomeMessage.zh || '正在加载助手配置...'

  const startNewSession = useCallback(() => {
    requestIdRef.current += 1
    const id = String(Date.now())
    setSessionId(id)
    setMessages([{
      id: nextMsgId(),
      type: 'bot',
      content: welcome,
      timestamp: new Date(),
    }])
    setShowHistory(false)
  }, [welcome])

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
      requestIdRef.current += 1
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
    if (!msg || isLoading || msg.length > MAX_INPUT_LENGTH) return
    const requestId = ++requestIdRef.current

    const userMessage: ChatMessage = {
      id: nextMsgId(),
      type: 'user',
      content: msg,
      timestamp: new Date(),
    }

    const botMessageId = nextMsgId()

    setMessages(prev => [
      ...prev,
      userMessage,
      {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ])
    setInputValue('')
    setIsLoading(true)

    try {
      const history: AgentHistoryMessage[] = messagesRef.current
        .filter(m => m.id !== messagesRef.current[0]?.id)
        .map(m => ({ role: m.type === 'user' ? 'user' as const : 'assistant' as const, content: m.content }))

      await streamAgentChat(
        { sessionId, message: msg, history, locale: 'zh' },
        {
          onStart: (meta) => {
            if (requestIdRef.current !== requestId) return
            setMessages((prev) => prev.map((message) =>
              message.id === botMessageId
                ? {
                    ...message,
                    isStreaming: true,
                    toolsUsed: meta.toolsUsed,
                    agentMode: meta.mode,
                    sources: meta.sources,
                  }
                : message
            ))
          },
          onDelta: (delta) => {
            if (requestIdRef.current !== requestId) return
            setMessages((prev) => prev.map((message) =>
              message.id === botMessageId
                ? {
                    ...message,
                    isStreaming: false,
                    content: `${message.content}${delta}`,
                  }
                : message
            ))
          },
          onDone: () => {
            if (requestIdRef.current !== requestId) return
            setMessages((prev) => prev.map((message) =>
              message.id === botMessageId
                ? { ...message, isStreaming: false, content: message.content || '收到您的消息了。' }
                : message
            ))
          },
        }
      )
    } catch {
      if (requestIdRef.current === requestId) {
        setMessages(prev => prev.map((message) =>
          message.id === botMessageId
            ? {
                ...message,
                isStreaming: false,
                content: '抱歉，暂时无法回答，请稍后再试。',
              }
            : message
        ))
      }
    }
    if (requestIdRef.current === requestId) {
      setIsLoading(false)
    }
  }, [inputValue, isLoading])

  const loadConversation = (id: string) => {
    requestIdRef.current += 1
    const msgs = loadSession(id)
    if (msgs) {
      setSessionId(id)
      setMessages(msgs)
      setShowHistory(false)
    }
  }

  const removeConversation = (id: string) => {
    requestIdRef.current += 1
    deleteSession(id)
    setSessions(prev => prev.filter(s => s !== id))
    if (id === sessionId) startNewSession()
  }

  if (!isOpen) return null

  const inputLength = inputValue.trim().length
  const overLimit = inputLength > MAX_INPUT_LENGTH

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm">
      <div className="flex h-[min(520px,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
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
            <Button variant="ghost" size="icon" aria-label="对话历史" onClick={() => setShowHistory(!showHistory)} className="h-8 w-8 text-white hover:bg-white/20 rounded-full" title="对话历史">
              <History className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="新建对话" onClick={startNewSession} className="h-8 w-8 text-white hover:bg-white/20 rounded-full" title="新建对话">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="关闭聊天" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
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
                {(bootstrap?.quickQuestions || []).map((item, i) => {
                  const q = item.zh
                  return (
                  <button key={i} onClick={() => handleSend(q)} className="px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-colors">{q}</button>
                  )
                })}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value.slice(0, MAX_INPUT_LENGTH + 50))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="输入您的问题..."
                  className="min-h-[40px] max-h-32 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm leading-6 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                  disabled={isLoading}
                  rows={1}
                />
                <Button onClick={() => handleSend()} disabled={isLoading || !inputValue.trim() || overLimit}
                  className="h-9 w-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Enter 发送，Shift + Enter 换行</span>
                <span className={overLimit ? 'text-red-500' : 'text-gray-400'}>
                  {inputLength}/{MAX_INPUT_LENGTH}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
