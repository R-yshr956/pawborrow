import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@repo/api";

type SupabaseSession = Awaited<
  ReturnType<typeof supabase.auth.getSession>
>["data"]["session"];

type SupabaseUser = NonNullable<SupabaseSession>["user"];

type UserProfileRecord = Record<string, unknown>;

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  accountCreated: string | null;
  avatarUrl: string | null;
};

type SignUpDetails = {
  displayName?: string;
  fullName?: string;
  phoneNumber?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  session: SupabaseSession;

  isLoading: boolean;
  loading: boolean;

  isAuthenticated: boolean;
  isLoggedIn: boolean;

  login: (email: string, password: string) => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;

  signUp: (
    email: string,
    password: string,
    details?: SignUpDetails,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

function getString(
  record: Record<string, unknown> | null | undefined,
  key: string,
): string | null {
  const value = record?.[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

function getFirstAvailableString(
  record: Record<string, unknown> | null | undefined,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = getString(record, key);

    if (value) {
      return value;
    }
  }

  return null;
}

function createNameFromParts(
  firstName: string | null,
  lastName: string | null,
): string | null {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  return name || null;
}

function createBaseAuthUser(authUser: SupabaseUser): AuthUser {
  const metadata = authUser.user_metadata as
    | Record<string, unknown>
    | undefined;

  const fullName = getFirstAvailableString(metadata, ["full_name", "name"]);

  const displayName = getFirstAvailableString(metadata, [
    "display_name",
    "preferred_username",
    "user_name",
    "name",
    "full_name",
  ]);

  const phoneNumber = getFirstAvailableString(metadata, [
    "phone_number",
    "phone",
  ]);

  const avatarUrl = getFirstAvailableString(metadata, [
    "avatar_url",
    "picture",
    "photo_url",
    "photoURL",
  ]);

  return {
    id: authUser.id,
    email: authUser.email?.trim() || "",
    displayName,
    fullName,
    phoneNumber: authUser.phone?.trim() || phoneNumber,
    accountCreated: authUser.created_at || null,
    avatarUrl,
  };
}

async function getProfileRecord(
  userId: string,
): Promise<UserProfileRecord | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Unable to load user profile:", error.message);

    return null;
  }

  return data as UserProfileRecord | null;
}

async function createAuthUser(authUser: SupabaseUser): Promise<AuthUser> {
  const baseUser = createBaseAuthUser(authUser);

  const profile = await getProfileRecord(authUser.id);

  if (!profile) {
    return baseUser;
  }

  const firstName = getFirstAvailableString(profile, [
    "first_name",
    "firstname",
  ]);

  const lastName = getFirstAvailableString(profile, ["last_name", "lastname"]);

  const profileFullName =
    getFirstAvailableString(profile, ["full_name", "name"]) ||
    createNameFromParts(firstName, lastName);

  const profileDisplayName = getFirstAvailableString(profile, [
    "display_name",
    "username",
  ]);

  const profilePhone = getFirstAvailableString(profile, [
    "phone_number",
    "contact_number",
    "phone",
  ]);

  const profileAvatar = getFirstAvailableString(profile, [
    "avatar_url",
    "profile_image_url",
    "image_url",
    "photo_url",
  ]);

  const profileCreatedAt = getFirstAvailableString(profile, [
    "created_at",
    "account_created",
  ]);

  const profileEmail = getFirstAvailableString(profile, ["email"]);

  return {
    id: baseUser.id,

    email: profileEmail || baseUser.email,

    displayName:
      profileDisplayName ||
      profileFullName ||
      baseUser.displayName ||
      baseUser.fullName,

    fullName: profileFullName || baseUser.fullName,

    phoneNumber: profilePhone || baseUser.phoneNumber,

    accountCreated: profileCreatedAt || baseUser.accountCreated,

    avatarUrl: profileAvatar || baseUser.avatarUrl,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<SupabaseSession>(null);

  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const mountedRef = useRef(true);

  const latestUserRequestRef = useRef(0);

  const loadAuthenticatedUser = useCallback(
    async (authUser: SupabaseUser | null) => {
      const requestId = latestUserRequestRef.current + 1;

      latestUserRequestRef.current = requestId;

      if (!authUser) {
        if (mountedRef.current) {
          setUser(null);
        }

        return;
      }

      const baseUser = createBaseAuthUser(authUser);

      if (mountedRef.current && requestId === latestUserRequestRef.current) {
        setUser(baseUser);
      }

      try {
        const completeUser = await createAuthUser(authUser);

        if (mountedRef.current && requestId === latestUserRequestRef.current) {
          setUser(completeUser);
        }
      } catch (error) {
        console.error("Failed to create authenticated user:", error);

        if (mountedRef.current && requestId === latestUserRequestRef.current) {
          setUser(baseUser);
        }
      }
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    await loadAuthenticatedUser(data.user);
  }, [loadAuthenticatedUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error("Email is required.");
      }

      if (!password) {
        throw new Error("Password is required.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      setSession(data.session);

      await loadAuthenticatedUser(data.user);
    },
    [loadAuthenticatedUser],
  );

  const signUp = useCallback(
    async (email: string, password: string, details: SignUpDetails = {}) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        throw new Error("Email is required.");
      }

      if (!password) {
        throw new Error("Password is required.");
      }

      const displayName = details.displayName?.trim() || null;

      const fullName = details.fullName?.trim() || null;

      const phoneNumber = details.phoneNumber?.trim() || null;

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,

        options: {
          data: {
            display_name: displayName,
            full_name: fullName,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) {
        throw error;
      }

      setSession(data.session);

      await loadAuthenticatedUser(data.user);
    },
    [loadAuthenticatedUser],
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    latestUserRequestRef.current += 1;

    setSession(null);
    setUser(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    async function initializeAuth() {
      setIsLoading(true);

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mountedRef.current) {
          return;
        }

        setSession(data.session);

        await loadAuthenticatedUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Failed to initialize authentication:", error);

        if (mountedRef.current) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mountedRef.current) {
        return;
      }

      setSession(nextSession);

      window.setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }

        void loadAuthenticatedUser(nextSession?.user ?? null).finally(() => {
          if (mountedRef.current) {
            setIsLoading(false);
          }
        });
      }, 0);
    });

    return () => {
      mountedRef.current = false;

      subscription.unsubscribe();
    };
  }, [loadAuthenticatedUser]);

  const value = useMemo<AuthContextValue>(() => {
    const authenticated = Boolean(session?.user);

    return {
      user,
      session,
      isLoading,
      loading: isLoading,
      isAuthenticated: authenticated,
      isLoggedIn: authenticated,
      login,
      signIn: login,
      signUp,
      logout,
      refreshUser,
    };
  }, [user, session, isLoading, login, signUp, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

export default AuthProvider;
