import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAgents, fetchAgentCategories } from '../lib/api';

const AgentCard = ({ agent }) => (
  <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-6 hover:shadow-lg transition-shadow hover:border-[#6366f1]">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{agent.name}</h3>
          {agent.is_featured && (
            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-medium" style={{ color: 'var(--v2-accent)' }}>
              精选
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{agent.tagline}</p>
        <p className="mt-3 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{agent.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {agent.skills?.slice(0, 3).map((skillId, idx) => (
            <span key={idx} className="rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-[11px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
              Skill #{skillId}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-[#e5e5e5] pt-4">
      <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
        <span>{(agent.usage_count || 0).toLocaleString()} 次使用</span>
        <span>★ {agent.rating?.toFixed(1) || 'N/A'}</span>
      </div>
      <button className="text-[13px] font-medium text-[#6366f1] hover:underline">
        了解详情 →
      </button>
    </div>
  </div>
);

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [agentsRes, categoriesRes] = await Promise.all([
          fetchAgents({}),
          fetchAgentCategories()
        ]);
        setAgents(agentsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAgents = selectedCategory === 'all'
    ? agents
    : agents.filter(agent => agent.category === selectedCategory);
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--v2-accent)' }}>智能体</p>
            <h1 className="mt-2 text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
              发现专业 AI 智能体
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto" style={{ color: 'var(--v2-fg-secondary)' }}>
              从客服到数据分析，从营销到研发，发现适合您业务场景的专业 AI 员工。
            </p>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>热门智能体</h2>
            <div className="flex gap-3">
              <select className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] focus:outline-none">
                <option>按热度排序</option>
                <option>最新发布</option>
                <option>按名称</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#6366f1] text-white'
                  : 'border border-[#e5e5e5] bg-white text-[#525252] hover:border-[#6366f1]'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#6366f1] text-white'
                    : 'border border-[#e5e5e5] bg-white text-[#525252] hover:border-[#6366f1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>加载中...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>暂无智能体数据</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <h2 className="text-[28px] font-semibold text-center" style={{ color: 'var(--v2-fg)' }}>按类别浏览</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.length > 0 ? (
              categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-[10px] border border-[#e5e5e5] bg-white p-4 text-[14px] font-medium hover:border-[#6366f1] hover:bg-[#eef2ff] transition-colors"
                >
                  {cat}
                </button>
              ))
            ) : (
              ['客户服务', '市场营销', '数据分析', '研发效能', '人力资源', '财务管理', '运营管理', '更多'].map(cat => (
                <button key={cat} className="rounded-[10px] border border-[#e5e5e5] bg-white p-4 text-[14px] font-medium hover:border-[#6366f1] hover:bg-[#eef2ff] transition-colors">
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
          <h2 className="text-[28px] font-semibold" style={{ color: 'var(--v2-fg)' }}>没有找到合适的智能体？</h2>
          <p className="mt-4 text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
            我们可以为您定制专属 AI 智能体，完美匹配您的业务流程。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/skills" className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-6 py-3 text-[14px] font-medium hover:scale-[1.02] transition-transform">
              浏览技能库
            </Link>
            <Link to="/enterprise" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[14px] font-medium text-white hover:scale-[1.02] transition-transform">
              联系定制
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
