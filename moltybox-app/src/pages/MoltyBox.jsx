import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAgents } from '../lib/api';

export default function MindNode() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await fetchAgents({ limit: 4 });
      setAgents(response.data || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (platform) => {
    // 本地测试下载链接
    const downloadLinks = {
      windows: '/downloads/moltybox-windows-latest.exe',
      macos: '/downloads/moltybox-macos-latest.dmg'
    };
    window.open(downloadLinks[platform] || '#', '_blank');
  };

  const handleCloudAccess = () => {
    window.open('https://cloud.moltybox.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-[36px] font-semibold leading-[44px] sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]" style={{ color: 'var(--v2-fg)' }}>
              MindNode
            </h1>
            <h2 className="mt-4 text-[28px] font-semibold leading-[36px] sm:text-[40px] sm:leading-[48px]" style={{ color: 'var(--v2-fg)' }}>
              开箱即用的 AI 助手
            </h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              基于 OpenClaw 框架打造。一键安装，免除繁琐配置，无需提供 API Key。
            </p>
          </div>

          {/* Download Section */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Desktop Client */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>桌面客户端</p>
                  <h3 className="mt-2 text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>Mac 与 Windows 下载</h3>
                  <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>本地安装，适合高频使用和系统级自动化任务。</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDownload('windows')}
                      className="inline-flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] font-medium hover:scale-[1.02] transition-transform"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.83 1.94-.83s.17 1.45-.83 2.51c-.93.98-2.33.78-2.33.78s-.19-1.51 1.22-2.46z"/>
                      </svg>
                      下载 Windows 版本
                    </button>
                    <button
                      onClick={() => handleDownload('macos')}
                      className="inline-flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] font-medium hover:scale-[1.02] transition-transform"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.83 1.94-.83s.17 1.45-.83 2.51c-.93.98-2.33.78-2.33.78s-.19-1.51 1.22-2.46z"/>
                      </svg>
                      下载 MacOS 版本
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Version */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>云端访问</p>
              <h3 className="mt-2 text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>MindNode 云端版</h3>
              <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>专属云主机 · 7×24 小时在岗 · 注册即用</p>
              <button
                onClick={handleCloudAccess}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-6 py-2.5 text-[14px] font-medium hover:scale-[1.02] transition-transform"
              >
                进入云端版
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Market Section */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>Agent 场景市场</p>
            <h2 className="mt-2 text-[28px] font-semibold sm:text-[40px]" style={{ color: 'var(--v2-fg)' }}>领养拥有专业技能的 AI 员工</h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              不再是从零配置，而是直接领养具备行业最佳实践的 AI 智能体。覆盖运营、研发、创作等全场景。
            </p>
          </div>

          {/* Agent Cards */}
          {loading ? (
            <div className="mt-10 flex justify-center">
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>加载中...</p>
            </div>
          ) : agents.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agents.slice(0, 4).map((agent) => (
                <div key={agent.id} className="rounded-[14px] border border-[#e5e5e5] bg-white p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2ff]">
                      <span className="text-[16px] font-semibold" style={{ color: 'var(--v2-accent)' }}>
                        {agent.name?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{agent.name}</h3>
                      <p className="text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{agent.tagline || agent.category}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] line-clamp-2" style={{ color: 'var(--v2-fg-secondary)' }}>{agent.description}</p>
                  <Link
                    to={`/agents/${agent.slug || agent.id}`}
                    className="mt-4 block text-center text-[13px] font-medium text-[#6366f1] hover:underline"
                  >
                    了解详情
                  </Link>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex justify-center">
            <Link
              to="/agents"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-6 py-3 text-[14px] font-medium hover:scale-[1.02] transition-transform"
            >
              查看更多 Agent
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Three Steps Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[28px] font-semibold sm:text-[40px]" style={{ color: 'var(--v2-fg)' }}>三步接入 OpenClaw 生态</h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              从硬件上电到技能调用，全流程开箱即用。无需折腾 Python、Docker 或复杂脚本。
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Section */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>移动协同</p>
              <h2 className="text-[28px] font-semibold sm:text-[40px]" style={{ color: 'var(--v2-fg)' }}>随时随地，掌控您的工作站</h2>
              <p className="mt-4 text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                离开工位也能高效运转。通过您常用的手机 App 远程下达指令，桌面端的自动化执行过程尽在掌握。
              </p>
              <h3 className="mt-6 text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>全平台无缝接入</h3>
              <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                打破设备壁垒。MindNode 将您在移动端的每一句自然交互，瞬间转化为电脑上的原生自动化操作。
              </p>
            </div>
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
                <span className="font-mono text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>MindNode Workspace</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>AGENTS</p>
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>12</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>TASKS</p>
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>324</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>UPTIME</p>
                  <p className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>99.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
