"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Search,
  CheckCheck,
  Loader2
} from "lucide-react";
import { chatService, ChatMessage, Conversation } from "@/lib/chat-service";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
      
      // Suscribirse a nuevos mensajes
      const subscription = chatService.subscribeToMessages(activeChat.id, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => [...prev, newMsg]);
      });

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setChats(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (id: string) => {
    try {
      const data = await chatService.getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const textToSend = newMessage;
    setNewMessage("");

    try {
      await chatService.sendMessage(activeChat.id, textToSend);
      // No necesitamos actualizar el estado local aquí porque la suscripción Realtime lo hará
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden h-[calc(100vh-12rem)] animate-fade-in-up">
      {/* Sidebar Chats */}
      <div className="w-80 border-r flex flex-col bg-muted/5">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Buscar chats..."
              className="w-full bg-muted border-none p-3 pl-10 rounded-xl font-bold text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-accent" /></div>
          ) : chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-6 border-b cursor-pointer transition-all hover:bg-muted/30 ${
                activeChat?.id === chat.id ? "bg-muted/50" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-sm">{chat.company?.name || chat.buyer?.full_name}</h3>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <p className="text-muted-foreground font-medium truncate w-40">{chat.last_message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-6 border-b flex justify-between items-center bg-background/50 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center font-black text-sm">
                  {(activeChat.company?.name || activeChat.buyer?.full_name)?.[0]}
                </div>
                <h2 className="font-black">{activeChat.company?.name || activeChat.buyer?.full_name}</h2>
              </div>
              <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5">
              {messages.map((msg) => {
                const isMe = msg.sender_id === activeChat.buyer_id; // Simulación simple para la demo
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${
                      isMe ? "bg-primary text-primary-foreground rounded-tr-none shadow-xl" : "bg-white border rounded-tl-none shadow-sm text-foreground"
                    }`}>
                      <p className="text-sm font-bold">{msg.text}</p>
                      <div className={`flex items-center space-x-1 mt-2 ${isMe ? "justify-end opacity-60" : "justify-start opacity-40 text-black"}`}>
                        <span className="text-[9px] font-bold">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={10} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-background border-t">
              <div className="flex items-center space-x-4 bg-muted px-6 py-4 rounded-[2rem]">
                <button type="button" className="text-muted-foreground hover:text-accent transition-colors">
                  <Smile size={20} />
                </button>
                <button type="button" className="text-muted-foreground hover:text-accent transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje corporativo..."
                  className="flex-1 bg-transparent border-none outline-none font-bold text-sm"
                />
                <button 
                  type="submit"
                  className="bg-primary text-primary-foreground p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20 italic">
            <Search size={48} className="mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">Selecciona una conversación</p>
            <p className="text-xs">Inicia una negociación segura en el ecosistema b2b</p>
          </div>
        )}
      </div>
    </div>
  );
}
