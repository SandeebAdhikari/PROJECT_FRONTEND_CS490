"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { checkOwnerSalon } from "@/libs/api/salons";
import { getSalonCustomers, getConversation, sendMessage } from "@/libs/api/messages";
import type { Customer, Message } from "@/libs/api/messages";

const CustomerMessaging = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const loadSalonData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
          await loadCustomers(result.salon.salon_id);
        }
      } catch (error) {
        console.error("Error loading salon data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSalonData();
  }, []);

  const loadCustomers = async (id: number) => {
    try {
      const result = await getSalonCustomers(id);
      if (result.customers) {
        setCustomers(result.customers);
        if (result.customers.length > 0 && !selectedCustomer) {
          setSelectedCustomer(result.customers[0]);
          await loadConversation(id, result.customers[0].user_id);
        }
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const loadConversation = async (salonId: number, customerId: number) => {
    setLoadingMessages(true);
    try {
      const result = await getConversation(salonId, customerId);
      if (result.messages) {
        setMessages(result.messages);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    if (salonId) {
      await loadConversation(salonId, customer.user_id);
    }
  };

  const handleSendMessage = async () => {
    if (!salonId || !selectedCustomer || !newMessage.trim()) return;

    setSending(true);
    try {
      const result = await sendMessage(salonId, selectedCustomer.user_id, newMessage);
      if (result.message_id) {
        setNewMessage("");
        // Reload conversation
        await loadConversation(salonId, selectedCustomer.user_id);
        // Reload customers to update unread counts
        await loadCustomers(salonId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-lg font-bold">Customer Messages</h2>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Customer List */}
        <div className="w-1/3 border-r border-border pr-4 overflow-y-auto">
          <div className="space-y-2">
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No customers to message yet</p>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.user_id}
                  onClick={() => handleSelectCustomer(customer)}
                  className={`w-full text-left p-3 rounded-lg border transition-smooth ${
                    selectedCustomer?.user_id === customer.user_id
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{customer.full_name}</p>
                        {customer.last_message && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {customer.last_message}
                          </p>
                        )}
                      </div>
                    </div>
                    {customer.unread_count > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {customer.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col">
          {selectedCustomer ? (
            <>
              <div className="border-b border-border pb-3 mb-3">
                <h3 className="font-medium">{selectedCustomer.full_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {loadingMessages ? (
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((message) => {
                    const isOwner = message.from_user_id !== selectedCustomer.user_id;
                    return (
                      <div
                        key={message.message_id}
                        className={`flex ${isOwner ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isOwner
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${isOwner ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a customer to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMessaging;

