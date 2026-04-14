import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors ${
        isActive
          ? 'bg-[#eef2ff] text-[#6366f1]'
          : 'text-[#525252] hover:bg-[#f5f5f5]'
      }`}
    >
      {children}
    </Link>
  );
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar Navigation */}
      <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-[240px] border-r border-[#e5e5e5] bg-white">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-[#e5e5e5] p-6">
            <h2 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>控制台</h2>
            <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>管理工作区和设置</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <NavItem to="/dashboard">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              概览
            </NavItem>
            <NavItem to="/dashboard/api-keys">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              API 密钥
            </NavItem>
            <NavItem to="/dashboard/billing">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              账单
            </NavItem>
            <NavItem to="/dashboard/usage">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              使用历史
            </NavItem>
            <NavItem to="/dashboard/referrals">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              邀请记录
            </NavItem>
          </nav>

          {/* Footer */}
          <div className="border-t border-[#e5e5e5] p-4">
            <Link to="/dashboard/settings" className="flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-[14px] font-medium text-[#525252] hover:bg-[#f5f5f5] transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              设置
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[240px] flex-1 bg-[#f5f5f5] pt-16">
        <div className="container mx-auto max-w-[1200px] px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
