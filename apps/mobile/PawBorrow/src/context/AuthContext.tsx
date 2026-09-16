import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface UserProfile {
  email: string;
  displayName: string;
  fullName: string;
  phoneNumber: string;
  accountCreated: string;
}

export const getUserScopedStorageKey = (prefix: string, email?: string | null) => {
  const normalizedEmail = (email ?? 'guest').trim().toLowerCase();
  const safeEmail = normalizedEmail.replace(/[^a-z0-9@._-]/g, '_') || 'guest';
  return `${prefix}-${safeEmail}`;
};

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasPersistedSession = window.localStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    if (!hasPersistedSession) {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    window.localStorage.removeItem(USER_STORAGE_KEY);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

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