import { motion } from 'framer-motion';

import { ChatMessage } from '../../../hooks/useAIChat';

interface ChatMessagesProps {
  chatMessages: ChatMessage[];
}

export default function ChatMessages({ chatMessages }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {chatMessages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-lg px-3 py-2 ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
            }`}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
