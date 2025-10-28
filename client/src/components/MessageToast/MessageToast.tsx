import React from 'react';

interface MessageToastProps {
  senderName: string;
  message: string;
  isBot?: boolean;
}

const MessageToast: React.FC<MessageToastProps> = ({ senderName, message, isBot = false }) => {
  const messagePreview = message.length > 80 ? `${message.substring(0, 80)}...` : message;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '280px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontWeight: '600',
        color: isBot ? '#28a745' : '#007bff',
        fontSize: '15px'
      }}>
        <span style={{ fontSize: '16px' }}>{isBot ? '🤖' : '�'}</span>
        <span>{senderName}</span>
        {isBot && <span style={{ fontSize: '11px', color: '#666', fontWeight: 'normal' }}>• responded</span>}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#2c3e50', 
        lineHeight: '1.4',
        background: isBot ? '#f0f8f0' : '#f8f9fa',
        padding: '10px 12px',
        borderRadius: '12px',
        border: `1px solid ${isBot ? '#d4edda' : '#e9ecef'}`,
        borderLeft: `4px solid ${isBot ? '#28a745' : '#007bff'}`
      }}>
        {messagePreview}
      </div>
    </div>
  );
};

export default MessageToast;