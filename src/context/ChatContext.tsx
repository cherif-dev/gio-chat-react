import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { initializeApiClient, initializeRealtimeService } from '../services';
import { Contact, Conversation, ProjectConfig } from '../types';
import { initializeConfigService } from '../services/config';

/**
 * Chat context state interface
 */
export interface ChatContextState {
  // Configuration
  isInitialized: boolean;

  // Current user/contact
  currentContact: Contact | null;
  setCurrentContact: (contact: Contact | null) => void;

  // Current conversation
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // Initialization
  initialize: () => void;
  isRealtimeEnabled: boolean;
  projectConfig: ProjectConfig | null;
}

/**
 * Chat context
 */
const ChatContext = createContext<ChatContextState | undefined>(undefined);

/**
 * Chat provider props
 */
export interface ChatProviderProps {
  children: React.ReactNode;
  config?: ProjectConfig;
  autoInitialize?: boolean;
}

/**
 * Chat provider component
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ config, children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
  const [projectConfig] = useState<ProjectConfig | null>(config || null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const setSidebarOpen = useCallback((isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  }, []);

  const initialize = useCallback(async () => {
    try {
      // Initialize configuration service
      initializeApiClient(projectConfig!);
      await initializeConfigService(projectConfig!);
      // Initialize Supabase real-time if config provided
      initializeRealtimeService();
      setIsRealtimeEnabled(true);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  }, [projectConfig]);

  // Auto-initialize if configs are provided
  useEffect(() => {
    if (config && !isInitialized) {
      //initialize(config);
    }
  }, [config, isInitialized, initialize]);

  const value: ChatContextState = {
    isInitialized,
    currentContact,
    setCurrentContact,
    currentConversation,
    setCurrentConversation,
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    initialize,
    isRealtimeEnabled,
    projectConfig,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Hook to use chat context
 */
export function useChatContext(): ChatContextState {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }

  return context;
}

/**
 * Hook to check if chat is initialized
 */
export function useIsInitialized(): boolean {
  const { isInitialized } = useChatContext();
  return isInitialized;
}

/**
 * Hook to get current contact
 */
export function useCurrentContact(): [Contact | null, (contact: Contact | null) => void] {
  const { currentContact, setCurrentContact } = useChatContext();
  return [currentContact, setCurrentContact];
}

/**
 * Hook to get current conversation
 */
export function useCurrentConversation(): [
  Conversation | null,
  (conversation: Conversation | null) => void,
] {
  const { currentConversation, setCurrentConversation } = useChatContext();
  return [currentConversation, setCurrentConversation];
}

/**
 * Hook to manage sidebar state
 */
export function useSidebar(): {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
} {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useChatContext();

  return {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    setOpen: setSidebarOpen,
  };
}

export function useProjectConfig(): ProjectConfig | null {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useProjectConfig must be used within a ChatProvider');
  }
  const { projectConfig } = context;
  if (!projectConfig) {
    throw new Error('Project config not initialized. Call initialize() first.');
  }
  return projectConfig;
}
