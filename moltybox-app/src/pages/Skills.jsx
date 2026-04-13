import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchSkills, fetchSkillCategories, downloadSkill } from '../lib/api';

// 评级徽章组件
const RatingBadge = ({ level }) => {
  const colors = {
    'S': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    'A': 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white',
    'B': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    'C': 'bg-gray-200 text-gray-700',
    'D': 'bg-gray-100 text-gray-500',
  };
  const colorClass = colors[level] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${colorClass}`}>
      {level || '-'}
    </span>
  );
};

// 兼容性图标
const AgentIcons = ({ agents }) => {
  const agentList = agents || ['Claude Code'];
  return (
    <div className="flex items-center gap-1">
      {agentList.slice(0, 3).map((agent, i) => (
        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
          {agent}
        </span>
      ))}
      {agentList.length > 3 && (
        <span className="text-[10px] text-gray-400">+{agentList.length - 3}</span>
      )}
    </div>
  );
};

// 技能卡片组件
const SkillCard = ({ skill, onDownload }) => {
  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload(skill);
  };

  return (
    <Link
      to={`/skills/${skill.slug}`}
      className="group flex flex-col rounded-[14px] border border-[#e5e5e5] bg-white p-5 transition-all duration-200 hover:border-[#6366f1] hover:shadow-lg"
    >
      {/* 头部：作者 + 评级 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {skill.author_avatar_url ? (
            <img src={skill.author_avatar_url} alt={skill.author_name} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#eef2ff] flex items-center justify-center">
              <span className="text-[10px] font-semibold text-[#6366f1]">
                {skill.author_name?.[0] || '?'}
              </span>
            </div>
          )}
          <span className="text-[12px] text-gray-500">@{skill.author_name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2">
          <RatingBadge level={skill.rating_level} />
          {skill.rating_score > 0 && (
            <span className="text-[12px] font-medium text-gray-700">
              {skill.rating_score.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* 标题 */}
      <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-[#6366f1] transition-colors">
        {skill.name}
      </h3>

      {/* 描述 */}
      <p className="mt-2 text-[13px] text-gray-600 line-clamp-2 flex-1">
        {skill.description}
      </p>

      {/* 标签 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(skill.tags || []).slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-600">
            {tag}
          </span>
        ))}
      </div>

      {/* 底部：统计 + 兼容性 */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px] text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(skill.stars_count || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {(skill.download_count || 0).toLocaleString()}
          </span>
        </div>

        {/* 下载按钮 */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-[12px] font-medium text-gray-700 hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载
        </button>
      </div>
    </Link>
  );
};

// 分类卡片组件
const CategoryCard = ({ category }) => {
  const icons = {
    'development': '💻',
    'devops': '🔧',
    'testing': '🧪',
    'data': '📊',
    'ai-ml': '🤖',
    'automation': '⚡',
    'documentation': '📝',
    'communication': '💬',
    'content': '✍️',
    'research': '🔍',
    'design': '🎨',
    'business': '💼',
    'security': '🔒',
    'integration': '🔗',
    'utilities': '🛠️',
  };

  return (
    <Link
      to={`/skills?category=${category.slug}`}
      className="flex flex-col items-center justify-center p-4 rounded-[12px] border border-[#e5e5e5] bg-white hover:border-[#6366f1] hover:shadow-md transition-all"
    >
      <span className="text-2xl mb-2">{icons[category.slug] || '📦'}</span>
      <span className="text-[14px] font-medium text-gray-900">{category.name}</span>
      <span className="text-[12px] text-gray-500 mt-1">{category.skill_count || 0} 技能</span>
    </Link>
  );
};

export default function Skills() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('stars');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalCount, setTotalCount] = useState(0); // 所有技能总数（不受筛选影响）
  const [hasMore, setHasMore] = useState(false);

  // 首次加载获取所有技能总数
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const res = await fetchSkills({ page_size: 1 });
        const data = res.data?.data || res.data || [];
        setTotalCount(res.data?.total || data.length || 0);
      } catch (e) {
        console.error('Failed to fetch total count:', e);
      }
    };
    fetchTotalCount();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy, page]);

  // 同步 URL 参数
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory]);

  // 监听 URL 参数变化
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);

      // 构建请求参数，移除 undefined 值
      const params = {
        sort_by: sortBy,
        page,
        page_size: 12,
      };
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const [skillsRes, categoriesRes] = await Promise.all([
        fetchSkills(params),
        fetchSkillCategories(),
      ]);

      // 兼容两种 API 返回格式
      if (skillsRes && skillsRes.data) {
        // 新格式: { code: 0, message: "success", data: { data: [...], total, has_more } }
        // 旧格式: { data: [...] }
        const skillsData = Array.isArray(skillsRes.data) ? skillsRes.data : (skillsRes.data.data || []);

        if (page === 1) {
          setSkills(skillsData);
        } else {
          setSkills(prev => [...prev, ...skillsData]);
        }
        setTotal(skillsRes.data.total || skillsData.length);
        setHasMore(skillsRes.data.has_more || false);
      }

      if (categoriesRes && categoriesRes.data) {
        // 分类可能是字符串数组或对象数组
        const cats = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        setCategories(cats.map(c => typeof c === 'string' ? { slug: c, name: c, skill_count: 0 } : c));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleDownload = async (skill) => {
    try {
      const response = await downloadSkill(skill.slug);
      if (response.data?.content) {
        // 创建下载
        const blob = new Blob([response.data.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.data.filename || `${skill.slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (response.data?.download_url) {
        window.open(response.data.download_url, '_blank');
      } else if (skill.github_repo) {
        // 使用 GitHub URL 作为备选
        const githubUrl = skill.github_path
          ? `https://github.com/${skill.github_repo}/tree/main/${skill.github_path}`
          : `https://github.com/${skill.github_repo}`;
        window.open(githubUrl, '_blank');
      } else {
        alert('该技能暂无可下载内容');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请稍后重试');
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">技能市场</p>
            <h1 className="mt-3 text-[36px] font-semibold sm:text-[48px] text-gray-900">Agent 技能市场</h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto text-gray-600">
              发现并部署可复用的 AI Agent 技能。利用社区构建的专业能力扩展您的 Agent。
            </p>
          </div>

          {/* 统计数据 */}
          <div className="mt-10 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-[32px] font-semibold text-[#6366f1]">{totalCount.toLocaleString()}</p>
              <p className="text-[14px] text-gray-500">技能总数</p>
            </div>
            <div className="text-center">
              <p className="text-[32px] font-semibold text-[#6366f1]">{categories.length}</p>
              <p className="text-[14px] text-gray-500">分类</p>
            </div>
          </div>
        </div>
      </section>

      {/* 搜索和筛选 */}
      <section className="py-8 border-b border-[#e5e5e5] bg-white sticky top-16 z-40">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-[#e5e5e5] bg-white py-2.5 pl-10 pr-4 text-[14px] focus:outline-none focus:border-[#6366f1]"
              />
            </form>

            {/* 排序选择 */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] focus:outline-none cursor-pointer"
            >
              <option value="stars">按 Star 排序</option>
              <option value="downloads">按下载量排序</option>
              <option value="rating">按评分排序</option>
              <option value="newest">最新发布</option>
            </select>
          </div>

          {/* 分类标签 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-[#6366f1] text-white'
                  : 'border border-[#e5e5e5] bg-white text-gray-600 hover:border-[#6366f1]'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-[#6366f1] text-white'
                    : 'border border-[#e5e5e5] bg-white text-gray-600 hover:border-[#6366f1]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 技能列表 */}
      <section className="py-12">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="text-[14px] text-gray-500 mb-6">
            显示 {skills.length} 项，共 {total} 项技能
          </p>

          {loading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-[16px] font-medium text-gray-600">暂无技能数据</p>
              <p className="text-[14px] text-gray-400 mt-1">请稍后再来查看</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} onDownload={handleDownload} />
                ))}
              </div>

              {/* 加载更多 */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="rounded-full border border-[#e5e5e5] bg-white px-8 py-3 text-[14px] font-medium hover:border-[#6366f1] transition-colors disabled:opacity-50"
                  >
                    {loading ? '加载中...' : '加载更多'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 分类浏览 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">Categories</p>
            <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Browse by Category</h2>
            <p className="mt-2 text-gray-600">Find skills organized by domain. Each category contains curated tools built for specific workflows.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {categories.slice(0, 15).map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-[800px] px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">FAQ</p>
            <h2 className="mt-2 text-[28px] font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: '什么是 Agent Skills？', a: 'Skills 是扩展 AI Agent 功能的模块化能力。每个 Skill 包含指令、元数据和可选资源，AI Agent 会在相关场景自动调用。' },
              { q: '如何安装一个技能？', a: '点击技能卡片上的"下载"按钮，将 SKILL.md 文件保存到您的 Agent 技能目录中即可。' },
              { q: '技能是免费的吗？', a: '是的，所有来自社区的技能都是免费使用的。' },
              { q: '如何发布自己的技能？', a: '按照规范创建 SKILL.md 文件，推送到 GitHub 仓库，提交到技能市场即可。' },
            ].map((item, i) => (
              <details key={i} className="group rounded-[12px] border border-[#e5e5e5] bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-[14px] font-medium text-gray-900">
                  {item.q}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-[#e5e5e5] px-4 py-3 text-[14px] text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}