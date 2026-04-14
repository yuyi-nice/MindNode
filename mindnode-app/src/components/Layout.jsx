import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/api';

const NavItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
        isActive
          ? 'text-[#0a0a0a] bg-[#eef2ff]'
          : 'text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff]'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNav = ({ isOpen, onClose }) => {
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose}></div>
          <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-[#e5e5e5] shadow-lg lg:hidden">
            <nav className="w-full px-4 py-2 space-y-0.5">
              <Link to="/moltybox" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">MindNode</Link>
              <Link to="/skills" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">技能库</Link>
              <Link to="/hardware" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">盒子</Link>
              <Link to="/models" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">模型</Link>
              <Link to="/partner" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">合伙人</Link>
              <Link to="/referral-program" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">推荐官计划</Link>
              {/* 资源下拉 */}
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md"
              >
                资源
                <svg className={`h-4 w-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {resourcesOpen && (
                <div className="pl-3 space-y-0.5">
                  <Link to="/agents" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">智能体</Link>
                  <Link to="/pricing" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">定价</Link>
                  <Link to="/documentation" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">文档</Link>
                  <Link to="/blog" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">博客</Link>
                </div>
              )}
              <Link to="/enterprise" onClick={onClose} className="block px-3 py-2 text-[14px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] rounded-md">企业版</Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

const ResourcesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] flex items-center gap-1">
        资源
        <svg className="lucide lucide-chevron-down h-3 w-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 rounded-[10px] border border-[#e5e5e5] bg-white py-2 shadow-lg">
          <Link to="/agents" className="block px-4 py-2 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a]">
            智能体
          </Link>
          <Link to="/pricing" className="block px-4 py-2 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a]">
            定价
          </Link>
          <Link to="/documentation" className="block px-4 py-2 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a]">
            文档
          </Link>
          <Link to="/blog" className="block px-4 py-2 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a]">
            博客
          </Link>
        </div>
      )}
    </div>
  );
};

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  // 生成随机头像 URL (使用 DiceBear 头像服务)
  const getAvatarUrl = (email) => {
    if (!email) return '';
    // 使用邮箱作为种子生成一致的随机头像
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
  };

  const handleLogout = () => {
    logout();
    authLogout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 点击外部关闭菜单
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#0a0a0a] text-[#fafafa] hover:bg-[#0a0a0a]/90 transition-colors cursor-pointer"
      >
        登录
      </Link>
    );
  }

  const avatarUrl = getAvatarUrl(user.email);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative cursor-pointer"
      >
        <img
          src={avatarUrl}
          alt={user.username || user.email}
          className="h-8 w-8 rounded-full border border-[#e5e5e5] bg-white object-cover"
        />
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClickOutside}></div>
          <div className="absolute right-0 mt-2 z-50 w-64 rounded-[14px] border border-[#e5e5e5] bg-white py-3 shadow-xl">
          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-[#f5f5f5]">
            <img
              src={avatarUrl}
              alt={user.username || user.email}
              className="h-10 w-10 rounded-full border border-[#e5e5e5] bg-white object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#0a0a0a' }}>
                {user.username || user.full_name || '用户'}
              </p>
              <p className="text-xs truncate" style={{ color: '#525252' }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              控制台
            </Link>
            <Link to="/dashboard/api-keys" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              API 密钥
            </Link>
            <Link to="/dashboard/billing" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              账单
            </Link>
            <Link to="/dashboard/usage" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#525252] hover:bg-[#eef2ff] hover:text-[#0a0a0a] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              使用历史
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-[#f5f5f5] my-2"></div>

          {/* Theme */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#525252]">Theme</span>
              <div className="flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-[#f5f5f5] p-1">
                <button className="p-1.5 rounded-full hover:bg-white transition-colors" title="Light">
                  <svg className="h-3.5 w-3.5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-full hover:bg-white transition-colors" title="System">
                  <svg className="h-3.5 w-3.5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M12 17v4M8 21h8" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-full hover:bg-white transition-colors" title="Dark">
                  <svg className="h-3.5 w-3.5 text-[#525252]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#f5f5f5] my-2"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-[#eef2ff] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log Out
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {/* Header - 全宽导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
          {/* 左侧：Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img alt="MindNode" className="h-8 w-auto" src="/images/logo.png" />
          </Link>
          {/* 中间：桌面导航 - 仅在大屏显示，靠左对齐 */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-6">
            <NavItem to="/moltybox">MindNode</NavItem>
            <NavItem to="/skills">技能库</NavItem>
            <NavItem to="/hardware">盒子</NavItem>
            <NavItem to="/models">模型</NavItem>
            <NavItem to="/partner">合伙人</NavItem>
            <NavItem to="/referral-program">推荐官计划</NavItem>
            <ResourcesDropdown />
            <NavItem to="/enterprise">企业版</NavItem>
          </nav>
          {/* 右侧：汉堡按钮 + 语言切换 + 用户头像 */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 汉堡菜单按钮 - 仅在移动端显示 */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md border border-[#e5e5e5] text-[#525252] hover:text-[#0a0a0a] hover:border-[#6366f1] hover:bg-[#eef2ff] transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md text-[#525252] hover:text-[#0a0a0a] hover:bg-[#eef2ff] transition-colors outline-none cursor-pointer">
              <svg className="lucide lucide-globe h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </button>
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-[#fafafa]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
          <div className="grid grid-cols-1 gap-8 border-b border-[#e5e5e5] pb-8 sm:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-4">
                <Link to="/" className="text-base font-semibold" style={{ color: 'var(--v2-fg)' }}>MindNodeAI</Link>
                <div className="flex items-center gap-3">
                  <a href="https://www.linkedin.com/company/ag-cloud/" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] text-[#737373] hover:text-[#0a0a0a] hover:border-[#0a0a0a]">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <Link to="/contact-us" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] text-[#737373] hover:text-[#0a0a0a] hover:border-[#0a0a0a]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </Link>
                  <a href="https://discord.gg/Wg8kWEeK" target="_blank" rel="noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] text-[#737373] hover:text-[#0a0a0a] hover:border-[#0a0a0a]">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.111 13.111 0 01-1.8718-.8913.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0775.0775 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.839 19.839 0 006.0028-3.0294.077.077 0 00.0322-.054c.4917-5.176-1.3313-9.1153-3.5485-13.661a.061.061 0 00-.0312-.0284zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="hidden grid-cols-3 gap-10 sm:grid">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>产品</h3>
                  <ul className="flex flex-col gap-2.5">
                    <li><Link to="/moltybox" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">MindNode</Link></li>
                    <li><Link to="/skills" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">技能库</Link></li>
                    <li><Link to="/hardware" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">盒子</Link></li>
                    <li><Link to="/models?tab=llm" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">模型</Link></li>
                    <li><Link to="/partner" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">合伙人</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>资源</h3>
                  <ul className="flex flex-col gap-2.5">
                    <li><Link to="/agents" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">智能体</Link></li>
                    <li><Link to="/pricing" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">定价</Link></li>
                    <li><Link to="/documentation" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">文档</Link></li>
                    <li><Link to="/blog" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">博客</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>公司</h3>
                  <ul className="flex flex-col gap-2.5">
                    <li><Link to="/enterprise" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">企业版</Link></li>
                    <li><Link to="/privacy-terms" className="text-[15px] text-[#525252] hover:text-[#0a0a0a]">隐私与条款</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 text-xs" style={{ color: 'var(--v2-fg-secondary)' }}>
            <p>© 2026 MindNodeAI. 版权所有.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
