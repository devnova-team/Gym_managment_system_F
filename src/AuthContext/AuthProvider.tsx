import { createContext, useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = Cookies.get("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Stored user session could not be read", error);
        Cookies.remove("user");
      }
    }

    setIsAuthenticated(
      Cookies.get("isAuthenticated") === "true" && !!Cookies.get("token"),
    );
    setIsReady(true);
  }, []);

  const timeoutRef = useRef(null);
  const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes to match Access Token lifespan

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request falied", err);
    } finally {
      Cookies.remove("isAuthenticated");
      Cookies.remove("user");
      Cookies.remove("token");

      setUser(null);
      setIsAuthenticated(false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        console.log("Session expired due to inactivity");
        logout();
      }, INACTIVITY_LIMIT);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (isAuthenticated) {
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
      ];
      events.forEach((event) =>
        document.addEventListener(event, resetInactivityTimer),
      );
      resetInactivityTimer();

      return () => {
        events.forEach((event) =>
          document.removeEventListener(event, resetInactivityTimer),
        );
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [isAuthenticated, resetInactivityTimer]);

  const login = (response) => {
    if (!response) {
      return false;
    }

    // HttpOnly Cookie
    const expiry = 1 / 3; // 8 hours hard limit

    // ← CHANGED: الـ backend بيرجّع الـ role والـ gym_id مباشرة في data،
    // مفيش user object. فبنبني الـ user object من الـ data.
    const dataAccessToken = response?.data?.access_token;
    const role = response?.data?.role;
    const gymId = response?.data?.gym_id;

    if (!dataAccessToken) {
      return false;
    }

    const userData = {
      id: null, // ← CHANGED: الباك إند مش بيرجّعه
      name: null, // ← CHANGED: الباك إند مش بيرجّعه
      email: null, // ← CHANGED: الباك إند مش بيرجّعه
      role: role || null,
      gym_id: gymId || null,
    };

    Cookies.set("user", JSON.stringify(userData), { expires: expiry });
    Cookies.set("token", dataAccessToken, { expires: expiry });
    Cookies.set("isAuthenticated", "true", { expires: expiry });

    setUser(userData);
    setIsAuthenticated(true);

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isReady,
        user,
        login,
        logout,
        isOwner: user?.role === "owner",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
