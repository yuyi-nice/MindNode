import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
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

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为 6 位');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      if (response.code === 0) {
        // 注册成功，更新全局认证状态
        authLogin(response.data.user);
        // 跳转到首页
        navigate('/');
      } else {
        setError(response.message || '注册失败');
      }
    } catch (err) {
      setError(err.message || '注册失败，请稍后重试');
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
              <img alt="MindNode" className="h-8 w-auto" src="/images/logo.png" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold" style={{ color: '#0a0a0a' }}>
                创建账户
              </h1>
              <p className="mt-2 text-sm" style={{ color: '#525252' }}>
                注册 MindNode 账户
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Register Form */}
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

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#0a0a0a' }}
                >
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[#e5e5e5] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                  placeholder="请输入用户名"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[#e5e5e5] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                  placeholder="请输入密码（至少 6 位）"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#0a0a0a' }}
                >
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[#e5e5e5] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
                  placeholder="请再次输入密码"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-[#e5e5e5] text-[#6366f1] focus:ring-[#6366f1]"
                />
                <label htmlFor="terms" className="ml-2 text-sm" style={{ color: '#525252' }}>
                  我已阅读并同意{' '}
                  <Link to="/privacy-terms" className="underline hover:text-[#0a0a0a]">
                    隐私政策
                  </Link>
                  {' '}和{' '}
                  <Link to="/privacy-terms" className="underline hover:text-[#0a0a0a]">
                    服务条款
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-full bg-[#0a0a0a] py-2.5 text-sm font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '注册中...' : '注册'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4" style={{ color: '#737373' }}>
                  已有账户？
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="block w-full rounded-full border border-[#e5e5e5] py-2.5 text-center text-sm font-medium hover:bg-[#fafafa] transition-colors"
              style={{ color: '#0a0a0a' }}
            >
              登录
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
