import React from 'react';

interface AuthFormWrapperProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, children, footer }) => {
  return (
    <div className="bg-card text-card-foreground mx-auto w-full max-w-md rounded-lg border-0 shadow-none md:p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">{title}</h1>
      {children}
      <div className="mt-4 text-center">{footer}</div>
    </div>
  );
};
