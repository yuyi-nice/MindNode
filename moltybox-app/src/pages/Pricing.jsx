import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handlePlanAction = (planName) => {
    if (planName === '团队版') {
      navigate('/enterprise');
    } else {
      navigate('/register');
    }
  };

  const handleHardwareBuy = () => {
    window.open('https://moltybox.shop/', '_blank');
  };

  const toggleFaq = (index) => {
    setExpandedFaq(prev => prev === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>定价方案</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              简单透明的定价
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              选择适合您的方案，随时升级。所有方案均包含 14 天免费试用。
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              {
                name: '个人版',
                price: '免费',
                desc: '适合个人用户和开发者',
                features: ['1 个 MoltyBox 实例', '基础技能库访问', '社区支持', '每月 1000 次 API 调用'],
                cta: '免费开始',
                popular: false,
              },
              {
                name: '专业版',
                price: '¥299/月',
                desc: '适合小型团队和创业者',
                features: ['5 个 MoltyBox 实例', '完整技能库访问', '优先技术支持', '每月 10000 次 API 调用', '数据分析报表', '自定义技能开发'],
                cta: '开始试用',
                popular: true,
              },
              {
                name: '团队版',
                price: '¥999/月',
                desc: '适合成长型企业',
                features: ['20 个 MoltyBox 实例', '团队协作功能', '专属客户成功经理', '无限 API 调用', 'SSO 单点登录', '审计日志', 'SLA 保障'],
                cta: '联系销售',
                popular: false,
              },
            ].map(tier => (
              <div key={tier.name} className={`relative rounded-[14px] border p-6 ${tier.popular ? 'border-[#6366f1] bg-white shadow-lg' : 'border-[#e5e5e5] bg-white'}`}>
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6366f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                    最受欢迎
                  </span>
                )}
                <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{tier.name}</h3>
                <p className="mt-1 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{tier.desc}</p>
                <p className="mt-4 text-[32px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{tier.price}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanAction(tier.name)}
                  className={`mt-6 w-full rounded-full px-6 py-2.5 text-[14px] font-medium transition-colors ${tier.popular ? 'bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90' : 'border border-[#e5e5e5] bg-white hover:border-[#6366f1]'}`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Pricing */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>硬件方案</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              {
                name: 'MoltyBox Mini',
                price: '¥2999',
                desc: '入门级 AI 工作站',
                specs: ['Intel Core i7 四核八线程', '8GB 内存', '256GB 固态硬盘', 'Windows 系统'],
                cta: '立即购买',
              },
              {
                name: 'MoltyBox Pro',
                price: '¥5999',
                desc: '专业级 AI 工作站',
                specs: ['Intel Core i9 八核十六线程', '16GB 内存', '512GB NVMe 固态硬盘', 'Windows 系统', '独立显卡 RTX 3050'],
                cta: '立即购买',
              },
            ].map(hw => (
              <div key={hw.name} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{hw.name}</h3>
                    <p className="mt-1 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{hw.desc}</p>
                    <p className="mt-4 text-[28px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{hw.price}</p>
                  </div>
                  <img src="/images/openclaw-device.webp" alt={hw.name} className="h-24 w-24 object-cover rounded-[8px]" />
                </div>
                <ul className="mt-6 space-y-2">
                  {hw.specs.map(spec => (
                    <li key={spec} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{spec}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleHardwareBuy}
                  className="mt-6 w-full rounded-full border border-[#e5e5e5] bg-white px-6 py-2.5 text-[14px] font-medium hover:border-[#6366f1] transition-colors"
                >
                  {hw.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>常见问题</h2>
          <div className="mt-8 space-y-4 max-w-3xl mx-auto">
            {[
              { q: '可以随时升级方案吗？', a: '可以，您可以在任何时候升级到更高方案，价格将按剩余天数比例计算。' },
              { q: '14 天免费试用需要绑定信用卡吗？', a: '不需要，注册即可开始试用，无需绑定任何支付方式。' },
              { q: '硬件支持退货吗？', a: '支持 7 天无理由退货，硬件需保持完好，包装完整。' },
              { q: '企业定制方案如何收费？', a: '根据具体需求定制，请联系销售团队获取详细报价。' },
            ].map((item, index) => (
              <div key={item.q} className="rounded-[10px] border border-[#e5e5e5] bg-white p-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>{item.q}</span>
                  <svg className="h-4 w-4 transition-transform" style={{ transform: expandedFaq === index ? 'rotate(180deg)' : '' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                    <p className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
