import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
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
      const response = await fetch('http://localhost:8000/api/v1/contact', {
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
          message: '感谢您的联系！我们将在 1-2 个工作日内回复您。'
        });
        setFormData({ name: '', email: '', company: '', subject: '', message: '' });
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
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold" style={{ color: '#0a0a0a' }}>
              联系我们
            </h1>
            <p className="mt-4 text-lg" style={{ color: '#525252' }}>
              有任何问题或建议？我们随时为您提供帮助。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#0a0a0a' }}>
                发送消息
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="请输入您的邮箱"
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
                    placeholder="请输入您的公司名称"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    主题 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
                  >
                    <option value="">请选择主题</option>
                    <option value="product">产品咨询</option>
                    <option value="technical">技术支持</option>
                    <option value="business">商务合作</option>
                    <option value="feedback">意见反馈</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    消息内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[#e5e5e5] bg-white text-[#0a0a0a] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all resize-none"
                    placeholder="请详细描述您的问题或需求..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-[10px] bg-[#0a0a0a] text-white font-medium hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '提交中...' : '发送消息'}
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

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#0a0a0a' }}>
                其他联系方式
              </h2>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-[#eef2ff] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#0a0a0a' }}>电子邮箱</h3>
                    <p className="text-[#525252] mb-2">工作日 24 小时内回复</p>
                    <a href="mailto:support@moltybox.com" className="text-[#6366f1] hover:underline">
                      support@moltybox.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-[#eef2ff] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#0a0a0a' }}>工作时间</h3>
                    <p className="text-[#525252]">周一至周五：9:00 - 18:00</p>
                    <p className="text-[#525252]">周末及节假日：10:00 - 16:00</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-[#eef2ff] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#0a0a0a' }}>社交媒体</h3>
                    <p className="text-[#525252] mb-3">关注我们获取最新资讯</p>
                    <div className="flex gap-3">
                      <a href="https://discord.gg/Wg8kWEeK" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#f5f5f5] text-[#525252] hover:bg-[#eef2ff] hover:text-[#6366f1] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.111 13.111 0 01-1.8718-.8913.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0775.0775 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 19.839 19.839 0 006.0028-3.0294.077.077 0 00.0322-.054c.4917-5.176-1.3313-9.1153-3.5485-13.661a.061.061 0 00-.0312-.0284zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                        </svg>
                        Discord
                      </a>
                      <a href="https://www.linkedin.com/company/ag-cloud/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#f5f5f5] text-[#525252] hover:bg-[#eef2ff] hover:text-[#6366f1] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="pt-8 border-t border-[#e5e5e5]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-[#eef2ff] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#0a0a0a' }}>常见问题</h3>
                      <p className="text-[#525252] mb-3">先看看这里有没有您想要的答案</p>
                      <Link to="/documentation" className="text-[#6366f1] hover:underline">
                        查看文档中心 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
