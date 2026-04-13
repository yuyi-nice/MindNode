import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts, fetchBlogCategories, subscribeNewsletter } from '../lib/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeResult, setSubscribeResult] = useState(null);

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const [postsRes, categoriesRes] = await Promise.all([
        fetchBlogPosts({ limit: 10 }),
        fetchBlogCategories()
      ]);
      setPosts(postsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to load blog data:', error);
      // 使用静态数据作为降级
      setPosts([
        { id: 1, title: '如何用 MoltyBox 构建 24 小时在线的智能客服系统', desc: '从 0 到 1 搭建企业级智能客服，涵盖意图识别、多轮对话、人工接管等完整流程。', date: '2026-03-25', category: '技术分享', read_time: 10, featured: true },
        { id: 2, title: 'MoltyBox v2.0 发布：支持多模型自动路由', desc: '智能选择最优模型，降低成本 40%', date: '2026-03-20', category: '产品更新', read_time: 5 },
        { id: 3, title: '深入理解 Agent 技能系统的设计原理', desc: '揭秘技能编排和调度的核心技术', date: '2026-03-18', category: '技术分享', read_time: 8 },
        { id: 4, title: '某电商平台使用 MoltyBox 提升客服效率 300%', desc: '日均处理 10 万 + 咨询的智能客服实践', date: '2026-03-15', category: '客户案例', read_time: 6 },
        { id: 5, title: '2026 AI 智能体发展趋势报告', desc: 'Agentic AI 将成为下一个风口', date: '2026-03-10', category: '行业新闻', read_time: 7 },
        { id: 6, title: 'MoltyBox 硬件 Mini 主机开箱评测', desc: '第一台开箱即用的 AI 智能体服务器', date: '2026-03-08', category: '产品更新', read_time: 5 },
        { id: 7, title: '使用 MoltyBox 构建自动化数据分析流程', desc: '从数据提取到可视化报告的全流程', date: '2026-03-05', category: '技术分享', read_time: 8 },
      ]);
      setCategories(['全部', '产品更新', '技术分享', '客户案例', '行业新闻']);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    setSubscribeResult(null);

    try {
      await subscribeNewsletter(email);
      setSubscribeResult({ success: true, message: '订阅成功！感谢您的关注。' });
      setEmail('');
    } catch (error) {
      setSubscribeResult({ success: false, message: '订阅失败，请稍后重试。' });
    } finally {
      setSubscribing(false);
    }
  };

  const filteredPosts = selectedCategory === '全部'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const featuredPost = posts.find(post => post.featured) || posts[0];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>博客</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              MoltyBox 官方博客
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              产品更新、技术分享、客户案例、行业洞察。
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          {loading ? (
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 text-center">
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>加载中...</p>
            </div>
          ) : featuredPost && (
            <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">精选文章</span>
              <h2 className="mt-3 text-[28px] font-semibold" style={{ color: 'var(--v2-fg)' }}>
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                {featuredPost.desc || featuredPost.excerpt || featuredPost.description}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-[13px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{featuredPost.date || featuredPost.published_at}</span>
                <span className="text-[13px]" style={{ color: 'var(--v2-fg-tertiary)' }}>·</span>
                <span className="text-[13px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{featuredPost.read_time || 5} 分钟阅读</span>
                <Link to={`/blog/${featuredPost.slug || featuredPost.id}`} className="ml-auto text-[14px] font-medium text-[#6366f1] hover:underline">
                  阅读全文 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>最新文章</h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#0a0a0a] text-white'
                      : 'border border-[#e5e5e5] bg-white hover:border-[#6366f1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>加载中...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>暂无文章</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.filter(p => p.id !== featuredPost?.id).map(post => (
                <article key={post.id} className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 hover:shadow-md transition-shadow">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6366f1]">{post.category}</span>
                  <h3 className="mt-2 text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{post.title}</h3>
                  <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{post.desc || post.excerpt || post.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{post.date || post.published_at}</span>
                    <Link to={`/blog/${post.slug || post.id}`} className="text-[13px] font-medium text-[#6366f1] hover:underline">
                      阅读 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {filteredPosts.length >= 10 && (
            <div className="mt-10 flex justify-center">
              <button className="rounded-full border border-[#e5e5e5] bg-white px-6 py-2.5 text-[14px] font-medium hover:border-[#6366f1] transition-colors">
                加载更多
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8 text-center">
            <h2 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>订阅 MoltyBox 博客</h2>
            <p className="mt-2 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>
              第一时间获取产品更新和技术分享，每月不超过 2 封邮件。
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 flex justify-center gap-3 flex-wrap">
              <input
                type="email"
                placeholder="您的邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-sm rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="rounded-full bg-[#0a0a0a] px-6 py-2.5 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50"
              >
                {subscribing ? '订阅中...' : '订阅'}
              </button>
            </form>
            {subscribeResult && (
              <p className={`mt-4 text-[14px] ${subscribeResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {subscribeResult.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}