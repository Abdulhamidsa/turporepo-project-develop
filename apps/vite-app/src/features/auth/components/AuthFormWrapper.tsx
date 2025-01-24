import React from "react";

interface AuthFormWrapperProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, children, footer }) => {
  return (
    <div className="bg-card text-card-foreground border-0 shadow-none w-full max-w-md mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
      {children}
      <div className="text-center mt-4">{footer}</div>
    </div>
  );
};
