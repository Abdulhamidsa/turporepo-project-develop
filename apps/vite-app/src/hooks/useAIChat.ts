import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { showToast } from '@repo/ui/components/ui/toaster';
import { z } from 'zod';

import { request } from '../../api/request';
import { getErrorMessage } from '../../utils/getErrorMessage';

export type ChatStep = 'list-projects' | 'select-project' | 'choose-action' | 'finished';

export type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
};

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
  lastMode?: ActionOption | undefined;
};

export type ApiResponse = {
  success: boolean;
  step: ChatStep;
  message?: string;
  data?: ResultItem[];
};

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

export const useAIChat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState<ChatStep>('list-projects');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [data, setData] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [lastAction] = useState<ActionOption | null>(null);

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
    setData([]);
  };

  const sendMessage = async (message: string) => {
    if (loading || refreshLoading) return;

    const isRefresh = message.trim().toLowerCase() === 'refresh';

    try {
      chatMessageSchema.parse({ message });

      if (isRefresh && !lastAction) {
        showToast('No previous action to refresh. Try selecting an option first.', 'error');
        return;
      }

      if (isRefresh) {
        setRefreshLoading(true);
      } else {
        setLoading(true);
      }

      setChatMessages((prev) => [...prev, { role: 'user', text: message }]);

      const payload: ChatPayload = {
        step: chatStep,
        selectedProject,
        message,
        lastMode: isRefresh ? (lastAction ?? undefined) : undefined,
      };

      const resData = await request<ResultItem[]>('POST', ENDPOINTS.projects.projectAi, payload);

      setChatStep('finished');
      setData(resData);

      if (resData.length) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: `Here is what I found for **${selectedProject}**:` },
          {
            role: 'ai',
            text: `Would you like to do more with **${selectedProject}**?\nChoose one:\n- ideas\n- improve\n- similar\n- weaknesses\n- expansion\n- monetize\n- audience\n- rewrite`,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: `No new results for **${selectedProject}**.` },
        ]);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast('Invalid message format.', 'error');
      } else {
        showToast(getErrorMessage(error), 'error');
      }
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

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
