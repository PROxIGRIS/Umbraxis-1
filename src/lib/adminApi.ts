// src/lib/adminApi.ts
// Admin API utilities that include session token authentication

const SESSION_KEY = 'admin_session_token';
const SUPABASE_URL = 'https://awrrsplzkonpzzzbrifz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cnJzcGx6a29ucHp6emJyaWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTgzODgsImV4cCI6MjA4MTQ3NDM4OH0.epf9BXRJi4ig4fuNdbxlhRuDEeg9FflDHvcGuyeGB7o';

function getSessionToken(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Invoke an admin edge function with automatic session token authentication
 */
export async function invokeAdminFunction<T = any>(
  functionName: string,
  body: Record<string, any> = {}
): Promise<AdminApiResponse<T>> {
  const sessionToken = getSessionToken();
  
  if (!sessionToken) {
    return { success: false, error: 'No admin session. Please login.' };
  }

  // Map legacy function names to unified admin-products endpoint with actions
  let actualEndpoint = functionName;
  let requestBody = body;
  
  const actionMap: Record<string, string> = {
    'admin-upsert-product': 'upsert',
    'admin-delete-product': 'delete',
    'admin-update-product-field': 'update-field',
    'admin-bulk-delete-products': 'bulk-delete',
    'admin-csv-import': 'csv-import',
  };
  
  if (actionMap[functionName]) {
    actualEndpoint = 'admin-products';
    requestBody = { action: actionMap[functionName], ...body };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${actualEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-admin-session': sessionToken,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle session errors specifically
      if (response.status === 401 || response.status === 403) {
        // Clear invalid session
        sessionStorage.removeItem(SESSION_KEY);
        return { 
          success: false, 
          error: data.error || 'Session expired. Please login again.' 
        };
      }
      return { success: false, error: data.error || 'Request failed' };
    }

    return data;
  } catch (error: any) {
    console.error(`Admin function ${functionName} error:`, error);
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Upload an image through the admin edge function
 */
export async function uploadAdminImage(file: File): Promise<AdminApiResponse<{ url: string }>> {
  const sessionToken = getSessionToken();
  
  if (!sessionToken) {
    return { success: false, error: 'No admin session. Please login.' };
  }

  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-upload-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'x-admin-session': sessionToken,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileData: base64,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem(SESSION_KEY);
        return { success: false, error: 'Session expired. Please login again.' };
      }
      return { success: false, error: data.error || 'Upload failed' };
    }

    return data;
  } catch (error: any) {
    console.error('Image upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
