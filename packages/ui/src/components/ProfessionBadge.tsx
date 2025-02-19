import { Box, Code, Layout, Monitor, Server } from 'lucide-react';

const professionIcons: Record<string, JSX.Element> = {
  'Software Engineer': <Code className="mr-1 h-4 w-4" />,
  'UI/UX Designer': <Layout className="mr-1 h-4 w-4" />,
  'Web Developer': <Monitor className="mr-1 h-4 w-4" />,
  'Product Designer': <Box className="mr-1 h-4 w-4" />,
  'DevOps Engineer': <Server className="mr-1 h-4 w-4" />,
};

const professionColors: Record<string, string> = {
  'Software Engineer': 'text-blue-500',
  'UI/UX Designer': 'text-pink-500',
  'Web Developer': 'text-green-500',
  'Product Designer': 'text-purple-500',
  'DevOps Engineer': 'text-yellow-500',
};

export const ProfessionBadge = ({ profession }: { profession: string }) => {
  return (
    <div className={`flex items-center text-xs ${professionColors[profession] ?? 'text-gray-500'}`}>
      {professionIcons[profession] ?? <Monitor className="mr-1 h-4 w-4" />}
      {profession}
    </div>
  );
};
