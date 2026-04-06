'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, Phone, PhoneOff, Bot, User, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isVoice?: boolean
}

const botResponses = [
  "Hi! How can I help you with your order today?",
  "I can help you track your order, find restaurants, or answer questions about our service.",
  "Your order is being prepared and will be delivered in approximately 20 minutes.",
  "Would you like me to recommend some popular dishes from nearby restaurants?",
  "I've noted your feedback. Is there anything else I can help you with?",
  "You can check your order status in the Orders section. Would you like me to guide you there?",
  "Our Premium subscription includes free delivery and exclusive discounts. Would you like to know more?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your LPU Eats assistant. How can I help you today? You can type or use voice to chat with me.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleSendMessage(transcript, true)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const handleSendMessage = (text: string, isVoice = false) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      isVoice,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])

      // Speak the response if in call mode
      if (isInCall) {
        speakText(botMessage.text)
      }
    }, 1000)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current?.start()
      setIsRecording(true)
    }
  }

  const toggleCall = () => {
    setIsInCall(!isInCall)
    if (!isInCall) {
      // Start call - speak greeting
      speakText("Voice call connected. How can I assist you today?")
    } else {
      // End call
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">LPU Eats Support</h1>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </p>
            </div>
          </div>

          {/* Voice Call Button */}
          <Button
            onClick={toggleCall}
            variant={isInCall ? 'destructive' : 'outline'}
            size="sm"
            className={isInCall ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isInCall ? (
              <>
                <PhoneOff className="w-4 h-4 mr-2" />
                End Call
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Voice Call
              </>
            )}
          </Button>
        </div>

        {/* Call Status */}
        {isInCall && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Voice call active</span>
            </div>
            {isSpeaking && (
              <div className="flex items-center gap-2 text-green-600">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span className="text-xs">Speaking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-orange-500 text-white rounded-br-md'
                  : 'bg-white border shadow-sm rounded-bl-md'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'bot' && (
                  <Bot className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.text}
                  </p>
                  <div className={`flex items-center gap-2 mt-1 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}>
                    {message.isVoice && (
                      <Mic className={`w-3 h-3 ${message.sender === 'user' ? 'text-orange-200' : 'text-gray-400'}`} />
                    )}
                    <span className={`text-xs ${
                      message.sender === 'user' ? 'text-orange-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {message.sender === 'user' && (
                  <User className="w-4 h-4 text-orange-200 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center gap-3">
          {/* Voice Recording Button */}
          <Button
            onClick={toggleRecording}
            variant="outline"
            size="icon"
            className={`flex-shrink-0 ${
              isRecording
                ? 'bg-red-50 border-red-300 text-red-500 animate-pulse'
                : 'hover:bg-orange-50 hover:border-orange-300'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder={isRecording ? 'Listening...' : 'Type a message...'}
              disabled={isRecording}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {isRecording && (
          <p className="text-center text-sm text-red-500 mt-2 animate-pulse">
            Recording... Speak now
          </p>
        )}
      </div>
    </div>
  )
}
