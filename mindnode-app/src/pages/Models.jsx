import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchModels, fetchModelBySlug, fetchProviders } from '../lib/api';

// 模型类型标签配置
const MODEL_TABS = [
  { key: 'llm', label: 'LLM', icon: '🧠', description: '大语言模型' },
  { key: 'image', label: '图像', icon: '🎨', description: '图像生成模型' },
  { key: 'audio', label: '音频', icon: '🎵', description: '语音处理模型' },
  { key: 'embedding', label: '嵌入', icon: '📊', description: '文本嵌入模型' },
];

// 能力标签颜色映射
const CAPABILITY_COLORS = {
  'reasoning': 'bg-blue-100 text-blue-700',
  'coding': 'bg-green-100 text-green-700',
  'math': 'bg-purple-100 text-purple-700',
  'creative': 'bg-pink-100 text-pink-700',
  'analysis': 'bg-indigo-100 text-indigo-700',
  'long-context': 'bg-orange-100 text-orange-700',
  'multimodal': 'bg-teal-100 text-teal-700',
  'text-to-image': 'bg-rose-100 text-rose-700',
  'text-to-speech': 'bg-amber-100 text-amber-700',
  'speech-to-text': 'bg-cyan-100 text-cyan-700',
  'semantic-search': 'bg-violet-100 text-violet-700',
  'agent': 'bg-emerald-100 text-emerald-700',
};

