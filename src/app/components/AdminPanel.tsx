'use client';

import { useState } from 'react';
import CreateProjectForm from './CreateProjectForm';
import ProjectManagement from './ProjectManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation tabs */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Administration Panel</h1>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create Project
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'manage'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manage Projects
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8">
        {activeTab === 'create' && <CreateProjectForm />}
        {activeTab === 'manage' && <ProjectManagement />}
      </main>
    </div>
  );
}