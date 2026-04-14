import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Enterprise() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    industry: '',
    employee_count: '',
    use_case: '',
    interested_products: [],
    budget_range: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (product) => {
    setFormData({
      ...formData,
      interested_products: formData.interested_products.includes(product)
        ? formData.interested_products.filter(p => p !== product)
        : [...formData.interested_products, product]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/enterprise/inquire', {
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
          message: data.data?.message || '咨询已提交，企业销售团队将在 24 小时内联系您。'
        });
        setFormData({
          company_name: '',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          industry: '',
          employee_count: '',
          use_case: '',
          interested_products: [],
          budget_range: '',
          timeline: ''
        });
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>企业版</p>
              <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
                为大型企业打造的 AI 基础设施
              </h1>
              <p className="mt-4 text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                私有化部署、定制开发、专属支持，满足企业级安全与合规要求。
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>本地化私有部署，数据完全自主</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>SSO 单点登录、AD/LDAP 集成</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>审计日志、权限分级、合规报表</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>专属客户经理与技术支持团队</span>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/contact-us" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[14px] font-medium text-white hover:scale-[1.02] transition-transform">
                  联系销售团队
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
                  <span className="font-mono text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>MindNode Enterprise</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>部署方式</p>
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--v2-fg)' }}>私有化 / 混合云</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>用户规模</p>
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--v2-fg)' }}>100 - 10,000+</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>SLA</p>
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--v2-fg)' }}>99.9%</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--v2-fg-tertiary)' }}>支持等级</p>
                    <p className="text-[16px] font-semibold" style={{ color: 'var(--v2-fg)' }}>专属团队</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>企业级能力</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '私有化部署', desc: '完整系统部署于客户内网环境，数据不出域，支持离线运行。' },
              { title: '定制开发', desc: '根据企业业务流程定制 AI 智能体，深度集成现有系统。' },
              { title: '安全合规', desc: '通过 SOC2、ISO27001、等保三级认证，满足金融、医疗等行业要求。' },
              { title: '高可用架构', desc: '集群部署、负载均衡、故障自动转移，保障业务连续性。' },
              { title: '多租户管理', desc: '支持多部门/子公司独立使用，资源隔离、权限分级。' },
              { title: '专属支持', desc: '7×24 小时技术支持，专属客户成功经理，定期健康检查。' },
            ].map(item => (
              <div key={item.title} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
                <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.title}</h3>
                <p className="mt-3 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>企业案例</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { company: '某大型金融机构', use: '智能客服、文档自动化', result: '客服效率提升 300%' },
              { company: '头部电商平台', use: '商品描述生成、数据分析', result: '运营人力成本降低 60%' },
              { company: '制造业龙头企业', use: '工单处理、知识库管理', result: '响应时间缩短至 1 分钟' },
            ].map(item => (
              <div key={item.company} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6">
                <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{item.company}</h3>
                <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>应用场景：{item.use}</p>
                <p className="mt-4 text-[24px] font-semibold" style={{ color: 'var(--v2-accent)' }}>{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" id="contact-form">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>
              企业咨询申请表
            </h2>
            <p className="mt-4 text-center text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              填写表单，企业销售团队将在 24 小时内联系您
            </p>

            <div className="mt-10 rounded-[14px] border border-[#e5e5e5] bg-white p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      公司名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入公司全称"
                    />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      联系人 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入联系人姓名"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      企业邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="name@company.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      联系电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                      placeholder="请输入手机号码"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      所属行业
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                    >
                      <option value="">请选择行业</option>
                      <option value="finance">金融</option>
                      <option value="ecommerce">电商</option>
                      <option value="manufacturing">制造</option>
                      <option value="healthcare">医疗</option>
                      <option value="education">教育</option>
                      <option value="technology">互联网/科技</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  {/* Employee Count */}
                  <div>
                    <label htmlFor="employee_count" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      公司规模
                    </label>
                    <select
                      id="employee_count"
                      name="employee_count"
                      value={formData.employee_count}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                    >
                      <option value="">请选择规模</option>
                      <option value="1-50">1-50 人</option>
                      <option value="51-200">51-200 人</option>
                      <option value="201-500">201-500 人</option>
                      <option value="501-1000">501-1000 人</option>
                      <option value="1000+">1000 人以上</option>
                    </select>
                  </div>
                </div>

                {/* Use Case */}
                <div>
                  <label htmlFor="use_case" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    应用场景
                  </label>
                  <textarea
                    id="use_case"
                    name="use_case"
                    value={formData.use_case}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all resize-none"
                    placeholder="请描述您的应用场景和需求..."
                  />
                </div>

                {/* Interested Products */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    感兴趣的产品
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { value: 'moltybox', label: 'MindNode 桌面客户端' },
                      { value: 'skills', label: '技能库' },
                      { value: 'hardware', label: 'MindNode Mini/Pro 主机' },
                      { value: 'agents', label: 'AI 智能体定制' },
                      { value: 'cloud', label: '云端私有化部署' },
                      { value: 'enterprise', label: '企业级功能（SSO/权限管理等）' },
                    ].map(item => (
                      <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interested_products.includes(item.value)}
                          onChange={() => handleCheckboxChange(item.value)}
                          className="h-4 w-4 rounded border-[#e5e5e5] text-[#6366f1] focus:ring-[#6366f1]"
                        />
                        <span className="text-[14px]" style={{ color: '#525252' }}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label htmlFor="budget_range" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    预算范围
                  </label>
                  <select
                    id="budget_range"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                  >
                    <option value="">请选择预算</option>
                    <option value="10k-50k">1 万 -5 万</option>
                    <option value="50k-100k">5 万 -10 万</option>
                    <option value="100k-500k">10 万 -50 万</option>
                    <option value="500k+">50 万以上</option>
                  </select>
                </div>

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    预计落地时间
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                  >
                    <option value="">请选择时间</option>
                    <option value="immediate">立即</option>
                    <option value="1-month">1 个月内</option>
                    <option value="1-3-months">1-3 个月</option>
                    <option value="3-6-months">3-6 个月</option>
                    <option value="planning">规划中</option>
                  </select>
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
