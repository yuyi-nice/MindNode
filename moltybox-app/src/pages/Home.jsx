import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchModels, fetchSkills, fetchAgents, fetchHardware } from '../lib/api';

const SectionLabel = ({ children }) => (
  <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6366f1]">{children}</p>
);

const HeadingXL = ({ children }) => (
  <h1 className="text-[36px] font-semibold leading-[44px] tracking-tight sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]" style={{ color: 'var(--v2-fg)' }}>
    {children}
  </h1>
);

const HeadingLG = ({ children }) => (
  <h2 className="text-[28px] font-semibold leading-[36px] tracking-tight sm:text-[40px] sm:leading-[48px]" style={{ color: 'var(--v2-fg)' }}>
    {children}
  </h2>
);

const BtnPrimary = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="group relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-full px-7 text-[14px] font-semibold leading-[20px] transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:outline-none bg-[#0a0a0a] text-[#fafafa]"
  >
    <span className="relative z-10">{children}</span>
  </button>
);

const BtnSecondary = ({ children, to, href, target }) => {
  const className = "group inline-flex h-11 cursor-pointer items-center justify-center rounded-full border px-7 text-[14px] font-medium leading-[20px] transition-all duration-200 hover:scale-105 hover:border-[#6366f1] border-[#e5e5e5] bg-white text-[#0a0a0a] shadow-sm";
  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }
  return (
    <a href={href} target={target} rel={target ? 'noopener noreferrer' : undefined} className={className}>
      {children}
    </a>
  );
};

// 模型卡片组件
const ModelCard = ({ model }) => (
  <a
    href={`/models/${model?.slug || ''}`}
    className="model-item flex items-center gap-3 px-3 py-2.5 rounded-[6px] transition-all duration-300 hover:scale-[1.02]"
    style={{ background: model?.highlight ? 'var(--v2-accent-muted)' : 'transparent' }}
  >
    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: model?.highlight ? 'var(--v2-accent)' : 'var(--v2-border)' }}></span>
    {model?.provider_logo && (
      <img alt={model?.provider} className="h-4 w-4" src={model.provider_logo} style={{ opacity: model?.highlight ? 1 : 0.4 }} />
    )}
    <span className="font-mono text-[13px]" style={{ color: model?.highlight ? 'var(--v2-fg)' : 'var(--v2-fg-tertiary)' }}>
      {model?.slug || model?.name}
    </span>
    <span
      className="ml-auto rounded-full px-2 py-0.5 text-[11px]"
      style={{
        background: model?.highlight ? 'var(--v2-accent)' : 'transparent',
        color: model?.highlight ? 'var(--v2-accent-fg)' : 'var(--v2-fg-tertiary)',
        border: model?.highlight ? 'none' : '1px solid var(--v2-border)'
      }}
    >
      {model?.provider}
    </span>
  </a>
);

// 技能卡片组件
const SkillCard = ({ skill, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`skill-item flex w-full items-start gap-3 rounded-[10px] border px-4 py-3.5 text-left transition-all duration-200 hover:scale-[1.02] ${isActive ? 'active' : ''}`}
    style={{
      borderColor: isActive ? 'var(--v2-accent)' : 'var(--v2-border)',
      background: isActive ? 'var(--v2-accent-muted)' : 'var(--v2-bg-surface)',
      boxShadow: isActive ? 'rgba(0, 0, 0, 0.08) 0px 4px 12px' : 'var(--v2-shadow-xs)'
    }}
  >
    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: isActive ? 'var(--v2-accent)' : 'var(--v2-border)' }}></span>
    <div className="min-w-0">
      <span className="text-[14px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{skill?.name}</span>
      <span className="mt-0.5 block truncate text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
        {skill?.description}
      </span>
    </div>
  </button>
);

