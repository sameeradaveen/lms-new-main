// API base URL configuration
export const getApiBaseUrl = (): string => {
  // In development, use relative URLs to leverage Vite proxy
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use the environment variable or fallback
  return import.meta.env.VITE_BACKEND_URL || '';
};

// Helper function to construct file URLs
export const getFileUrl = (filePath: string): string => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${filePath}`;
}; 