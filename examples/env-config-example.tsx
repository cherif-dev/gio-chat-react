import React from 'react';
import {
  ChatProvider,
  createConfigFromEnv,
  createConfigWithFallbacks,
  validateEnvVars,
} from '@genit-io/chat-react';

/**
 * Example showing how to use environment variables with the chat library
 * This is the RECOMMENDED approach for consuming applications
 */

// Example 1: Using environment variables directly
function AppWithEnvVars() {
  // In your .env file, you would have:
  // REACT_APP_API_BASE_URL=https://your-api.com
  // REACT_APP_API_KEY=your-api-key
  // REACT_APP_PROJECT_SLUG=your-project-slug
  // REACT_APP_SUPABASE_URL=https://your-project.supabase.co
  // REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
  // REACT_APP_SUPABASE_SCHEMA=public (optional)
  // REACT_APP_API_TIMEOUT=30000 (optional)

  try {
    const config = createConfigFromEnv(process.env);

    return (
      <ChatProvider config={config} autoInitialize>
        <div className="chat-app">
          <h1>Chat Application with Environment Variables</h1>
          {/* Your chat components go here */}
        </div>
      </ChatProvider>
    );
  } catch (error) {
    console.error('Configuration error:', error);
    return (
      <div className="error">
        <h2>Configuration Error</h2>
        <p>Please check your environment variables:</p>
        <ul>
          <li>REACT_APP_API_BASE_URL</li>
          <li>REACT_APP_API_KEY</li>
          <li>REACT_APP_PROJECT_SLUG</li>
          <li>REACT_APP_SUPABASE_URL</li>
          <li>REACT_APP_SUPABASE_ANON_KEY</li>
        </ul>
      </div>
    );
  }
}

// Example 2: Using environment variables with fallbacks for development
function AppWithFallbacks() {
  const config = createConfigWithFallbacks(process.env, {
    api: {
      baseUrl: 'http://localhost:3000', // fallback for development
      apiKey: 'dev-api-key', // fallback for development
      projectSlug: 'dev-project', // fallback for development
    },
    supabase: {
      url: 'http://localhost:54321', // fallback for development
      anon_key: 'dev-anon-key', // fallback for development
    },
  });

  return (
    <ChatProvider config={config} autoInitialize>
      <div className="chat-app">
        <h1>Chat Application with Fallbacks</h1>
        {/* Your chat components go here */}
      </div>
    </ChatProvider>
  );
}

// Example 3: Validating environment variables before initialization
function AppWithValidation() {
  const missingVars = validateEnvVars(process.env);

  if (missingVars.length > 0) {
    return (
      <div className="error">
        <h2>Missing Environment Variables</h2>
        <p>The following environment variables are required:</p>
        <ul>
          {missingVars.map(varName => (
            <li key={varName}>{varName}</li>
          ))}
        </ul>
        <p>Please add them to your .env file and restart the application.</p>
      </div>
    );
  }

  const config = createConfigFromEnv(process.env);

  return (
    <ChatProvider config={config} autoInitialize>
      <div className="chat-app">
        <h1>Chat Application with Validation</h1>
        {/* Your chat components go here */}
      </div>
    </ChatProvider>
  );
}

// Example 4: Custom environment variable names
function AppWithCustomEnvVars() {
  // If you want to use different environment variable names
  const customEnv = {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    API_KEY: process.env.REACT_APP_API_KEY,
    PROJECT_SLUG: process.env.REACT_APP_PROJECT_SLUG,
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    SUPABASE_SCHEMA: process.env.REACT_APP_SUPABASE_SCHEMA,
    API_TIMEOUT: process.env.REACT_APP_API_TIMEOUT,
  };

  const config = createConfigFromEnv(customEnv);

  return (
    <ChatProvider config={config} autoInitialize>
      <div className="chat-app">
        <h1>Chat Application with Custom Env Vars</h1>
        {/* Your chat components go here */}
      </div>
    </ChatProvider>
  );
}

export default AppWithEnvVars;
export { AppWithFallbacks, AppWithValidation, AppWithCustomEnvVars };
