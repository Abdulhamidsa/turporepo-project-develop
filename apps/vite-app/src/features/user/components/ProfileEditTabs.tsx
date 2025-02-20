import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2 sm:mt-10">
      <TabsList className="flex justify-start space-x-4 bg-transparent pl-4">
        <TabsTrigger
          value="personalInfo"
          className={activeTab === 'personalInfo' ? 'border-primary border-b-2' : 'bg-transparent'}
        >
          Personal Info
        </TabsTrigger>
        <TabsTrigger
          value="credentials"
          className={activeTab === 'credentials' ? 'border-primary border-b-2' : 'bg-transparent'}
        >
          Credentials
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
