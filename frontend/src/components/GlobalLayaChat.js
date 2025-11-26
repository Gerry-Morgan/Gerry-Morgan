import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import LayaChat from './LayaChat';

export default function GlobalLayaChat() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setShowChat(true)}
        data-testid="global-laya-chat-button"
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-0 flex items-center justify-center"
        title="Chat with Laya"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>

      {/* Chat Modal */}
      {showChat && <LayaChat onClose={() => setShowChat(false)} />}
    </>
  );
}
