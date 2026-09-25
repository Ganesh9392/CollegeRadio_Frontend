import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface DownloadRecord {
  posterId: string;
  date: string;
}

export interface AIHistoryRecord {
  id: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  photoUri: string | null;
}

export interface LocalAppState {
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  isPremium: boolean;
  authMode: 'register' | 'login' | 'reset';
  userName: string;
  userMobile: string;
  userPhoto: string | null;
  selectedPhoto: string | null;
  likedPosterIds: string[];
  favoritePosterIds: string[];
  downloads: DownloadRecord[];
  aiHistory: AIHistoryRecord[];
  notificationsEnabled: boolean;
}

const STORAGE_KEY = 'editingworld.local.v1';

const DEFAULT_STATE: LocalAppState = {
  hasCompletedOnboarding: false,
  isLoggedIn: false,
  isPremium: false,
  authMode: 'register',
  userName: 'Ravi Kumar',
  userMobile: '+91 98765 43210',
  userPhoto: null,
  selectedPhoto: null,
  likedPosterIds: ['golden-diya', 'cinema-night'],
  favoritePosterIds: ['golden-diya', 'birthday-glow'],
  downloads: [{ posterId: 'city-leader', date: 'Yesterday' }],
  aiHistory: [
    { id: 'sample-done', date: 'Today', status: 'Completed', photoUri: null },
    { id: 'sample-progress', date: 'Yesterday', status: 'Processing', photoUri: null },
    { id: 'sample-failed', date: '12 May 2026', status: 'Failed', photoUri: null },
  ],
  notificationsEnabled: true,
};

interface AppStateContextValue extends LocalAppState {
  hydrated: boolean;
  patchState: (patch: Partial<LocalAppState>) => void;
  toggleLike: (posterId: string) => void;
  toggleFavorite: (posterId: string) => void;
  recordDownload: (posterId: string) => void;
  recordAIProcessing: (photoUri: string | null) => void;
  completeOnboarding: () => void;
  logOut: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LocalAppState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Partial<LocalAppState>;
            setState({ ...DEFAULT_STATE, ...parsed });
          } catch (error) {
            console.warn('Saved EditingWorld demo state could not be read.', error);
          }
        }
        setHydrated(true);
      })
      .catch((error: unknown) => {
        console.warn('EditingWorld could not load saved demo state.', error);
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error: unknown) => {
      console.warn('EditingWorld could not save demo state.', error);
    });
  }, [hydrated, state]);

  const patchState = useCallback((patch: Partial<LocalAppState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const toggleLike = useCallback((posterId: string) => {
    setState((current) => {
      const liked = current.likedPosterIds.includes(posterId);
      return {
        ...current,
        likedPosterIds: liked
          ? current.likedPosterIds.filter((id) => id !== posterId)
          : [...current.likedPosterIds, posterId],
      };
    });
  }, []);

  const toggleFavorite = useCallback((posterId: string) => {
    setState((current) => {
      const saved = current.favoritePosterIds.includes(posterId);
      return {
        ...current,
        favoritePosterIds: saved
          ? current.favoritePosterIds.filter((id) => id !== posterId)
          : [...current.favoritePosterIds, posterId],
      };
    });
  }, []);

  const recordDownload = useCallback((posterId: string) => {
    setState((current) => {
      const record: DownloadRecord = {
        posterId,
        date: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date()),
      };
      return {
        ...current,
        downloads: [record, ...current.downloads.filter((item) => item.posterId !== posterId)],
      };
    });
  }, []);

  const recordAIProcessing = useCallback((photoUri: string | null) => {
    setState((current) => ({
      ...current,
      aiHistory: [
        {
          id: `${Date.now()}`,
          date: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date()),
          status: 'Completed',
          photoUri,
        },
        ...current.aiHistory,
      ],
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((current) => ({
      ...current,
      hasCompletedOnboarding: true,
      isLoggedIn: true,
    }));
  }, []);

  const logOut = useCallback(() => {
    setState((current) => ({ ...current, isLoggedIn: false }));
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      ...state,
      hydrated,
      patchState,
      toggleLike,
      toggleFavorite,
      recordDownload,
      recordAIProcessing,
      completeOnboarding,
      logOut,
    }),
    [
      state,
      hydrated,
      patchState,
      toggleLike,
      toggleFavorite,
      recordDownload,
      recordAIProcessing,
      completeOnboarding,
      logOut,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider.');
  return context;
}