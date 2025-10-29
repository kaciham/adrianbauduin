'use client';

import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from './LogoutButton';

const UserStatus = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-gray-600 text-sm">Non connecté</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
          </span>
        </div>
        
        <LogoutButton 
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        />
      </div>
    </div>
  );
};

export default UserStatus;