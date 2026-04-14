import { useState, useEffect } from 'react';
import { fetchModels } from '../lib/api';

const ModelCard = ({ model }) => {
  const contextSize = model.context_window >= 1000000
    ? `${(model.context_window / 1000000).toFixed(1)}M`
    : `${(model.context_window / 1000).toFixed(0)}K`;

  // 图片加载失败时使用降级显示
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  // 根据provider名称获取本地SVG图标（如果存在）
  const getLocalProviderIcon = (provider) => {
    const providerMap = {
      'DeepSeek': '/images/deepseek.svg',
      'Minimax': '/images/minimax.svg',
      'Moonshot': '/images/moonshot.svg',
      'Qwen': '/images/qwen.svg',
      'Alibaba': '/images/qwen.svg',
    };
    return providerMap[provider] || null;
  };

  const localIcon = getLocalProviderIcon(model.provider);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[14px] border border-[#e5e5e5] bg-white p-5 transition-all duration-200 hover:border-[#6366f1] hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {model.provider_logo && (
            <img
              alt={model.provider}
              className="h-8 w-8 rounded"
              src={localIcon || model.provider_logo}
              onError={handleImageError}
            />
          )}
          {!model.provider_logo && !localIcon && (
            <div className="h-8 w-8 rounded bg-[#eef2ff] flex items-center justify-center">
              <span className="text-[12px] font-semibold" style={{ color: 'var(--v2-accent)' }}>
                {model.provider?.[0] || 'M'}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--v2-fg)' }}>{model.display_name || model.name}</h3>
            <p className="text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{model.provider}</p>
          </div>
        </div>
        {model.is_featured && (
          <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[11px] font-medium" style={{ color: 'var(--v2-accent)' }}>
            精选
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{model.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {model.input_types?.slice(0, 3).map((type) => (
          <span key={type} className="rounded-[6px] bg-[#f5f5f5] px-2 py-1 text-[11px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
            {type}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="text-[12px]" style={{ color: 'var(--v2-fg-tertiary)' }}>
          <span className="font-medium">{contextSize}</span> context
        </div>
        <button className="rounded-full border border-[#e5e5e5] px-3 py-1.5 text-[12px] font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:border-[#6366f1] hover:text-[#6366f1]">
          了解详情
        </button>
      </div>
    </div>
  );
};

export default function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetchModels({});
        setModels(response.data || []);
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[36px] font-semibold" style={{ color: 'var(--v2-fg)' }}>模型</h1>
              <p className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>共 {models.length} 个模型</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-[8px] border border-[#e5e5e5] bg-white p-2 ${viewMode === 'list' ? 'text-[#6366f1]' : ''}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-[8px] border border-[#e5e5e5] bg-white p-2 ${viewMode === 'grid' ? 'text-[#6366f1]' : ''}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="搜索模型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-[#e5e5e5] bg-white py-2.5 pl-10 pr-4 text-[14px] focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <select className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] focus:outline-none">
              <option>最新</option>
              <option>最热</option>
            </select>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            {/* Filters Sidebar */}
            <aside className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold" style={{ color: 'var(--v2-fg)' }}>筛选</h2>
                  <button className="text-[12px] text-[#6366f1]">清除</button>
                </div>
              </div>

              {/* Input Type */}
              <div>
                <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--v2-fg)' }}>输入类型</h3>
                <div className="space-y-2">
                  {['文本', '图像', '文件', '音频', '视频'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Context Window */}
              <div>
                <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--v2-fg)' }}>上下文窗口</h3>
                <div className="space-y-2">
                  {['全部', '4K+', '8K+', '16K+', '32K+', '64K+', '128K+', '256K+'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={type === '全部'} className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Provider */}
              <div>
                <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--v2-fg)' }}>提供商</h3>
                <div className="space-y-2">
                  {['DeepSeek', 'OpenAI', 'Google', 'Alibaba', 'Moonshot', 'MiniMax', 'ByteDance'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Models Grid */}
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>加载中...</p>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>暂无模型数据</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
