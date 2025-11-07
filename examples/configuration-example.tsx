import React from 'react';
import { ChatProvider, GlobalConfig } from '@genit-io/chat-react';

/**
 * Example showing how to configure the chat library with the new configuration system
 * This replaces the old process.env approach with a proper configuration service
 */

// Example configuration - in a real app, you would get these from your environment
// or configuration management system
const chatConfig: GlobalConfig = {
  api: {
    baseUrl: 'https://your-api.com',
    apiKey: 'your-api-key',
    projectSlug: 'your-project-slug',
    timeout: 30000, // 30 seconds
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anon_key: 'your-supabase-anon-key',
    schema: 'public', // optional, defaults to 'public'
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    },
  },
};

function ChatApp() {
  return (
    <ChatProvider config={chatConfig} autoInitialize>
      <div className="chat-app">
        <h1>Chat Application</h1>
        {/* Your chat components go here */}
      </div>
    </ChatProvider>
  );
}

/**
 * Alternative: Manual initialization
 */
function ManualInitializationExample() {
  const handleInitialize = () => {
    // You can also initialize manually if needed
    const { configService } = require('@genit-io/chat-react');

    try {
      configService.initialize(chatConfig);
      console.log('Configuration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize configuration:', error);
    }
  };

  return (
    <div>
      <button onClick={handleInitialize}>Initialize Configuration</button>
    </div>
  );
}

/**
 * Environment-based configuration example
 * This shows how you might get configuration from environment variables
 * in your application (not in the library itself)
 */
function getConfigFromEnvironment(): GlobalConfig {
  // In your application, you can read from environment variables
  // The library itself doesn't access process.env anymore
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';
  const apiKey = process.env.REACT_APP_API_KEY || '';
  const projectSlug = process.env.REACT_APP_PROJECT_SLUG || '';
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

  return {
    api: {
      baseUrl: apiBaseUrl,
      apiKey,
      projectSlug,
      timeout: 30000,
    },
    supabase: {
      url: supabaseUrl,
      anon_key: supabaseKey,
    },
  };
}

export default ChatApp;
export { ManualInitializationExample, getConfigFromEnvironment };
