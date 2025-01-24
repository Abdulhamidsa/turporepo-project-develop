import { Outlet } from "react-router-dom";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div>
      <main>
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