// 格式化上下文窗口大小
const formatContextWindow = (size) => {
  if (!size || size === 0) return '-';
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${(size / 1000).toFixed(0)}K`;
  return size.toString();
};

// 格式化价格
const formatPrice = (price, currency = 'CNY') => {
  if (price === 0) return '免费';
  return `¥${price.toFixed(2)}`;
};

// 模型卡片组件
const ModelCard = ({ model }) => {
  // 图片加载失败时使用降级显示
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  // 根据provider名称获取本地SVG图标
  const getLocalProviderIcon = (provider) => {
    const providerMap = {
      'DeepSeek': '/images/deepseek.svg',
      'Minimax': '/images/minimax.svg',
      'Moonshot': '/images/moonshot.svg',
      'Alibaba': '/images/qwen.svg',
      'Qwen': '/images/qwen.svg',
    };
    return providerMap[provider] || null;
  };

  const localIcon = getLocalProviderIcon(model.provider);

  return (
    <Link
      to={`/models/${model.slug}`}
      className="group flex flex-col rounded-[14px] border border-[#e5e5e5] bg-white p-5 transition-all duration-200 hover:border-[#6366f1] hover:shadow-lg"
    >
      {/* 头部：提供商 + 标签 */}
      <div className="flex items-start justify-between mb-3">
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
              <span className="text-[12px] font-semibold text-[#6366f1]">
                {model.provider?.[0] || 'M'}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-[#6366f1] transition-colors">
              {model.display_name || model.name}
            </h3>
            <p className="text-[12px] text-gray-500">{model.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {model.is_new && (
            <span className="rounded-full bg-[#10b981] px-2 py-0.5 text-[10px] font-medium text-white">
              NEW
            </span>
          )}
          {model.is_featured && (
            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-medium text-[#6366f1]">
              精选
            </span>
          )}
        </div>
      </div>

      {/* 描述 */}
      <p className="text-[13px] text-gray-600 line-clamp-2 flex-1">
        {model.description}
      </p>

      {/* 能力标签 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(model.capabilities || []).slice(0, 4).map((cap) => (
          <span
            key={cap}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${CAPABILITY_COLORS[cap] || 'bg-gray-100 text-gray-600'}`}
          >
            {cap}
          </span>
        ))}
      </div>

      {/* 底部：规格 + 价格 */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-[12px] text-gray-500">
          <div className="flex items-center gap-3">
            {model.context_window > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                {formatContextWindow(model.context_window)}
              </span>
            )}
            {model.type === 'llm' && model.max_output_tokens > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {formatContextWindow(model.max_output_tokens)} 输出
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[12px] font-medium text-gray-900">
              {formatPrice(model.pricing_input)}/{model.type === 'embedding' ? '1M tokens' : '1K tokens'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Models() {
  const [models, setModels] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('llm');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    loadModels();
  }, [activeTab, sortBy]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await fetchModels({ model_type: activeTab });
      let modelList = response.data || [];

      // 排序
      if (sortBy === 'featured') {
        modelList = modelList.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return a.sort_order - b.sort_order;
        });
      } else if (sortBy === 'newest') {
        modelList = modelList.sort((a, b) => {
          if (a.is_new && !b.is_new) return -1;
          if (!a.is_new && b.is_new) return 1;
          return 0;
        });
      } else if (sortBy === 'price-low') {
        modelList = modelList.sort((a, b) => a.pricing_input - b.pricing_input);
      } else if (sortBy === 'price-high') {
        modelList = modelList.sort((a, b) => b.pricing_input - a.pricing_input);
      }

      setModels(modelList);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await fetchProviders();
      setProviders(response.data || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  // 筛选模型
  const filteredModels = models.filter(model => {
    const matchesSearch = !searchQuery ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = !selectedProvider || model.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  // 统计
  const totalCount = models.length;
  const tabLabel = MODEL_TABS.find(t => t.key === activeTab)?.label || '模型';

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">模型市场</p>
            <h1 className="mt-3 text-[36px] font-semibold sm:text-[48px] text-gray-900">AI 模型市场</h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] mx-auto text-gray-600">
              一站式访问全球顶尖 AI 模型。从 GPT-4 到 Claude，从 DALL·E 到 Whisper，按需调用，统一计费。
            </p>
          </div>

          {/* 统计数据 */}
          <div className="mt-10 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-[32px] font-semibold text-[#6366f1]">{totalCount}</p>
              <p className="text-[14px] text-gray-500">{tabLabel}模型</p>
            </div>
            <div className="text-center">
              <p className="text-[32px] font-semibold text-[#6366f1]">{providers.length}</p>
              <p className="text-[14px] text-gray-500">提供商</p>
            </div>
          </div>
        </div>
      </section>

      {/* 标签页切换 */}
      <section className="py-4 border-b border-[#e5e5e5] bg-white sticky top-16 z-40">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 标签按钮 */}
            <div className="flex flex-wrap gap-2">
              {MODEL_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSelectedProvider(''); }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#6366f1] text-white'
                      : 'border border-[#e5e5e5] bg-white text-gray-600 hover:border-[#6366f1]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] focus:outline-none cursor-pointer"
            >
              <option value="featured">按推荐排序</option>
              <option value="newest">最新发布</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
            </select>
          </div>
        </div>
      </section>

      {/* 搜索和筛选 */}
      <section className="py-6 bg-[#fafafa]">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* 提供商筛选 */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="rounded-[10px] border border-[#e5e5e5] bg-white px-4 py-2.5 text-[14px] focus:outline-none cursor-pointer"
            >
              <option value="">全部提供商</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 模型列表 */}
      <section className="py-12">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="text-[14px] text-gray-500 mb-6">
            显示 {filteredModels.length} 项，共 {totalCount} 项 {tabLabel}模型
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-[16px] font-medium text-gray-600">暂无模型数据</p>
              <p className="text-[14px] text-gray-400 mt-1">请稍后再来查看</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 模型类型介绍 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">Model Types</p>
            <h2 className="mt-2 text-[28px] font-semibold text-gray-900">模型类型说明</h2>
            <p className="mt-2 text-gray-600">了解不同类型 AI 模型的用途和特点</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODEL_TABS.map((tab) => (
              <div
                key={tab.key}
                className="flex flex-col items-center justify-center p-6 rounded-[12px] border border-[#e5e5e5] bg-[#fafafa] hover:border-[#6366f1] hover:shadow-md transition-all cursor-pointer"
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="text-3xl mb-3">{tab.icon}</span>
                <span className="text-[16px] font-medium text-gray-900">{tab.label}</span>
                <span className="text-[13px] text-gray-500 mt-1">{tab.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-[800px] px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6366f1]">FAQ</p>
            <h2 className="mt-2 text-[28px] font-semibold text-gray-900">常见问题</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: '如何选择合适的模型？', a: '根据您的任务类型选择。文本生成任务选择 LLM，图像生成选择图像模型，语音处理选择音频模型。每个模型卡片上标注了其主要能力。' },
              { q: '价格如何计算？', a: '价格按实际使用的 token 数量计费。输入 token 和输出 token 有不同的价格，具体请查看每个模型的详情页。' },
              { q: '是否支持批量调用？', a: '是的，所有模型都支持 API 批量调用，可以通过 API Key 进行访问。' },
              { q: '模型的上下文窗口是什么意思？', a: '上下文窗口表示模型一次能处理的最大文本长度。更大的上下文窗口意味着模型能理解更长的文档或对话历史。' },
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