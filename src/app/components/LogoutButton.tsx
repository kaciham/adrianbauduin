'use client';

import { useAuth } from '../../contexts/AuthContext';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  onLogout?: () => void;
}

const LogoutButton = ({ 
  className = "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors", 
  children,
  onLogout 
}: LogoutButtonProps) => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children || (
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{loading ? 'Déconnexion...' : 'Se déconnecter'}</span>
        </span>
      )}
    </button>
  );
};

export default LogoutButton;