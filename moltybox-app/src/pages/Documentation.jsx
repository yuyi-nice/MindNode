import { Link } from 'react-router-dom';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>文档中心</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              MoltyBox 开发文档
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              快速上手指南、API 参考、最佳实践，助您充分利用 MoltyBox 平台。
            </p>
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索文档..."
                  className="w-full rounded-[10px] border border-[#e5e5e5] bg-white py-3 pl-10 pr-4 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-12" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: '快速开始',
                desc: '5 分钟上手 MoltyBox',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                links: ['安装指南', '第一个智能体', '配置模型', '常见问题'],
              },
              {
                title: '核心概念',
                desc: '理解 MoltyBox 架构',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                links: ['智能体架构', '技能系统', '模型路由', '数据流'],
              },
              {
                title: '技能开发',
                desc: '创建自定义技能',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                links: ['SDK 安装', '技能模板', 'API 参考', '发布流程'],
              },
              {
                title: '模型集成',
                desc: '接入主流大模型',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                links: ['模型配置', 'API 密钥管理', '路由策略', '成本控制'],
              },
              {
                title: '部署运维',
                desc: '生产环境部署',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                ),
                links: ['Docker 部署', 'Kubernetes', '监控告警', '备份恢复'],
              },
              {
                title: '安全合规',
                desc: '企业级安全实践',
                icon: (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                links: ['数据加密', '访问控制', '审计日志', '合规认证'],
              },
            ].map(cat => (
              <div key={cat.title} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef2ff] text-[#6366f1]">
                    {cat.icon}
                  </div>
                  <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{cat.title}</h3>
                </div>
                <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{cat.desc}</p>
                <ul className="mt-4 space-y-2">
                  {cat.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[14px] text-[#6366f1] hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>开发资源</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: 'GitHub 仓库', desc: '获取源代码、提交 Issue、参与贡献', link: '#' },
              { title: 'SDK 下载', desc: 'Python、Node.js、Go 等多语言 SDK', link: '#' },
              { title: 'API Playground', desc: '在线测试 API 接口', link: '#' },
            ].map(item => (
              <a key={item.title} href={item.link} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 hover:border-[#6366f1] hover:shadow-md transition-all">
                <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.title}</h3>
                <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[14px] font-medium text-[#6366f1]">
                  查看详情
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
