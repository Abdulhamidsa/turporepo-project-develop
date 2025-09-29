import * as React from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { SimpleScrollArea } from '@repo/ui/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bot, Loader2, MessageSquare, Send, X } from 'lucide-react';

import { ChatMessage, ResultItem } from '../../../hooks/useAIChat';

interface AIChatProps {
  chatOpen: boolean;
  chatStep: 'list-projects' | 'select-project' | 'choose-action' | 'finished';
  chatMessages: ChatMessage[];
  data?: ResultItem[];
  loading: boolean;
  projects: { title: string }[];
  userProfilePicture?: string | undefined;
  userName?: string | undefined;
  startChat: () => void;
  selectProject: (project: string) => void;
  sendMessage: (message: string) => void;
  setChatOpen: (open: boolean) => void;
  goBack: () => void;
}

export default function AIChat({
  chatOpen,
  chatStep,
  chatMessages,
  data = [],
  loading,
  projects,
  userProfilePicture,
  userName,
  startChat,
  selectProject,
  sendMessage,
  setChatOpen,
  goBack,
}: AIChatProps) {
  const [userInput, setUserInput] = React.useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (userInput.trim()) {
      sendMessage(userInput.trim());
      setUserInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  React.useEffect(() => {
    if (chatStep === 'finished' && data.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data, chatStep]);

  React.useEffect(() => {
    // Scroll to bottom when messages change or chat step changes
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages, chatStep]);

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-20 right-6 z-50">
        <AnimatePresence>
          {!chatOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={startChat}
                className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 rounded-full h-14 w-14 p-0"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
            >
              <Card className="w-[90vw] max-w-[400px] h-[70vh] max-h-[600px] min-h-[500px] shadow-2xl bg-card/95 backdrop-blur-lg border-border/50 rounded-2xl overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        AI Assistant
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setChatOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                  <SimpleScrollArea className="flex-1 p-4 space-y-4" ref={chatContainerRef}>
                    {chatStep === 'list-projects' && (
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 mb-4"
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 max-w-[280px] shadow-sm">
                            <span className="text-sm text-gray-700 leading-relaxed">
                              Hi! I'm your AI assistant. I analyze your projects to suggest
                              improvements and optimization ideas. Let's get started!
                            </span>
                          </div>
                        </motion.div>
                        <ProjectList projects={projects} selectProject={selectProject} />
                      </div>
                    )}

                    <div className="space-y-4">
                      <ChatMessages
                        messages={chatMessages}
                        userProfilePicture={userProfilePicture}
                        userName={userName}
                      />

                      {/* Show loading after messages */}
                      {loading && (
                        <div className="flex items-start gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2 shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                          </div>
                        </div>
                      )}

                      {/* Show results after AI response */}
                      {(chatStep === 'choose-action' || chatStep === 'finished') &&
                        data.length > 0 &&
                        !loading && <ResponseSection title="Results" data={data} ref={resultRef} />}

                      {/* Show action selector when in choose-action step */}
                      {chatStep === 'choose-action' && !loading && (
                        <ActionSelector sendMessage={sendMessage} goBack={goBack} />
                      )}
                    </div>
                  </SimpleScrollArea>
                </CardContent>
                <CardFooter className="flex-shrink-0 p-4 border-t border-border/50 bg-muted/20">
                  <div className="flex w-full items-end gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="pr-12 py-3 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/50 focus:border-primary/50 resize-none min-h-[44px]"
                      />
                    </div>
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={loading || !userInput.trim()}
                      className="h-11 w-11 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ProjectList({
  projects,
  selectProject,
}: {
  projects: { title: string }[];
  selectProject: (project: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground px-1">Choose a project to analyze:</p>
      <div className="space-y-2">
        {projects.map((proj, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 rounded-xl border-border/50 hover:bg-muted/60 hover:border-primary/50 transition-all duration-200"
            onClick={() => selectProject(proj.title)}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{idx + 1}</span>
              </div>
              <span className="text-sm font-medium truncate">{proj.title}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

function ActionSelector({
  sendMessage,
  goBack,
}: {
  sendMessage: (message: string) => void;
  goBack: () => void;
}) {
  const actions = [
    'Suggest improvements',
    'Find similar projects',
    'How to monetize',
    'Analyze audience',
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground px-1">
        What would you like to explore?
      </p>
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 rounded-xl border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
            onClick={() => sendMessage(action)}
          >
            <span className="text-sm font-medium">{action}</span>
          </Button>
        ))}
      </div>
      <div className="pt-2 border-t border-border/30">
        <Button
          variant="ghost"
          className="w-full justify-center rounded-xl hover:bg-muted/60 transition-colors"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Choose Different Project
        </Button>
      </div>
    </div>
  );
}

function ChatMessages({
  messages,
  userProfilePicture,
  userName,
}: {
  messages: { role: 'user' | 'ai'; text: string }[];
  userProfilePicture?: string | undefined;
  userName?: string | undefined;
}) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 mb-4`}
        >
          {msg.role === 'ai' && (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-[260px] px-4 py-3 rounded-2xl shadow-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md ml-8'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
            }`}
          >
            <p
              className={`text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'font-medium' : 'text-gray-700'
              }`}
            >
              {msg.text}
            </p>
          </div>
          {msg.role === 'user' && (
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0 shadow-md">
              {userProfilePicture ? (
                <img
                  src={userProfilePicture}
                  alt={userName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}

const ResponseSection = React.forwardRef(function ResponseSection(
  { title, data }: { title: string; data: ResultItem[] },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div className="mb-4" ref={ref}>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-4 max-w-[280px] shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm">{title}</h4>
          <div className="space-y-3">
            {data.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <h5 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h5>
                <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export { ChatMessages };
