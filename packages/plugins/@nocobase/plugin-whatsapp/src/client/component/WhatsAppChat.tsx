// src/client/components/WhatsAppChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Space, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useCollection, useCollectionRecordData, useDataBlockResource } from '@nocobase/client';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 80vh;
  background-color: #f0f2f5;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div<{ isSent: boolean }>`
  max-width: 60%;
  padding: 8px 12px;
  margin: 4px;
  border-radius: 8px;
  align-self: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isSent ? '#dcf8c6' : 'white'};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
`;

interface Message {
  id: string;
  content: string;
  fromMe: boolean;
  timestamp: string;
}

export const WhatsAppChat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const collection = useCollection();
  const record = useCollectionRecordData();
  const resource = useDataBlockResource();

  // Mock messages - replace with actual data from your backend
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      // Replace with your actual send message API call
      await resource.create({
        values: {
          message: inputMessage,
          sessionId: record.sessionId || 1,
          jid: record.jid,
        },
      });

      // Add message to local state
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: inputMessage,
        fromMe: true,
        timestamp: new Date().toISOString(),
      }]);

      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Card bordered={false}>
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message) => (
            <MessageBubble key={message.id} isSent={message.fromMe}>
              <div>{message.content}</div>
              <small style={{ fontSize: '0.7em', color: '#666' }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </small>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Space.Compact>
        </InputContainer>
      </ChatContainer>
    </Card>
  );
};