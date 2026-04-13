import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReferralProgram() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: ''
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
      const response = await fetch('http://localhost:8000/api/v1/referrals/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: data.data?.message || '申请已提交，我们将在 3 个工作日内审核并联系您。'
        });
        setFormData({ name: '', email: '', phone: '', company: '', description: '' });
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
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>推荐官计划</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              推荐 MoltyBox，获得丰厚奖励
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              每成功推荐一位客户，即可获得高达 20% 的佣金奖励。无上限，多推多得。
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>推荐流程</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-4">
            {[
              { step: '1', title: '注册成为推荐官', desc: '填写申请表单，加入我们' },
              { step: '2', title: '获取专属链接', desc: '获得您的唯一推荐链接' },
              { step: '3', title: '分享给客户', desc: '通过链接推荐 MoltyBox' },
              { step: '4', title: '收取佣金', desc: '客户购买后自动获得奖励' },
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

      {/* Commission Tiers */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>佣金等级</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { tier: '青铜推荐官', rate: '10%', requirement: '1-9 台/月', benefits: ['标准佣金', '专属链接', '基础支持'] },
              { tier: '白银推荐官', rate: '15%', requirement: '10-49 台/月', benefits: ['提升佣金', '优先支持', '营销素材'] },
              { tier: '黄金推荐官', rate: '20%', requirement: '50+ 台/月', benefits: ['最高佣金', 'VIP 支持', '联合营销', '季度奖金'] },
            ].map(item => (
              <div key={item.tier} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
                <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.tier}</h3>
                <p className="mt-2 text-[32px] font-semibold" style={{ color: 'var(--v2-accent)' }}>{item.rate}</p>
                <p className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>月推荐 {item.requirement}</p>
                <ul className="mt-4 space-y-2">
                  {item.benefits.map(benefit => (
                    <li key={benefit} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{benefit}</span>
                    </li>
                  ))}
                </ul>
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
              { q: '如何加入推荐官计划？', a: '点击下方申请表单，填写基本信息即可。审核通过后您将收到专属推荐链接。' },
              { q: '佣金如何结算？', a: '客户完成购买后 7 个工作日内，佣金将打入您的账户，可选择银行转账或支付宝。' },
              { q: '有推荐数量限制吗？', a: '没有上限。推荐越多，佣金等级越高，单台佣金也越高。' },
              { q: '推荐后客户流失了怎么办？', a: '客户购买即算成功，后续使用不影响您的佣金。' },
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
      <section className="py-20" id="apply-form">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>
              立即申请成为推荐官
            </h2>
            <p className="mt-4 text-center text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              填写申请表，我们将在 3 个工作日内审核并联系您
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
                      公司（选填）
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
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

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    推荐计划描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all resize-none"
                    placeholder="请描述您的推荐计划或资源优势..."
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

      {/* Original CTA Section - Remove duplicate, keep for reference */}
    </div>
  );
}
