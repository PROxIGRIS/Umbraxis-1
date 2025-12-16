// src/lib/adminApi.ts
// Stable Admin API utilities with persistent session (localStorage)

const SESSION_KEY = 'admin_session_token';
const SUPABASE_URL = 'https://awrrsplzkonpzzzbrifz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YmtxbWVma2h4YXlxdXZvdHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUxNzcsImV4cCI6MjA4MDc4MTE3N30.qQVx-qYKtfZ4Anj8lCrRYoztrfFeWD9fTHXvc0dU150';

// Persistent session
function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setAdminSession(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY);
}

export interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Core admin API handler
 */
async function adminRequest(endpoint: string, body: Record<string, any>) {
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return { success: false, error: 'No admin session. Please login.' };
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-admin-session': sessionToken
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    return data;
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Legacy → unified admin functions
 */
export async function invokeAdminFunction<T = any>(
  functionName: string,
  body: Record<string, any> = {}
): Promise<AdminApiResponse<T>> {

  const actionMap: Record<string, string> = {
    'admin-upsert-product': 'upsert',
    'admin-delete-product': 'delete',
    'admin-update-product-field': 'update-field',
    'admin-bulk-delete-products': 'bulk-delete',
    'admin-csv-import': 'csv-import'
  };

  let endpoint = functionName;
  let requestBody = body;

  if (actionMap[functionName]) {
    endpoint = 'admin-products';
    requestBody = { action: actionMap[functionName], ...body };
  }

  return adminRequest(endpoint, requestBody);
}

/**
 * Image upload
 */
export async function uploadAdminImage(
  file: File
): Promise<AdminApiResponse<{ url: string }>> {

  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return { success: false, error: 'No admin session. Please login.' };
  }

  try {
    const base64 = await fileToBase64(file);

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/admin-upload-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'x-admin-session': sessionToken
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileData: base64
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Upload failed' };
    }

    return data;
  } catch (error: any) {
    return { success: false, error: error.message || 'Upload failed' };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
