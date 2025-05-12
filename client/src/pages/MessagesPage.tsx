import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  User as UserIcon, 
  Search, 
  Send, 
  ChevronLeft,
  MessageSquare as MessageSquareIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample conversations for demonstration
const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    user: {
      id: 1,
      displayName: "Michael R.",
      profileImageUrl: null,
      lastSeen: "5 min ago",
      isOnline: true
    },
    lastMessage: {
      content: "Are you going to the Taylor Swift concert?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: true,
      isSender: false
    },
    unreadCount: 0
  },
  {
    id: 2,
    user: {
      id: 2,
      displayName: "Sophia T.",
      profileImageUrl: null,
      lastSeen: "1 hour ago",
      isOnline: false
    },
    lastMessage: {
      content: "I got tickets for the art exhibition! Want to join?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isRead: false,
      isSender: false
    },
    unreadCount: 2
  },
  {
    id: 3,
    user: {
      id: 3,
      displayName: "David K.",
      profileImageUrl: null,
      lastSeen: "3 hours ago",
      isOnline: false
    },
    lastMessage: {
      content: "Thanks for connecting! Looking forward to the game.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      isRead: true,
      isSender: true
    },
    unreadCount: 0
  }
];

// Sample messages for demonstration
const SAMPLE_MESSAGES = [
  {
    id: 1,
    content: "Hey there! I saw you're interested in the Taylor Swift concert.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isSender: false
  },
  {
    id: 2,
    content: "Yes! I'm so excited about it. Are you planning to go?",
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    isSender: true
  },
  {
    id: 3,
    content: "Absolutely! I got tickets for the Saturday show. What about you?",
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
    isSender: false
  },
  {
    id: 4,
    content: "I got tickets for Saturday too! Would you be interested in meeting up before the concert?",
    timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
    isSender: true
  },
  {
    id: 5,
    content: "That sounds great! There's a nice restaurant near the stadium we could check out.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isSender: false
  }
];

export default function MessagesPage() {
  const params = useParams<{ id?: string }>();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    params.id ? parseInt(params.id) : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Filter conversations based on search query
  const filteredConversations = SAMPLE_CONVERSATIONS.filter(conv => 
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get the selected conversation data
  const currentConversation = selectedConversation 
    ? SAMPLE_CONVERSATIONS.find(conv => conv.id === selectedConversation) 
    : null;

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation, SAMPLE_MESSAGES.length]);

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (lastSeen: string) => {
    return `Last seen ${lastSeen}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the server
    console.log(`Sending message to ${currentConversation?.user.displayName}: ${newMessage}`);
    
    // Clear the input
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // On mobile, show only the conversation list or the selected conversation
  const showConversationsList = !isMobile || !selectedConversation;
  const showSelectedConversation = !isMobile || selectedConversation;

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Conversation list */}
      {showConversationsList && (
        <div className={`border-r border-gray-200 ${isMobile && selectedConversation ? 'hidden' : 'flex flex-col'}`} style={{ width: isMobile ? '100%' : '350px' }}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      {conversation.user.profileImageUrl ? (
                        <img
                          src={conversation.user.profileImageUrl}
                          alt={`${conversation.user.displayName}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      {conversation.user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{conversation.user.displayName}</h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage.timestamp.toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        !conversation.lastMessage.isRead && !conversation.lastMessage.isSender 
                          ? 'font-semibold text-gray-900' 
                          : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage.isSender ? 'You: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.user.isOnline 
                          ? 'Online' 
                          : formatLastSeen(conversation.user.lastSeen)}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </ScrollArea>
        </div>
      )}
      
      {/* Selected conversation */}
      {showSelectedConversation && currentConversation ? (
        <div className={`flex-1 flex flex-col h-full ${isMobile && !selectedConversation ? 'hidden' : ''}`}>
          <div className="p-4 border-b border-gray-200 flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 p-0 h-8 w-8"
                onClick={() => setSelectedConversation(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center flex-1">
              {currentConversation.user.profileImageUrl ? (
                <img
                  src={currentConversation.user.profileImageUrl}
                  alt={`${currentConversation.user.displayName}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{currentConversation.user.displayName}</h3>
                <p className="text-xs text-gray-500">
                  {currentConversation.user.isOnline 
                    ? 'Online' 
                    : formatLastSeen(currentConversation.user.lastSeen)}
                </p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {SAMPLE_MESSAGES.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.isSender 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isSender ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
                className="px-3"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : showSelectedConversation ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquareIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-1">Your Messages</h3>
            <p className="max-w-sm text-sm">Select a conversation to start chatting or connect with event buddies to start a new conversation.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
