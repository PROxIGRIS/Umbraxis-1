import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "admin_session_token";

export function useAdminAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getSessionToken = useCallback(() => {
    return sessionStorage.getItem(SESSION_KEY);
  }, []);

  const setSessionToken = useCallback((token: string) => {
    sessionStorage.setItem(SESSION_KEY, token);
    setIsAuthenticated(true);
  }, []);

  const clearSessionToken = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const validateSession = useCallback(async () => {
    const token = getSessionToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error } = await (supabase.rpc as any)("validate_admin_session", {
        input_token: token,
      });

      if (error || !data) {
        clearSessionToken();
        setIsLoading(false);
        return false;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      clearSessionToken();
      setIsLoading(false);
      return false;
    }
  }, [getSessionToken, clearSessionToken]);

  const logout = useCallback(async () => {
    try {
      await (supabase.rpc as any)("admin_logout");
    } catch {}
    clearSessionToken();
    navigate("/admin/login");
  }, [clearSessionToken, navigate]);

  const requireAdmin = useCallback(async () => {
    const ok = await validateSession();
    if (!ok) navigate("/admin/login");
    return ok;
  }, [validateSession, navigate]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return {
    isAuthenticated,
    isLoading,
    setSessionToken,
    clearSessionToken,
    logout,
    validateSession,
    requireAdmin,
  };
}
