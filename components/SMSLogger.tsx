// ./components/SMSLogger.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Clock, RefreshCw } from 'lucide-react';
import type { SMSMessage } from '@/types/sms';

export default function SMSLogger() {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          SMS Log
        </h2>
        <button
          onClick={fetchMessages}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No messages yet</p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg border ${
                message.direction === 'inbound'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">
                  {message.direction === 'inbound' ? 'From' : 'To'}: {message.direction === 'inbound' ? message.from : message.to}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{message.body}</p>
              {message.status && (
                <div className="mt-2 text-xs text-gray-500">
                  Status: {message.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}