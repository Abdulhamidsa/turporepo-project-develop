import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';

export type ChatStep = 'list-projects' | 'select-project' | 'choose-action' | 'finished';

export type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
};
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
export type ResultItem = { title: string; description: string };

export type ActionOption =
  | 'ideas'
  | 'improve'
  | 'similar'
  | 'weaknesses'
  | 'expansion'
  | 'monetize'
  | 'audience'
  | 'rewrite';

export type ChatPayload = {
  step: ChatStep;
  selectedProject: string | null;
  message: string;
  lastMode?: ActionOption;
};

export type ApiResponse = {
  success: boolean;
  step: ChatStep;
  message?: string;
  data?: ResultItem[];
};

/**
 * Hook for managing AI Chat functionality with refresh support and proper types.
 */
export const useAIChat = () => {
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatStep, setChatStep] = useState<ChatStep>('list-projects');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [data, setData] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<ActionOption | null>(null);

  const startChat = () => {
    setChatOpen(true);
    setChatStep('list-projects');
    setChatMessages([
      { role: 'ai', text: 'Here are your projects. Select one to discuss further:' },
    ]);
  };

  const selectProject = (project: string) => {
    setSelectedProject(project);
    setChatStep('choose-action');
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', text: `I want to discuss: ${project}` },
      { role: 'ai', text: `What would you like to do with **${project}**?` },
    ]);
  };

  const goBack = () => {
    setChatStep('list-projects');
    setData([]); // Clear results when going back
  };

  const sendMessage = async (message: string) => {
    const isRefresh = message.trim().toLowerCase() === 'refresh';

    if (isRefresh) {
      if (!lastAction) {
        console.warn('⚠️ Refresh failed: No previous action to refresh.');
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Error: No previous action to refresh. Try selecting an option first.',
          },
        ]);
        return;
      }
      setRefreshLoading(true);
      setData([]); // 💥 Clear previous results before refreshing
    } else {
      setLoading(true);
    }

    setChatMessages((prev) => [...prev, { role: 'user', text: message }]);

    // **Ensure lastAction is properly set when sending a new message**
    const validActions: ActionOption[] = [
      'ideas',
      'improve',
      'similar',
      'weaknesses',
      'expansion',
      'monetize',
      'audience',
      'rewrite',
    ];
    if (!isRefresh && validActions.includes(message as ActionOption)) {
      setLastAction(message as ActionOption);
    }

    const payload: ChatPayload = {
      step: chatStep,
      selectedProject,
      message,
    };

    if (isRefresh && lastAction) {
      payload.lastMode = lastAction;
    }
    try {
      const response = await fetch(ENDPOINTS.projects.projectAi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const resData: ApiResponse = await response.json();
      if (resData.success) {
        setChatStep(resData.step);
        const aiResponseText =
          resData.message ||
          (resData.data?.length
            ? `Here is what I found for **${selectedProject}**:`
            : `No new results for **${selectedProject}**.`);

        setChatMessages((prev) => [...prev, { role: 'ai', text: aiResponseText }]);
        setData(resData.data || []);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: resData.message || 'I didn’t understand that. Please choose a valid option.',
          },
        ]);
      }
    } catch (error) {
      console.error('⚠️ AI Chat Error:', error);
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Error connecting to AI service.' }]);
    }

    if (isRefresh) {
      setRefreshLoading(false);
    } else {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     console.log('📌 Updated Data:', data);
  //   }, [data]);

  return {
    chatOpen,
    chatStep,
    selectedProject,
    chatMessages,
    data,
    loading,
    refreshLoading,
    startChat,
    selectProject,
    sendMessage,
    setChatOpen,
    goBack,
  };
};
