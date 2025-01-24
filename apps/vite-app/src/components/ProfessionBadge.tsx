import { Code, Layout, Monitor, Box, Server } from "lucide-react";

const professionIcons: Record<string, JSX.Element> = {
  "Software Engineer": <Code className="w-4 h-4 mr-1" />,
  "UI/UX Designer": <Layout className="w-4 h-4 mr-1" />,
  "Web Developer": <Monitor className="w-4 h-4 mr-1" />,
  "Product Designer": <Box className="w-4 h-4 mr-1" />,
  "DevOps Engineer": <Server className="w-4 h-4 mr-1" />,
};

const professionColors: Record<string, string> = {
  "Software Engineer": "text-blue-500",
  "UI/UX Designer": "text-pink-500",
  "Web Developer": "text-green-500",
  "Product Designer": "text-purple-500",
  "DevOps Engineer": "text-yellow-500",
};

export const ProfessionBadge = ({ profession }: { profession: string }) => {
  return (
    <div className={`flex items-center text-xs ${professionColors[profession] ?? "text-gray-500"}`}>
      {professionIcons[profession] ?? <Monitor className="w-4 h-4 mr-1" />}
      {profession}
    </div>
  );
};
