import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  email: string;
  displayName: string;
  fullName: string;
  phoneNumber: string;
  accountCreated: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (profile?: Partial<UserProfile>) => void;
  logout: () => void;
}

const SESSION_STORAGE_KEY = 'pawborrow-session';
const USER_STORAGE_KEY = 'pawborrow-user';

export const defaultUserProfile: UserProfile = {
  email: 'test@pawborrow.com',
  displayName: 'Sarah',
  fullName: 'Sarah',
  phoneNumber: '+62 812 3456 7890',
  accountCreated: 'August 2024',
};

const readStoredUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;

  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as Partial<UserProfile>;
    return {
      ...defaultUserProfile,
      ...parsedUser,
    };
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  });
  const [user, setUser] = useState<UserProfile | null>(() => readStoredUser());

  const login = (profile: Partial<UserProfile> = {}) => {
    const nextUser = {
      ...defaultUserProfile,
      ...readStoredUser(),
      ...profile,
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      window.localStorage.setItem(SESSION_STORAGE_KEY, 'true');
    }

    setUser(nextUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }

    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};