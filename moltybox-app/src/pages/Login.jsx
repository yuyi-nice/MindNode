import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginApi(formData.email, formData.password);
      if (response.code === 0) {
        // 更新全局认证状态
        authLogin(response.data.user);
        // 登录成功，跳转到首页
        navigate('/');
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img alt="MoltyBox" className="h-8 w-auto" src="/images/logo.png" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold" style={{ color: '#0a0a0a' }}>
                欢迎登录
              </h1>
              <p className="mt-2 text-sm" style={{ color: '#525252' }}>
                登录您的 MoltyBox 账户
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#0a0a0a' }}
                >
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[#e5e5e5] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                  placeholder="请输入邮箱"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#0a0a0a' }}
                >
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[#e5e5e5] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                  placeholder="请输入密码"
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#e5e5e5] text-[#6366f1] focus:ring-[#6366f1]"
                  />
                  <span className="ml-2 text-sm" style={{ color: '#525252' }}>
                    记住我
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#6366f1' }}
                >
                  忘记密码？
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-full bg-[#0a0a0a] py-2.5 text-sm font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4" style={{ color: '#737373' }}>
                  还没有账户？
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="block w-full rounded-full border border-[#e5e5e5] py-2.5 text-center text-sm font-medium hover:bg-[#fafafa] transition-colors"
              style={{ color: '#0a0a0a' }}
            >
              注册新账户
            </Link>
          </div>

          {/* Additional Info */}
          <p className="mt-6 text-center text-xs" style={{ color: '#737373' }}>
            登录即表示您同意我们的{' '}
            <Link to="/privacy-terms" className="underline hover:text-[#0a0a0a]">
              隐私政策
            </Link>
            {' '}和{' '}
            <Link to="/privacy-terms" className="underline hover:text-[#0a0a0a]">
              服务条款
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
