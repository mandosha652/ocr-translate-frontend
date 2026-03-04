'use client';

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { toast } from 'sonner';

import {
  useApiKeys,
  useCreateApiKey,
  useRenameApiKey,
  useRevokeApiKey,
} from '@/hooks';

interface State {
  dialogOpen: boolean;
  newKeyName: string;
  newKeyExpiryDays: string;
  newKeyShown: string | null;
  copied: boolean;
  revokeConfirmId: string | null;
  renamingKeyId: string | null;
  renameValue: string;
  rotatingKeyId: string | null;
}

type Action =
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SET_DIALOG_OPEN'; open: boolean }
  | { type: 'SET_NEW_KEY_NAME'; value: string }
  | { type: 'SET_NEW_KEY_EXPIRY'; value: string }
  | { type: 'KEY_CREATED'; key: string }
  | { type: 'SET_COPIED'; value: boolean }
  | { type: 'SET_REVOKE_CONFIRM'; id: string | null }
  | { type: 'START_RENAME'; keyId: string; name: string }
  | { type: 'CANCEL_RENAME' }
  | { type: 'SET_RENAME_VALUE'; value: string }
  | { type: 'RENAME_DONE' }
  | { type: 'SET_ROTATING'; keyId: string | null };

const initialState: State = {
  dialogOpen: false,
  newKeyName: '',
  newKeyExpiryDays: '',
  newKeyShown: null,
  copied: false,
  revokeConfirmId: null,
  renamingKeyId: null,
  renameValue: '',
  rotatingKeyId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        dialogOpen: false,
        newKeyName: '',
        newKeyExpiryDays: '',
        newKeyShown: null,
        copied: false,
      };
    case 'SET_DIALOG_OPEN':
      return action.open ? { ...state, dialogOpen: true } : state;
    case 'SET_NEW_KEY_NAME':
      return { ...state, newKeyName: action.value };
    case 'SET_NEW_KEY_EXPIRY':
      return { ...state, newKeyExpiryDays: action.value };
    case 'KEY_CREATED':
      return { ...state, newKeyShown: action.key };
    case 'SET_COPIED':
      return { ...state, copied: action.value };
    case 'SET_REVOKE_CONFIRM':
      return { ...state, revokeConfirmId: action.id };
    case 'START_RENAME':
      return {
        ...state,
        renamingKeyId: action.keyId,
        renameValue: action.name,
      };
    case 'CANCEL_RENAME':
      return { ...state, renamingKeyId: null, renameValue: '' };
    case 'SET_RENAME_VALUE':
      return { ...state, renameValue: action.value };
    case 'RENAME_DONE':
      return { ...state, renamingKeyId: null, renameValue: '' };
    case 'SET_ROTATING':
      return { ...state, rotatingKeyId: action.keyId };
    default:
      return state;
  }
}

interface ApiKeysContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  apiKeys: ReturnType<typeof useApiKeys>['data'];
  isLoadingKeys: boolean;
  keysError: Error | null;
  refetchKeys: () => void;
  createApiKey: ReturnType<typeof useCreateApiKey>;
  revokeApiKey: ReturnType<typeof useRevokeApiKey>;
  renameApiKey: ReturnType<typeof useRenameApiKey>;
  handleCreateKey: () => Promise<void>;
  handleCopyKey: (key: string) => Promise<void>;
  handleRevokeKey: (keyId: string) => Promise<void>;
  handleConfirmRename: (keyId: string) => Promise<void>;
  handleRotateKey: (keyId: string, keyName: string) => Promise<void>;
}

const ApiKeysContext = createContext<ApiKeysContextValue | null>(null);

export function useApiKeysContext() {
  const ctx = useContext(ApiKeysContext);
  if (!ctx)
    throw new Error('useApiKeysContext must be used within ApiKeysProvider');
  return ctx;
}

export function ApiKeysProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    data: apiKeys,
    isLoading: isLoadingKeys,
    error: keysError,
    refetch: refetchKeys,
  } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const renameApiKey = useRenameApiKey();

  const handleCreateKey = useCallback(async () => {
    try {
      const expiryNum = parseInt(state.newKeyExpiryDays, 10);
      const result = await createApiKey.mutateAsync({
        name: state.newKeyName || 'Default',
        ...(expiryNum > 0 ? { expires_in_days: expiryNum } : {}),
      });
      dispatch({ type: 'KEY_CREATED', key: result.key });
      try {
        await navigator.clipboard.writeText(result.key);
        dispatch({ type: 'SET_COPIED', value: true });
        toast.success('Key created and copied to clipboard');
      } catch {
        toast.warning('Key created — copy it manually before closing');
      }
    } catch {
      toast.error("Couldn't create the key — please try again");
    }
  }, [state.newKeyName, state.newKeyExpiryDays, createApiKey]);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyKey = useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      dispatch({ type: 'SET_COPIED', value: true });
      toast.success('Copied!');
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(
        () => dispatch({ type: 'SET_COPIED', value: false }),
        2000
      );
    } catch {
      toast.error('Copy failed — select the key and copy it manually');
    }
  }, []);

  const handleRevokeKey = useCallback(
    async (keyId: string) => {
      dispatch({ type: 'SET_REVOKE_CONFIRM', id: null });
      let undone = false;
      const toastId = toast('API key revoked', {
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            undone = true;
            toast.dismiss(toastId);
            toast.info('Revocation undone — key is still active');
          },
        },
      });
      await new Promise(resolve => setTimeout(resolve, 5500));
      if (undone) return;
      try {
        await revokeApiKey.mutateAsync(keyId);
      } catch {
        toast.error("Couldn't revoke the key — please try again");
      }
    },
    [revokeApiKey]
  );

  const handleConfirmRename = useCallback(
    async (keyId: string) => {
      const trimmed = state.renameValue.trim();
      if (!trimmed) return;
      try {
        await renameApiKey.mutateAsync({ keyId, data: { name: trimmed } });
        toast.success('Key renamed');
      } catch {
        toast.error("Couldn't rename the key — please try again");
      } finally {
        dispatch({ type: 'RENAME_DONE' });
      }
    },
    [state.renameValue, renameApiKey]
  );

  const handleRotateKey = useCallback(
    async (keyId: string, keyName: string) => {
      dispatch({ type: 'SET_ROTATING', keyId });
      try {
        await revokeApiKey.mutateAsync(keyId);
        const result = await createApiKey.mutateAsync({ name: keyName });
        dispatch({ type: 'KEY_CREATED', key: result.key });
        dispatch({ type: 'OPEN_DIALOG' });
        toast.success('Key rotated — copy your new key before closing');
      } catch {
        toast.error("Couldn't rotate the key — please try again");
      } finally {
        dispatch({ type: 'SET_ROTATING', keyId: null });
      }
    },
    [revokeApiKey, createApiKey]
  );

  const value: ApiKeysContextValue = {
    state,
    dispatch,
    apiKeys,
    isLoadingKeys,
    keysError,
    refetchKeys: () => refetchKeys(),
    createApiKey,
    revokeApiKey,
    renameApiKey,
    handleCreateKey,
    handleCopyKey,
    handleRevokeKey,
    handleConfirmRename,
    handleRotateKey,
  };

  return (
    <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>
  );
}
