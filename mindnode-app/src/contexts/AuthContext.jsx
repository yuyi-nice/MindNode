import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, isLoggedIn, removeToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo && isLoggedIn()) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  // 登录
  const login = (userInfo) => {
    setUser(userInfo);
  };

  // 登出
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // 更新用户信息
  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user_info', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
