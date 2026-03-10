'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import { assetUrl } from '@/lib/utils';


interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
  status: 'active' | 'archived';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentChatId] = useState('e21bd9dd-6203-4156-8247-cc1a6c19fbe0');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Fetch conversations data
  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessagesForConversation(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - in real app, fetch user's conversations
      const mockConversations: Conversation[] = [
        {
          id: currentChatId, // Using the specific chat ID: e21bd9dd-6203-4156-8247-cc1a6c19fbe0
          title: 'Sarah Johnson',
          participants: ['Sarah Johnson', 'You'],
          lastMessage: 'Hi, I\'m interested in the monthly membership for your coworking space...',
          lastMessageTime: '2 hours ago',
          unreadCount: 2,
          avatar: '/images/auth2.png',
          status: 'active',
        },
        {
          id: '2',
          title: 'Michael Chen',
          participants: ['Michael Chen', 'You'],
          lastMessage: 'I would like to book a room for next weekend. Is it available?',
          lastMessageTime: '5 hours ago',
          unreadCount: 1,
          avatar: '/images/auth3.png',
          status: 'active',
        },
        {
          id: '3',
          title: 'Emily Brown',
          participants: ['Emily Brown', 'You'],
          lastMessage: 'Thanks for the amazing dining experience! We\'ll definitely come back.',
          lastMessageTime: 'Yesterday',
          unreadCount: 0,
          avatar: '/images/auth4.png',
          status: 'active',
        },
        {
          id: '4',
          title: 'David Lee',
          participants: ['David Lee', 'You'],
          lastMessage: 'I have a business proposal for you. Can we schedule a meeting?',
          lastMessageTime: '2 days ago',
          unreadCount: 0,
          avatar: '/images/auth1.png',
          status: 'archived',
        },
      ];
      setConversations(mockConversations);
      // Select first conversation by default
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Load messages for the selected conversation
    loadMessagesForConversation(conversation.id);
    // On mobile, hide conversations sidebar when selecting a chat
    setShowConversations(false);
    // Scroll to bottom after a short delay to ensure messages are loaded
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // Load messages for a conversation
  const loadMessagesForConversation = (conversationId: string) => {
    // Mock messages data - in real app, fetch from API
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'other-user',
        senderName: selectedConversation?.title || 'User',
        senderAvatar: selectedConversation?.avatar || '/images/auth2.png',
        content: 'Hi, I\'m interested in the monthly membership for your coworking space. Could you tell me more about the pricing?',
        timestamp: '2 hours ago',
        isRead: false,
      },
      {
        id: '2',
        senderId: 'current-user',
        senderName: 'You',
        senderAvatar: '/images/author-avatar.png',
        content: 'Thank you for your interest! I\'ll send you the details shortly.',
        timestamp: '1 hour ago',
        isRead: true,
      },
      {
        id: '3',
        senderId: 'other-user',
        senderName: selectedConversation?.title || 'User',
        senderAvatar: selectedConversation?.avatar || '/images/auth2.png',
        content: 'That would be great! I\'m looking forward to hearing from you.',
        timestamp: '30 minutes ago',
        isRead: false,
      },
    ];
    setMessages(mockMessages);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    
    // Create new message object with chat ID
    const newMessageObj: Message = {
      id: `${currentChatId}-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/images/author-avatar.png',
      content: newMessage.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    // Add message to the list
    setMessages(prev => [...prev, newMessageObj]);
    
    // Clear input
    setNewMessage('');
    
    // Scroll to bottom after adding message
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    // Simulate API call delay
    setTimeout(() => {
      setIsSending(false);
      
      // Simulate auto-reply after 2 seconds
      setTimeout(() => {
        const autoReply: Message = {
          id: `${currentChatId}-${Date.now() + 1}`,
          senderId: 'other-user',
          senderName: selectedConversation.title,
          senderAvatar: selectedConversation.avatar,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: 'Just now',
          isRead: false,
        };
        setMessages(prev => [...prev, autoReply]);
        // Scroll to bottom after receiving auto-reply
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }, 2000);
    }, 500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('File type not supported. Please select an image, PDF, or document file.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !selectedConversation || isUploadingFile) return;

    setIsUploadingFile(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('chatId', currentChatId);
      formData.append('conversationId', selectedConversation.id);

      // Create file message object
      const fileMessageObj: Message = {
        id: `${currentChatId}-${Date.now()}`,
        senderId: 'current-user',
        senderName: 'You',
        senderAvatar: '/images/author-avatar.png',
        content: `📎 ${selectedFile.name}`,
        timestamp: 'Just now',
        isRead: true,
      };

      // Add message to the list
      setMessages(prev => [...prev, fileMessageObj]);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Simulate file upload delay
      setTimeout(() => {
        setIsUploadingFile(false);
        setSelectedFile(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Simulate auto-reply for file upload
        setTimeout(() => {
          const autoReply: Message = {
            id: `${currentChatId}-${Date.now() + 1}`,
            senderId: 'other-user',
            senderName: selectedConversation.title,
            senderAvatar: selectedConversation.avatar,
            content: `Thanks for sharing the file "${selectedFile.name}". I'll review it shortly.`,
            timestamp: 'Just now',
            isRead: false,
          };
          setMessages(prev => [...prev, autoReply]);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }, 2000);
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploadingFile(false);
      alert('Failed to upload file. Please try again.');
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading messages...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src="/images/breadcrumb1.jpg" alt="" />
        </div>
        
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard-listings' },
            { label: 'Messages' }
          ]}
          title="Messages"
        />
      </section>

      {/* Dashboard Wrapper */}
      <section className="dashboard-wrapper section-bg p-bottom-70">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="dashboard_area">
                <div className="dashboard_contents">
                  <div className="atbd_author_module">
                   
                    <div className="atbdb_content_module_contents">
                      {/* Page Header */}
                      <div className="messages-header mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="messages-info">
                            <h2 className="mb-2" style={{ color: '#2c3e50', fontWeight: '700', letterSpacing: '-0.5px' }}>
                              <i className="la la-comments me-2" style={{ color: 'var(--primary-color)' }}></i>
                              Messages
                            </h2>
                            <p className="text-muted mb-0" style={{ fontSize: '14px', fontWeight: '500' }}>
                              You have <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{totalUnreadCount}</span> unread message{totalUnreadCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="header-actions">
                            <button 
                              className="btn btn-primary me-3 d-md-none"
                              onClick={() => setShowConversations(true)}
                            >
                              <i className="la la-list me-1"></i> Conversations
                            </button>
                            <button className="btn btn-outline-secondary me-3">
                              <i className="la la-archive me-1"></i> Archive
                            </button>
                            <button className="btn btn-outline-primary">
                              <i className="la la-check-double me-1"></i> Mark All as Read
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Fiverr-style Messages Interface */}
                      <div className="messages-interface">
                        {/* Conversations Sidebar */}
                        <div className={`conversations-sidebar ${showConversations ? 'show' : ''}`}>
                            <div className="conversations-header">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">Conversations</h5>
                                <button 
                                  className="btn btn-sm btn-outline-secondary d-md-none"
                                  onClick={() => setShowConversations(false)}
                                >
                                  <i className="la la-times"></i>
                                </button>
                              </div>
                              <div className="search-box">
                                <input 
                                  type="text" 
                                  placeholder="Search conversations..." 
                                  className="form-control"
                                />
                                <i className="la la-search search-icon"></i>
                              </div>
                            </div>
                            
                            <div className="conversations-list">
                              {conversations.length > 0 ? (
                                conversations.map((conversation) => (
                                  <div
                                    key={conversation.id}
                                    className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''} ${conversation.status}`}
                                    onClick={() => handleConversationSelect(conversation)}
                                  >
                                    <div className="conversation-avatar">
                                      <img
                                        src={assetUrl(conversation.avatar)}
                                        alt={conversation.title}
                                        className="rounded-circle"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                      />
                                      {conversation.unreadCount > 0 && (
                                        <span className="unread-badge">{conversation.unreadCount}</span>
                                      )}
                                    </div>
                                    
                                    <div className="conversation-content">
                                      <div className="conversation-header">
                                        <h6 className="conversation-title">{conversation.title}</h6>
                                        <small className="conversation-time">{conversation.lastMessageTime}</small>
                                      </div>
                                      <p className="conversation-preview">{conversation.lastMessage}</p>
                                    </div>
                                    
                                    {conversation.status === 'archived' && (
                                      <div className="conversation-status">
                                        <i className="la la-archive"></i>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="no-conversations">
                                  <i className="la la-comments"></i>
                                  <p>No conversations yet</p>
                                </div>
                              )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="chat-area">
                            {selectedConversation ? (
                              <div className="chat-container">
                                {/* Chat Header */}
                                <div className="chat-header">
                                  <div className="chat-user-info">
                                    <button 
                                      className="btn btn-sm btn-outline-secondary me-2 d-md-none"
                                      onClick={() => setShowConversations(true)}
                                    >
                                      <i className="la la-arrow-left"></i>
                                    </button>
                                    <img
                                      src={assetUrl(selectedConversation.avatar)}
                                      alt={selectedConversation.title}
                                      className="rounded-circle me-3"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                                    />
                                    <div>
                                      <h6 className="mb-0">{selectedConversation.title}</h6>
                                      <small className="text-muted">
                                        Active now • Chat ID: {selectedConversation.id}
                                      </small>
                                    </div>
                                  </div>
                                  <div className="chat-actions">
                                    <button className="btn btn-sm btn-outline-secondary me-2">
                                      <i className="la la-phone" style={{ fontSize: '16px' }}></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                      <span style={{ fontSize: '16px' }}>🎥</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="chat-messages">
                                  {messages.length > 0 ? (
                                    messages.map((message) => (
                                      <div
                                        key={message.id}
                                        className={`message ${message.senderId === 'current-user' ? 'sent' : 'received'}`}
                                      >
                                        <div className="message-avatar">
                                          <img
                                            src={assetUrl(message.senderAvatar)}
                                            alt={message.senderName}
                                            className="rounded-circle"
                                            style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                                          />
                                        </div>
                                        <div className="message-content">
                                          <div className="message-bubble">
                                            <p>{message.content}</p>
                                            <small className="message-time">{message.timestamp}</small>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="no-messages text-center py-5">
                                      <i className="la la-comment" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                      <p className="mt-3 text-muted">No messages yet. Start the conversation!</p>
                                    </div>
                                  )}
                                  {/* Invisible element to scroll to */}
                                  <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <div className="chat-input">
                                  {/* File Preview */}
                                  {selectedFile && (
                                    <div className="file-preview mb-3 p-3 border rounded bg-light">
                                      <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                          <i className="la la-file me-2" style={{ fontSize: '20px', color: '#667eea' }}></i>
                                          <div>
                                            <div className="fw-bold">{selectedFile.name}</div>
                                            <small className="text-muted">{formatFileSize(selectedFile.size)}</small>
                                          </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                          <button 
                                            className="btn btn-sm btn-success"
                                            onClick={handleFileUpload}
                                            disabled={isUploadingFile}
                                          >
                                            {isUploadingFile ? (
                                              <>
                                                <i className="la la-spinner la-spin me-1"></i>
                                                Uploading...
                                              </>
                                            ) : (
                                              <>
                                                <i className="la la-upload me-1"></i>
                                                Send
                                              </>
                                            )}
                                          </button>
                                          <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={handleRemoveFile}
                                            disabled={isUploadingFile}
                                          >
                                            <i className="la la-times"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="input-group">
                                    <input 
                                      type="text" 
                                      className="form-control" 
                                      placeholder="Type your message..."
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      onKeyPress={handleKeyPress}
                                      disabled={isSending || isUploadingFile}
                                    />
                                    <div className="input-group-append">
                                      <button 
                                        className="btn btn-primary"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || isSending || isUploadingFile}
                                      >
                                        {isSending ? (
                                          <i className="la la-spinner la-spin" style={{ fontSize: '16px' }}></i>
                                        ) : (
                                          <i className="la la-paper-plane" style={{ fontSize: '24px' }}></i>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="chat-tools">
                                    <button 
                                      className="btn btn-sm btn-outline-secondary" 
                                      title="Attach file"
                                      onClick={() => fileInputRef.current?.click()}
                                      disabled={isSending || isUploadingFile}
                                    >
                                      <i className="la la-paperclip"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary" title="Add emoji">
                                      <span style={{ fontSize: '16px' }}>😊</span>
                                    </button>
                                  </div>
                                  
                                  {/* Hidden file input */}
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="d-none"
                                    onChange={handleFileSelect}
                                    accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="no-chat-selected">
                                <button 
                                  className="btn btn-primary mb-3 d-md-none"
                                  onClick={() => setShowConversations(true)}
                                >
                                  <i className="la la-list me-2"></i>
                                  View Conversations
                                </button>
                                <i className="la la-comment"></i>
                                <h4>Select a conversation</h4>
                                <p>Choose a conversation from the sidebar to start chatting</p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