export default function Home() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [modelsRes, skillsRes, hardwareRes] = await Promise.all([
          fetchModels({ limit: 4 }),
          fetchSkills({ limit: 6 }),
          fetchHardware()
        ]);
        // 兼容两种 API 返回格式
        const modelsData = Array.isArray(modelsRes.data) ? modelsRes.data : (modelsRes.data?.data || []);
        const skillsData = Array.isArray(skillsRes.data) ? skillsRes.data : (skillsRes.data?.data || []);
        const hardwareData = Array.isArray(hardwareRes.data) ? hardwareRes.data : (hardwareRes.data?.data || []);
        setModels(modelsData.slice(0, 4));
        setSkills(skillsData);
        setHardware(hardwareData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto-rotate skill cards
  useEffect(() => {
    if (skills.length > 0) {
      const timer = setInterval(() => {
        setActiveSkillIndex((prev) => (prev + 1) % skills.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [skills]);
  return (
    <div className="scroll-smooth" style={{ background: 'var(--v2-bg-page)', color: 'var(--v2-fg)' }}>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden py-32 sm:py-40 gradient-bg grid-pattern">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, var(--v2-accent) 0%, transparent 70%)' }}></div>
          <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] translate-x-1/2 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, var(--v2-accent) 0%, transparent 70%)' }}></div>
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, var(--v2-border) 1px, transparent 1px), linear-gradient(to bottom, var(--v2-border) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <HeadingXL>驱动下一代 AI 智能体。</HeadingXL>
            <p className="mt-5 max-w-[540px] text-[16px] leading-[26px] sm:text-[18px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              为 AI 智能体而生的新一代云平台。一站式部署、编排和扩展智能体，简单且高效。
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <BtnPrimary onClick={() => navigate('/models')}>探索模型</BtnPrimary>
              <BtnSecondary to="/moltybox">
                了解 MoltyBox
                <svg className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </BtnSecondary>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative py-20 sm:py-28" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div className="mb-10 text-center">
            <SectionLabel>架构总览</SectionLabel>
            <HeadingLG>智能体装配线。</HeadingLG>
            <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[26px] sm:text-[18px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              从模型大脑到技能执行再到本地硬件——完整流水线，一气呵成。
            </p>
          </div>
          <div className="mx-auto w-full max-w-[780px]">
            <img alt="Agent architecture" className="h-auto w-full" src="/images/agents.svg" />
          </div>
        </div>
      </section>

      {/* Model Hub Section */}
      <section className="py-28 sm:py-36" style={{ background: 'var(--v2-bg-surface)' }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Model Hub</SectionLabel>
              <HeadingLG>一个接口，链接全球智慧。</HeadingLG>
              <p className="mt-4 max-w-[480px] text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                告别繁琐的 Key 管理。我们在云端聚合了 Llama 3、DeepSeek、Mistral、Qwen 等顶级开源模型。
              </p>
              <div className="mt-8 overflow-hidden rounded-[14px] border border-[#e5e5e5] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-3">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--v2-fg)' }}>Model Router</span>
                  <span className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--v2-success)' }}></span>auto-routing
                  </span>
                </div>
                <div className="p-2">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500">加载中...</div>
                  ) : (
                    models.slice(0, 2).map((model, index) => (
                      <ModelCard key={model.id} model={{ ...model, highlight: index === 0 }} />
                    ))
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-3">
                  <p className="text-[22px] font-semibold leading-[28px]" style={{ color: 'var(--v2-accent)' }}>50%+</p>
                  <p className="mt-0.5 text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>批发价接入 — 成本降低 50%+</p>
                </div>
                <div className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-3">
                  <p className="text-[22px] font-semibold leading-[28px]" style={{ color: 'var(--v2-accent)' }}>1 param</p>
                  <p className="mt-0.5 text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>修改一个参数即可更换模型</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center py-8">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[14px] border border-[#e5e5e5] bg-white">
                <span className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>AG</span>
              </div>
              <div className="absolute" style={{ transform: 'translate(0, -140px)' }}>
                <img alt="deepseek" className="h-6 w-6 opacity-50" src="/images/deepseek.svg" />
              </div>
              <div className="absolute" style={{ transform: 'translate(99px, -99px)' }}>
                <img alt="google" className="h-6 w-6 opacity-100" src="data:image/svg+xml,%3csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.5013 6.12207C11.5013 5.66957 11.4638 5.33957 11.3833 4.99707H6.11328V7.03857H9.20628C9.14428 7.54557 8.80778 8.30957 8.05928 8.82307L8.04878 8.89107L9.71478 10.1561L9.82978 10.1671C10.8908 9.20807 11.5013 7.79607 11.5013 6.12207Z' fill='black'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.11166 11.5004C7.62666 11.5004 8.89866 11.0114 9.82816 10.1679L8.05716 8.82389C7.58316 9.14789 6.94716 9.37389 6.11166 9.37389C5.40738 9.37396 4.72076 9.15354 4.14812 8.74356C3.57547 8.33358 3.14555 7.75461 2.91866 7.08789L2.85266 7.09339L1.12016 8.40739L1.09766 8.46939C2.02066 10.2659 3.91666 11.5004 6.11166 11.5004Z' fill='black'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.92 7.08741C2.79702 6.73794 2.73331 6.37038 2.7315 5.99991C2.7315 5.62091 2.8005 5.25441 2.912 4.91241L2.909 4.83891L1.155 3.50391L1.0975 3.53091C0.705396 4.29489 0.500596 5.14117 0.5 5.99991C0.5 6.88591 0.718 7.72341 1.0985 8.46891L2.92 7.08741Z' fill='black'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M6.11166 2.6265C7.16566 2.6265 7.87616 3.0725 8.28166 3.4455L9.86516 1.93C8.89266 1.044 7.62666 0.5 6.11166 0.5C3.91616 0.5 2.02066 1.7345 1.09766 3.531L2.91266 4.9125C3.1415 4.24583 3.57275 3.66722 4.14622 3.25742C4.7197 2.84761 5.4068 2.62705 6.11166 2.6265Z' fill='black'/%3e%3c/svg%3e" />
              </div>
              <div className="absolute" style={{ transform: 'translate(140px, 0)' }}>
                <img alt="liquid" className="h-6 w-6 opacity-50" src="data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.0001 2.55078C12.0001 2.55078 5.7501 9.55078 5.7501 14.5508C5.7501 18.0026 8.54832 20.8008 12.0001 20.8008C15.4519 20.8008 18.2501 18.0026 18.2501 14.5508C18.2501 9.55078 12.0001 2.55078 12.0001 2.55078Z' fill='black'/%3e%3c/svg%3e" />
              </div>
              <div className="absolute" style={{ transform: 'translate(0, 140px)' }}>
                <img alt="qwen" className="h-6 w-6 opacity-50" src="/images/qwen.svg" />
              </div>
              <div className="absolute" style={{ transform: 'translate(-140px, 0)' }}>
                <img alt="minimax" className="h-6 w-6 opacity-50" src="/images/minimax.svg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Workflows Section */}
      <section className="py-28 sm:py-36" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div>
            <SectionLabel>Skill Workflows</SectionLabel>
            <HeadingLG>赋予 Agent 真正的执行力。</HeadingLG>
            <p className="mt-3 max-w-[560px] text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              拥有海量 Skill 库，支持容器化加载。从金融分析到自动化办公，即插即用。
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="text-sm text-gray-500">加载中...</div>
              ) : (
                skills.slice(0, 6).map((skill, i) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    isActive={i === activeSkillIndex}
                    onClick={() => setActiveSkillIndex(i)}
                  />
                ))
              )}
            </div>
            <div className="flex flex-col rounded-[14px] border border-[#e5e5e5] p-6" style={{ background: 'var(--v2-bg-elevated)' }}>
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]"></span>
                <span className="ml-3 font-mono text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>agent-workflow</span>
                <span className="ml-auto font-mono text-[11px]" style={{ color: 'var(--v2-fg-tertiary)' }}>1/3</span>
              </div>
              <div className="workflow-step active animate-pulse-custom flex items-center gap-3 rounded-[6px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]" style={{ background: 'var(--v2-accent)' }}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'var(--v2-accent-fg)' }}>
                    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
                    <path d="M3.5 8.5h17" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>cloudflare-browser-rendering</p>
                  <p className="text-[14px]" style={{ color: 'var(--v2-fg)' }}>使用无头浏览器抓取价格页面</p>
                </div>
                <svg className="h-4 w-4 animate-spin-custom" fill="none" style={{ color: 'var(--v2-accent)' }} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.2"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-28 sm:py-36" style={{ background: 'var(--v2-bg-surface)' }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[14px] shadow-sm">
              <div className="aspect-[4/3] w-full">
                {hardware.length > 0 ? (
                  <img alt={hardware[0].name} className="h-full w-full object-cover" src={hardware[0].cover_image || hardware[0].images?.[0] || '/images/openclaw-device.webp'} />
                ) : (
                  <img alt="Hardware" className="h-full w-full object-cover" src="/images/openclaw-device.webp" />
                )}
              </div>
            </div>
            <div>
              <SectionLabel>Hardware</SectionLabel>
              <HeadingLG>{hardware.length > 0 ? hardware[0].name : 'OpenClaw'} — 将云端能力带回桌面。</HeadingLG>
              <p className="mt-4 max-w-[480px] text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                {hardware.length > 0 ? hardware[0].short_description : '专为智能体打造的边缘计算终端。私有容器，数据不出域，开箱即用。'}
              </p>
              <p className="mt-3 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>本地运行，零延迟，绝对数据隐私。</p>
              <div className="mt-6 flex flex-col gap-4">
                {[
                  { title: '数据隐私优先', desc: '数据不出本地设备。' },
                  { title: '技能即时加载', desc: '本地容器化执行。' },
                  { title: '永远在线', desc: '7×24 小时随时待命，零冷启动。' }
                ].map(f => (
                  <div key={f.title} className="feature-card flex items-start gap-3 rounded-[6px] p-2 transition-colors duration-200 hover:bg-[rgba(99,102,241,0.05)]">
                    <div className="feature-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px]" style={{ background: 'var(--v2-accent-muted)' }}>
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--v2-accent)' }}>
                        <path d="M12 3 5.5 6v5.5c0 4.3 2.8 7.7 6.5 9.5 3.7-1.8 6.5-5.2 6.5-9.5V6L12 3Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{f.title}</h4>
                      <p className="mt-0.5 text-[13px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <BtnSecondary href="https://moltybox.shop/" target="_blank">
                  探索硬件规格
                  <svg className="ml-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </BtnSecondary>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 sm:py-10" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[18px] border border-[#e5e5e5] px-8 py-16 sm:px-12 sm:py-20" style={{ background: 'var(--v2-accent-muted)' }}>
            <div className="relative flex flex-col items-center gap-5 text-center">
              <HeadingLG>准备好构建你的超级智能体了吗？</HeadingLG>
              <p className="max-w-[480px] text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                从模型网关到技能市场再到边缘硬件——你需要的一切，一个平台搞定。
              </p>
              <div className="mt-4 flex items-center gap-4">
                <BtnPrimary onClick={() => navigate('/models')}>探索模型</BtnPrimary>
                <BtnSecondary href="https://moltybox.shop/" target="_blank">购买 OpenClaw</BtnSecondary>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
