import * as React from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { SimpleScrollArea } from '@repo/ui/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  FileText,
  Loader2,
  MessageSquare,
  Send,
  Shield,
  X,
} from 'lucide-react';

import { ChatMessage, ResultItem } from '../../../hooks/useAIChat';

// No Projects Screen Component
function NoProjectsScreen({
  onClose,
  userName,
}: {
  onClose: () => void;
  userName?: string | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Projects Found</h3>
          <p className="text-sm text-muted-foreground">
            Hello {userName ? userName : 'there'}! I can't help you yet.
          </p>
        </div>

        {/* Info Content */}
        <div className="bg-muted/30 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">AI Assistant Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• You need at least one project to use the AI assistant</li>
                <li>• Projects provide data for analysis and recommendations</li>
                <li>• The AI can suggest improvements, monetization ideas, and more</li>
                <li>• Your project data helps generate personalized insights</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Get Started:</h4>
              <p className="text-sm text-muted-foreground pl-4">
                Create your first project to unlock AI-powered insights and recommendations. Once
                you have projects, I'll be ready to help you optimize and improve them!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-border/50 bg-muted/10">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          onClick={onClose}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Got it
        </Button>
      </div>
    </motion.div>
  );
}

// Consent Screen Component
function ConsentScreen({
  onAccept,
  onDecline,
  userName,
}: {
  onAccept: () => void;
  onDecline: () => void;
  userName?: string | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">AI Analysis Consent</h3>
          <p className="text-sm text-muted-foreground">
            Hello {userName ? userName : 'there'}! Before we begin, please review our terms.
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-muted/30 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">What Our AI Assistant Does:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• Analyzes your project data (titles, descriptions, and tags)</li>
                <li>• Provides improvement suggestions and optimization ideas</li>
                <li>• Offers monetization and audience analysis insights</li>
                <li>• Suggests similar projects and expansion opportunities</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Data Privacy & Security:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• Your project data is processed temporarily for analysis only</li>
                <li>• No data is stored permanently or shared with third parties</li>
                <li>• Analysis is performed securely on our servers</li>
                <li>• You can stop the analysis at any time</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Your Consent:</h4>
              <p className="text-sm text-muted-foreground pl-4">
                By proceeding, you consent to the temporary analysis of your project data to provide
                personalized insights and recommendations. This consent can be withdrawn at any
                time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-border/50 bg-muted/10">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 border-border hover:bg-muted/50 text-sm"
            onClick={onDecline}
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
            onClick={onAccept}
          >
            <CheckCircle className="h-4 w-4 mr-2" />I Accept & Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface AIChatProps {
  chatOpen: boolean;
  chatStep: 'list-projects' | 'select-project' | 'choose-action' | 'finished' | 'consent';
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
  onConsentGiven?: () => void;
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
  onConsentGiven,
}: AIChatProps) {
  const [userInput, setUserInput] = React.useState('');
  const [consentGiven, setConsentGiven] = React.useState(false);
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

  const handleConsentAccept = () => {
    setConsentGiven(true);
    onConsentGiven?.();
  };

  const handleConsentDecline = () => {
    setChatOpen(false);
    setConsentGiven(false);
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
              <Card className="w-full max-w-sm sm:max-w-md h-[85vh] sm:h-[75vh] max-h-[600px] min-h-[400px] shadow-2xl bg-card backdrop-blur-lg border-border/50 rounded-2xl overflow-hidden flex flex-col mx-auto">
                <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 border-b border-border/50 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        AI Assistant
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {projects.length === 0
                          ? 'No projects available'
                          : !consentGiven
                            ? 'Awaiting consent'
                            : 'Online'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setChatOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                  {projects.length === 0 ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <NoProjectsScreen onClose={() => setChatOpen(false)} userName={userName} />
                    </div>
                  ) : !consentGiven ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <ConsentScreen
                        onAccept={handleConsentAccept}
                        onDecline={handleConsentDecline}
                        userName={userName}
                      />
                    </div>
                  ) : (
                    <SimpleScrollArea
                      className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4"
                      ref={chatContainerRef}
                    >
                      {chatStep === 'list-projects' && (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 mb-4"
                          >
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-muted/30 border border-border rounded-2xl rounded-tl-md px-4 py-3 max-w-[280px] shadow-sm">
                              <span className="text-sm text-foreground leading-relaxed">
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
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-muted/30 border border-border rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2 shadow-sm">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm text-foreground font-medium">
                                Thinking...
                              </span>
                            </div>
                          </div>
                        )}{' '}
                        {/* Show results after AI response */}
                        {(chatStep === 'choose-action' || chatStep === 'finished') &&
                          data.length > 0 &&
                          !loading && (
                            <ResponseSection title="Results" data={data} ref={resultRef} />
                          )}
                        {/* Show action selector when in choose-action step */}
                        {chatStep === 'choose-action' && !loading && (
                          <ActionSelector sendMessage={sendMessage} goBack={goBack} />
                        )}
                      </div>
                    </SimpleScrollArea>
                  )}
                </CardContent>
                {consentGiven && projects.length > 0 && (
                  <CardFooter className="flex-shrink-0 p-3 sm:p-4 border-t border-border/50 bg-muted/10">
                    <div className="flex w-full items-end gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          disabled={loading}
                          className="pr-12 py-2 sm:py-3 rounded-2xl border-border/50 bg-background focus:ring-primary/50 focus:border-primary/50 resize-none min-h-[40px] sm:min-h-[44px] text-sm"
                        />
                      </div>
                      <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={loading || !userInput.trim()}
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                )}
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
            className="w-full justify-start text-left h-auto p-2 sm:p-3 rounded-xl border-border/50 hover:bg-muted/60 hover:border-primary/50 transition-all duration-200"
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
            className="w-full justify-start text-left h-auto p-2 sm:p-3 rounded-xl border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
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
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="h-5 w-5 text-primary" />
            </div>
          )}
          <div
            className={`max-w-[75%] sm:max-w-[260px] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md ml-4 sm:ml-8'
                : 'bg-muted/30 border border-border text-foreground rounded-tl-md'
            }`}
          >
            <p
              className={`text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'font-medium text-primary-foreground' : 'text-foreground'
              }`}
            >
              {msg.text}
            </p>
          </div>
          {msg.role === 'user' && (
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 shadow-md">
              {userProfilePicture ? (
                <img
                  src={userProfilePicture}
                  alt={userName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/80 flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
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
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="bg-muted/30 border border-border rounded-2xl rounded-tl-md px-3 sm:px-4 py-3 sm:py-4 max-w-[85%] sm:max-w-[280px] shadow-sm">
          <h4 className="font-semibold text-foreground mb-3 text-sm">{title}</h4>
          <div className="space-y-3">
            {data.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background rounded-lg p-3 border border-border/50"
              >
                <h5 className="font-semibold text-foreground text-sm mb-1">{item.title}</h5>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export { ChatMessages };
