import React from 'react';

const SimpleLayout = ({ children }) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <header className="bg-blue-600 shadow p-4">
          <h1 className="text-xl font-bold text-center text-white">NEC Placement Portal</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default SimpleLayout;
