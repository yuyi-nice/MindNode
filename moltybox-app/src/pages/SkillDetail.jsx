import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSkillBySlug, downloadSkill } from '../lib/api';

// 评级徽章组件
const RatingBadge = ({ level, score }) => {
  const colors = {
    'S': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    'A': 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white',
    'B': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    'C': 'bg-gray-200 text-gray-700',
    'D': 'bg-gray-100 text-gray-500',
  };
  const colorClass = colors[level] || 'bg-gray-100 text-gray-600';

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-[12px] font-bold ${colorClass}`}>
        {level || '-'}
      </span>
      {score > 0 && (
        <span className="text-[16px] font-semibold text-gray-700">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default function SkillDetail() {
  const { slug } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadSkill();
  }, [slug]);

  const loadSkill = async () => {
    try {
      setLoading(true);
      const response = await fetchSkillBySlug(slug);
      if (response.data) {
        setSkill(response.data);
      }
    } catch (error) {
      console.error('Failed to load skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!skill || downloading) return;

    try {
      setDownloading(true);
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
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = () => {
    if (skill?.skill_content) {
      navigator.clipboard.writeText(skill.skill_content);
      alert('已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center">
        <p className="text-[18px] font-medium text-gray-600">技能不存在</p>
        <Link to="/skills" className="mt-4 text-[#6366f1] hover:underline">返回技能列表</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto max-w-[1000px] px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Link to="/skills" className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-700 mb-6">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回列表
        </Link>

        {/* 技能头部 */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              {/* 作者信息 */}
              <div className="flex items-center gap-2 mb-3">
                {skill.author_avatar_url ? (
                  <img src={skill.author_avatar_url} alt={skill.author_name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center">
                    <span className="text-[14px] font-semibold text-[#6366f1]">
                      {skill.author_name?.[0] || '?'}
                    </span>
                  </div>
                )}
                <span className="text-[14px] text-gray-500">@{skill.author_name || 'Unknown'}</span>
                <RatingBadge level={skill.rating_level} score={skill.rating_score} />
              </div>

              {/* 标题 */}
              <h1 className="text-[28px] font-semibold text-gray-900">{skill.name}</h1>

              {/* 描述 */}
              <p className="mt-2 text-[16px] text-gray-600">{skill.description}</p>

              {/* 标签 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(skill.tags || []).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-[13px] text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e5e5] text-[14px] font-medium text-gray-700 hover:border-[#6366f1] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloading ? '下载中...' : '下载技能'}
              </button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-6 pt-6 border-t border-[#e5e5e5] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">Stars</p>
              <p className="mt-1 text-[20px] font-semibold text-gray-900">{(skill.stars_count || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">下载量</p>
              <p className="mt-1 text-[20px] font-semibold text-gray-900">{(skill.download_count || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">版本</p>
              <p className="mt-1 text-[20px] font-semibold text-gray-900">{skill.version || '1.0.0'}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">分类</p>
              <p className="mt-1 text-[20px] font-semibold text-gray-900">{skill.category || '-'}</p>
            </div>
          </div>
        </div>

        {/* 兼容性 */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">兼容性</h2>
          <div className="flex flex-wrap gap-2">
            {(skill.supported_agents || ['Claude Code']).map((agent) => (
              <span key={agent} className="px-3 py-1.5 rounded-lg bg-[#eef2ff] text-[13px] text-[#6366f1]">
                {agent}
              </span>
            ))}
          </div>
        </div>

        {/* 技能内容 */}
        {skill.skill_content && (
          <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">技能内容</h2>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-[13px] text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {skill.skill_content}
              </pre>
            </div>
          </div>
        )}

        {/* 来源信息 */}
        {skill.github_repo && (
          <div className="mt-6 text-center">
            <a
              href={`https://github.com/${skill.github_repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-[#6366f1] transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              在 GitHub 上查看源码
            </a>
          </div>
        )}
      </div>
    </div>
  );
}