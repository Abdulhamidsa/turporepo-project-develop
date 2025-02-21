import * as React from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { SimpleScrollArea } from '@repo/ui/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bot, Loader2, MessageSquare, RefreshCw, Send, X } from 'lucide-react';

import { ChatMessage, ResultItem } from '../hooks/useAIChat';

interface AIChatProps {
  chatOpen: boolean;
  chatStep: 'list-projects' | 'select-project' | 'choose-action' | 'finished';
  chatMessages: ChatMessage[];
  data?: ResultItem[];
  loading: boolean;
  projects: { title: string }[];
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

  // When results update, scroll to the top of the results section.
  React.useEffect(() => {
    if (chatStep === 'finished' && data.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data, chatStep]);

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <AnimatePresence>
        {!chatOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button onClick={startChat} className="shadow-lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Open AI Chat
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="w-[90vw] max-w-[400px] shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Chat Assistant</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <SimpleScrollArea className="h-[400px] md:pr-4" ref={chatContainerRef}>
                  {chatStep === 'list-projects' && (
                    <>
                      <Bot className="ml-1 h-8 w-8" />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted mb-4 flex items-center rounded-lg px-3 py-2"
                      >
                        <span className="text-sm text-white">
                          Hi! I'm your AI Chat Assistant. I analyze your project data to suggest
                          improvements and ideas to optimize your projects. Let's get started!
                        </span>
                      </motion.div>
                      <ProjectList projects={projects} selectProject={selectProject} />
                    </>
                  )}
                  {chatStep === 'choose-action' && (
                    <ActionSelector sendMessage={sendMessage} goBack={goBack} />
                  )}
                  {chatStep === 'select-project' && (
                    <>
                      <ChatMessages messages={chatMessages} />
                    </>
                  )}
                  {chatStep === 'finished' && <ChatMessages messages={chatMessages} />}
                  {chatStep === 'finished' && data.length > 0 && (
                    <ResponseSection title="Results" data={data} ref={resultRef} />
                  )}
                  {chatStep === 'finished' && (
                    <div className="mt-4 flex flex-wrap items-start gap-2">
                      <Button variant="outline" size="sm" onClick={() => sendMessage('refresh')}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                      <Button variant="secondary" size="sm" onClick={goBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Pick Another Project
                      </Button>
                    </div>
                  )}
                  {loading && (
                    <div className="mt-2 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </SimpleScrollArea>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={loading}
                  />
                  <Button size="icon" onClick={handleSend} disabled={loading}>
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
    <div className="space-y-2">
      <h4 className="font-semibold">Select a project:</h4>
      {projects.map((proj, idx) => (
        <Button
          key={idx}
          variant="outline"
          className="w-full justify-start"
          onClick={() => selectProject(proj.title)}
        >
          {idx + 1}. {proj.title}
        </Button>
      ))}
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
    <div className="space-y-2">
      {actions.map((action, idx) => (
        <Button
          key={idx}
          variant="outline"
          className="w-full justify-start"
          onClick={() => sendMessage(action)}
        >
          {action}
        </Button>
      ))}
      <Button variant="secondary" className="w-full" onClick={goBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Pick Another Project
      </Button>
    </div>
  );
}

function ChatMessages({ messages }: { messages: { role: 'user' | 'ai'; text: string }[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            {msg.role === 'ai' && <Bot className="mb-2 h-4 w-4" />}
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const ResponseSection = React.forwardRef(function ResponseSection(
  { title, data }: { title: string; data: ResultItem[] },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div className="mt-4 w-fit space-y-2" ref={ref}>
      <h4 className="font-semibold text-white">{title}</h4>
      {data.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="mt-2 rounded-lg border p-2 text-white"
        >
          <h5 className="font-semibold">{item.title}</h5>
          <p className="text-muted-foreground text-sm">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
});

export { ChatMessages };
