import { useState } from 'react';

export default function Partner() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    region: '',
    partnerType: '',
    resources: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/partners/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          partner_type: formData.partnerType,
          resources: formData.resources,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: data.data?.message || '申请已提交，我们将在 3 个工作日内审核并联系您。'
        });
        setFormData({ name: '', company: '', email: '', phone: '', region: '', partnerType: '', resources: '' });
      } else {
        setSubmitResult({
          success: false,
          message: data.detail || '提交失败，请稍后重试。'
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: '网络错误，请稍后重试。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>BOX 生态</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              共建 MoltyBox 渠道网络
            </h1>
            <p className="mt-4 max-w-[700px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              MoltyBox 把 AI 算力打包成即插即用的算力盒子，渠道伙伴只需连接市场资源，即可在总部交付、运维和售后支持下获得持续收益。
            </p>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-12" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>面向渠道的 AI 算力基础设施</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Market */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
              <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>市场机会</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'AI 算力需求持续增长',
                  '企业本地算力部署需求上升',
                  '边缘算力场景快速扩张',
                  '中小客户需要低门槛算力方案',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
              <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>产品</h3>
              <ul className="mt-4 space-y-3">
                {[
                  '标准化算力盒子（即插即用）',
                  '支持远程管理',
                  '可规模化部署',
                  '可形成持续收益模型',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Channel Partner */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8">
              <h2 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>渠道收益伙伴</h2>
              <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>主营</p>
              <p className="mt-4 text-[14px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                负责客户拓展、签单交付，在所属区域销售 MoltyBox 及配套服务。单季度售卖超过 100 台即可晋级渠道收益伙伴。
              </p>
              <div className="mt-6">
                <p className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>收益方式</p>
                <ul className="mt-3 space-y-2">
                  {[
                    '每台 MoltyBox 享有销售差价',
                    '获取业绩返点奖励',
                    '区域保护与商机登记',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ecosystem Partner */}
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8">
              <h2 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>生态共建伙伴</h2>
              <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>共创</p>
              <p className="mt-4 text-[14px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                与 MoltyBox 一起打造场景案例、内容传播或本地化服务，放大 Box 生态影响力。
              </p>
              <div className="mt-6">
                <p className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>您可获得</p>
                <ul className="mt-3 space-y-2">
                  {[
                    '总部的产品/销售/技术培训',
                    '安装指导与远程运维支持',
                    '共享售后体系与宣传物料',
                    '联合市场活动与 Box 体验日',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>Box 生态收益体系</h2>
          <p className="mt-4 text-center" style={{ color: 'var(--v2-fg-secondary)' }}>我们负责底层能力，伙伴专注拓客变现。</p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '多元收益', desc: '销售差价 + 业绩返点，多条收入曲线同步增长。' },
              { title: '价格与返点保护', desc: '统一标价确保渠道利润空间，并按完成度发放返点/激励。' },
              { title: '总部支持', desc: '产品培训、销售话术、技术支撑、安装指导、售后体系一站式提供。' },
              { title: '营销物料', desc: '交付方案、案例、演示视频和宣传素材随时调用。' },
            ].map(item => (
              <div key={item.title} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 text-center">
                <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.title}</h3>
                <p className="mt-3 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>合作流程（超简单）</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-5">
            {[
              { step: '1', title: '提交合作申请', desc: '通过微信/表单留下公司信息、区域和资源优势。' },
              { step: '2', title: '评估与确认', desc: '总部评估匹配度并确认最佳合作模式。' },
              { step: '3', title: '签署渠道协议', desc: '锁定渠道政策、区域保护和价格体系。' },
              { step: '4', title: '参加线上培训', desc: '完成产品 + 销售培训，领取 Box 作战手册。' },
              { step: '5', title: '启动客户拓展', desc: '启动市场动作、落地 POC，并与总部协同交付与售后。' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#6366f1] text-white">
                  <span className="text-[18px] font-semibold">{item.step}</span>
                </div>
                <h3 className="mt-4 text-[16px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.title}</h3>
                <p className="mt-2 text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.desc}</p>
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
              { q: '加入需要技术背景吗？', a: '不需要。只要您掌握客户或社群资源，总部会提供产品专家、技术支持和安装指导。' },
              { q: '收益如何结算？', a: '我们将根据您的合作级别与区域特点，定制极具竞争力的阶梯式结算政策。' },
              { q: '是否有区域保护？', a: '有。通过审核后即可获得区域保护与商机备案，保障您的投入。' },
              { q: '多久可以完成合作开通？', a: '通常 5-7 天即可完成资质评估、协议签署及线上培训。' },
            ].map(item => (
              <div key={item.q} className="rounded-[10px] border border-[#e5e5e5] bg-white p-4">
                <button className="flex w-full items-center justify-between text-left">
                  <span className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>{item.q}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
          <h2 className="text-[28px] font-semibold" style={{ color: 'var(--v2-fg)' }}>把 MoltyBox 带到你的市场</h2>
          <p className="mt-4 text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
            Box 生态伙伴在总部支持下更快扩张 AI 算力版图，期待与你一起共建。
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>
              申请成为合伙人
            </h2>
            <p className="mt-4 text-center text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              填写申请表，我们将在 3 个工作日内联系您
            </p>

            <div className="mt-10 rounded-[14px] border border-[#e5e5e5] bg-white p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入您的姓名"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      公司 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入公司名称"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入邮箱"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入联系电话"
                    />
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    所在地区 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                    placeholder="例如：北京市朝阳区"
                  />
                </div>

                {/* Partner Type */}
                <div>
                  <label htmlFor="partnerType" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    合作类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="partnerType"
                    name="partnerType"
                    value={formData.partnerType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                  >
                    <option value="">请选择合作类型</option>
                    <option value="channel">渠道收益伙伴</option>
                    <option value="ecosystem">生态共建伙伴</option>
                  </select>
                </div>

                {/* Resources */}
                <div>
                  <label htmlFor="resources" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    资源优势 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="resources"
                    name="resources"
                    value={formData.resources}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all resize-none"
                    placeholder="请描述您的客户资源、渠道网络或技术能力..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-[10px] bg-[#0a0a0a] text-white font-medium hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '提交中...' : '提交申请'}
                </button>

                {/* Result Message */}
                {submitResult && (
                  <div className={`p-4 rounded-[10px] ${
                    submitResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className={submitResult.success ? 'text-green-800' : 'text-red-800'}>
                      {submitResult.message}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
