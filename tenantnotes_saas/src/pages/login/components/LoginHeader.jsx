import React from 'react';

const LoginHeader = () => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Welcome Back
      </h2>
      <p className="text-muted-foreground">
        Sign in to access your workspace and manage your notes securely
      </p>
    </div>
  );
};

export default LoginHeader;