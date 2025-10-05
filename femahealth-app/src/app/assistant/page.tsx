'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BottomNavigation } from '@/components/BottomNavigation'
import { 
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  HeartIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your HealthVibe AI assistant. I can help you find natural remedies, answer health questions, and provide personalized wellness advice. What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "I have a headache, what natural remedies can help?",
        "What herbs are good for digestion?",
        "How can I improve my sleep naturally?",
        "I'm feeling stressed, any suggestions?"
      ]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): { text: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()

    if (input.includes('headache') || input.includes('head pain')) {
      return {
        text: "For headaches, I recommend trying these natural remedies:\n\n• **Peppermint oil**: Apply diluted peppermint oil to temples\n• **Ginger tea**: Anti-inflammatory properties help reduce pain\n• **Cold compress**: Apply to forehead for 15-20 minutes\n• **Hydration**: Often headaches are caused by dehydration\n• **Rest in dark room**: Reduce light and noise sensitivity\n\nTry the peppermint oil first - it's often very effective for tension headaches!",
        suggestions: [
          "How do I make ginger tea?",
          "What's the best way to apply peppermint oil?",
          "How long should I rest for a headache?"
        ]
      }
    }

    if (input.includes('digestion') || input.includes('stomach') || input.includes('bloating')) {
      return {
        text: "For digestive issues, here are some excellent natural remedies:\n\n• **Peppermint tea**: Soothes stomach and reduces bloating\n• **Ginger**: Fresh ginger tea aids digestion\n• **Fennel seeds**: Chew a teaspoon after meals\n• **Chamomile tea**: Calms digestive system\n• **Probiotics**: Yogurt or fermented foods\n• **Warm water with lemon**: First thing in the morning\n\nStart with peppermint tea - it's gentle and very effective!",
        suggestions: [
          "What foods should I avoid for bloating?",
          "How often should I drink peppermint tea?",
          "Are there any side effects of ginger?"
        ]
      }
    }

    if (input.includes('sleep') || input.includes('insomnia') || input.includes('tired')) {
      return {
        text: "For better sleep, try these natural approaches:\n\n• **Chamomile tea**: Drink 30 minutes before bed\n• **Lavender**: Essential oil on pillow or in bath\n• **Magnesium**: Natural muscle relaxant\n• **4-7-8 breathing**: Inhale 4, hold 7, exhale 8\n• **No screens 1 hour before bed**: Blue light disrupts sleep\n• **Cool room temperature**: 65-68°F is optimal\n• **Consistent bedtime**: Same time every night\n\nChamomile tea is my top recommendation - it's very gentle and effective!",
        suggestions: [
          "What's the 4-7-8 breathing technique?",
          "How much magnesium should I take?",
          "Can I use lavender oil directly on skin?"
        ]
      }
    }

    if (input.includes('stress') || input.includes('anxiety') || input.includes('worried')) {
      return {
        text: "For stress and anxiety, these natural remedies can help:\n\n• **Deep breathing**: 4-7-8 technique or box breathing\n• **Ashwagandha**: Adaptogenic herb for stress\n• **L-theanine**: Found in green tea\n• **Exercise**: Even 10 minutes of walking helps\n• **Meditation**: 5-10 minutes daily\n• **Chamomile tea**: Calming properties\n• **Nature exposure**: Walk outside when possible\n\nStart with deep breathing - it's free and works immediately!",
        suggestions: [
          "How do I do box breathing?",
          "What's the best time to take ashwagandha?",
          "How long should I meditate?"
        ]
      }
    }

    if (input.includes('cold') || input.includes('flu') || input.includes('sick')) {
      return {
        text: "For cold and flu symptoms, try these natural remedies:\n\n• **Elderberry syrup**: Boosts immune system\n• **Ginger honey tea**: Soothes throat and reduces inflammation\n• **Garlic**: Natural antibiotic properties\n• **Vitamin C**: Citrus fruits or supplements\n• **Rest**: Your body needs energy to heal\n• **Hydration**: Lots of water and herbal teas\n• **Steam inhalation**: With eucalyptus oil\n\nElderberry syrup is excellent for shortening cold duration!",
        suggestions: [
          "How do I make elderberry syrup?",
          "What's the best way to use garlic?",
          "How much vitamin C should I take?"
        ]
      }
    }

    // Default response
    return {
      text: "I'd be happy to help you with that! While I'm still learning, I can provide information about:\n\n• Natural remedies for common ailments\n• Herbal treatments and their benefits\n• Wellness and lifestyle advice\n• Symptom management\n• Preventive health measures\n\nCould you be more specific about what you're looking for? For example, you could ask about specific symptoms, herbs, or health concerns.",
      suggestions: [
        "What herbs help with inflammation?",
        "How can I boost my immune system?",
        "What are adaptogenic herbs?",
        "Tell me about natural pain relief"
      ]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 pb-20">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-display text-green-800 dark:text-green-200">AI Assistant</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="herb-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-green-600' 
                        : 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30'
                    }`}>
                      {message.isUser ? (
                        <UserIcon className="w-5 h-5 text-white" />
                      ) : (
                        <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    }`}>
                      <p className="text-sm font-body whitespace-pre-line">{message.text}</p>
                      <div className={`text-xs mt-2 ${
                        message.isUser ? 'text-green-100' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-body"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 dark:text-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 dark:text-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-600 dark:text-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-green-200 dark:border-green-800 p-6">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about natural remedies, health concerns, or wellness advice..."
                  className="w-full px-4 py-3 border border-green-200 dark:border-green-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 dark:bg-slate-800/80 text-green-800 dark:text-green-200 font-body resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 flex items-center space-x-2 text-xs text-green-600 dark:text-green-400 font-body">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span>AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
