import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchModelBySlug, fetchModels } from '../lib/api';

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
  'search': 'bg-yellow-100 text-yellow-700',
};

// 能力中文映射
const CAPABILITY_NAMES = {
  'reasoning': '推理',
  'coding': '编程',
  'math': '数学',
  'creative': '创意',
  'analysis': '分析',
  'long-context': '长上下文',
  'multimodal': '多模态',
  'text-to-image': '文本生成图像',
  'text-to-speech': '文本转语音',
  'speech-to-text': '语音转文本',
  'semantic-search': '语义搜索',
  'agent': '智能体',
  'search': '搜索',
  'voice-clone': '语音克隆',
  'emotion': '情感表达',
  'translation': '翻译',
  'clustering': '聚类',
  'reranking': '重排序',
  'similarity': '相似度',
  'high-quality': '高质量',
  'artistic': '艺术风格',
  'editing': '图像编辑',
  'image-to-image': '图像转换',
  'natural': '自然语音',
  'multi-voice': '多语音',
  'multilingual': '多语言',
};

// 格式化上下文窗口大小
const formatContextWindow = (size) => {
  if (!size || size === 0) return '-';
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${(size / 1000).toFixed(0)}K`;
  return size.toString();
};

// 格式化价格
const formatPrice = (price, unit = '1K tokens') => {
  if (price === 0) return '免费';
  return `¥${price.toFixed(2)}/${unit}`;
};

// 模型类型图标
const MODEL_TYPE_ICONS = {
  'llm': { icon: '🧠', label: '大语言模型' },
  'image': { icon: '🎨', label: '图像模型' },
  'audio': { icon: '🎵', label: '音频模型' },
  'embedding': { icon: '📊', label: '嵌入模型' },
};

export default function ModelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [relatedModels, setRelatedModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, [slug]);

  const loadModel = async () => {
    try {
      setLoading(true);
      const response = await fetchModelBySlug(slug);
      if (response.data) {
        setModel(response.data);
        // 加载相关模型（同类型或同提供商）
        loadRelatedModels(response.data);
      }
    } catch (error) {
      console.error('Failed to load model:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedModels = async (currentModel) => {
    try {
      const response = await fetchModels({ model_type: currentModel.type });
      const models = response.data || [];
      // 排除当前模型，取同提供商或同类型的其他模型
      const related = models
        .filter(m => m.slug !== currentModel.slug)
        .filter(m => m.provider === currentModel.provider || m.is_featured)
        .slice(0, 4);
      setRelatedModels(related);
    } catch (error) {
      console.error('Failed to load related models:', error);
    }
  };

  // 图片加载失败处理
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  // 获取本地图标
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

  const localIcon = model ? getLocalProviderIcon(model.provider) : null;
  const typeInfo = model ? MODEL_TYPE_ICONS[model.type] : { icon: '🤖', label: '模型' };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center">
        <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[18px] font-medium text-gray-600">模型不存在</p>
        <Link to="/models" className="mt-4 text-[#6366f1] hover:underline">返回模型列表</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto max-w-[1000px] px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Link
          to="/models"
          className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回模型列表
        </Link>

        {/* 模型头部 */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {/* 提供商信息 */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  alt={model.provider}
                  className="h-10 w-10 rounded"
                  src={localIcon || model.provider_logo}
                  onError={handleImageError}
                />
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-gray-500">{model.provider}</span>
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <span className="text-[12px] text-gray-400">{typeInfo.label}</span>
                </div>
                {model.is_new && (
                  <span className="rounded-full bg-[#10b981] px-2.5 py-1 text-[11px] font-medium text-white">
                    NEW
                  </span>
                )}
                {model.is_featured && (
                  <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[11px] font-medium text-[#6366f1]">
                    精选
                  </span>
                )}
              </div>

              {/* 名称 */}
              <h1 className="text-[28px] font-semibold text-gray-900">
                {model.display_name || model.name}
              </h1>

              {/* 描述 */}
              <p className="mt-2 text-[16px] text-gray-600">{model.description}</p>

              {/* 详细描述 */}
              {model.long_description && (
                <p className="mt-3 text-[14px] text-gray-500 leading-[22px]">
                  {model.long_description}
                </p>
              )}

              {/* 能力标签 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(model.capabilities || []).map((cap) => (
                  <span
                    key={cap}
                    className={`px-3 py-1 rounded-full text-[13px] font-medium ${CAPABILITY_COLORS[cap] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {CAPABILITY_NAMES[cap] || cap}
                  </span>
                ))}
              </div>

              {/* 输入输出类型 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(model.input_types || []).map((type) => (
                  <span key={`in-${type}`} className="px-2.5 py-1 rounded-[6px] bg-[#eef2ff] text-[12px] text-[#6366f1]">
                    输入: {type}
                  </span>
                ))}
                {(model.output_types || []).map((type) => (
                  <span key={`out-${type}`} className="px-2.5 py-1 rounded-[6px] bg-[#fef3c7] text-[12px] text-[#92400e]">
                    输出: {type}
                  </span>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0a0a0a] text-[14px] font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                立即使用
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#e5e5e5] text-[14px] font-medium text-gray-700 hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API 文档
              </button>
            </div>
          </div>
        </div>

        {/* 技术规格 */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">技术规格</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {model.context_window > 0 && (
              <div className="p-4 rounded-[10px] bg-[#fafafa]">
                <p className="text-[12px] text-gray-500 uppercase tracking-wider">上下文窗口</p>
                <p className="mt-1 text-[20px] font-semibold text-gray-900">{formatContextWindow(model.context_window)}</p>
                <p className="text-[11px] text-gray-400 mt-1">tokens</p>
              </div>
            )}
            {model.max_output_tokens > 0 && model.type === 'llm' && (
              <div className="p-4 rounded-[10px] bg-[#fafafa]">
                <p className="text-[12px] text-gray-500 uppercase tracking-wider">最大输出</p>
                <p className="mt-1 text-[20px] font-semibold text-gray-900">{formatContextWindow(model.max_output_tokens)}</p>
                <p className="text-[11px] text-gray-400 mt-1">tokens</p>
              </div>
            )}
            <div className="p-4 rounded-[10px] bg-[#fafafa]">
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">模型家族</p>
              <p className="mt-1 text-[20px] font-semibold text-gray-900">{model.family || model.provider}</p>
            </div>
            <div className="p-4 rounded-[10px] bg-[#fafafa]">
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">支持语言</p>
              <p className="mt-1 text-[16px] font-semibold text-gray-900">
                {(model.supported_languages || []).map(l => l.toUpperCase()).join(' / ')}
              </p>
            </div>
          </div>
        </div>

        {/* 价格信息 */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">定价信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-[10px] bg-[#eef2ff]">
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">输入价格</p>
              <p className="mt-1 text-[24px] font-semibold text-[#6366f1]">
                {formatPrice(model.pricing_input, model.type === 'embedding' ? '1M tokens' : '1K tokens')}
              </p>
              <p className="text-[12px] text-gray-400 mt-1">每千 tokens 输入成本</p>
            </div>
            <div className="p-4 rounded-[10px] bg-[#fef3c7]">
              <p className="text-[12px] text-gray-500 uppercase tracking-wider">输出价格</p>
              <p className="mt-1 text-[24px] font-semibold text-[#92400e]">
                {formatPrice(model.pricing_output, model.type === 'embedding' ? '' : '1K tokens')}
              </p>
              <p className="text-[12px] text-gray-400 mt-1">每千 tokens 输出成本</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-gray-500">
            * 实际费用按 token 数量精确计算，价格单位为人民币（CNY）
          </p>
        </div>

        {/* 模型 ID */}
        <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">调用示例</h2>
          <div className="bg-[#1e1e1e] rounded-[10px] p-4 text-[13px] font-mono text-[#d4d4d4]">
            <pre className="overflow-x-auto">
{`// API 调用示例
const response = await fetch('https://api.mindnode.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: '${model.slug}',
    messages: [
      { role: 'user', content: '你好，请介绍一下你自己' }
    ]
  })
});`}
            </pre>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-500">模型 ID:</span>
              <code className="px-2 py-1 rounded bg-[#f5f5f5] text-[13px] font-mono text-gray-700">{model.slug}</code>
            </div>
          </div>
        </div>

        {/* 相关模型 */}
        {relatedModels.length > 0 && (
          <div className="bg-white rounded-[14px] border border-[#e5e5e5] p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">相关模型</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedModels.map((relModel) => (
                <Link
                  key={relModel.id}
                  to={`/models/${relModel.slug}`}
                  className="p-4 rounded-[10px] border border-[#e5e5e5] hover:border-[#6366f1] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      alt={relModel.provider}
                      className="h-6 w-6 rounded"
                      src={getLocalProviderIcon(relModel.provider) || relModel.provider_logo}
                      onError={handleImageError}
                    />
                    <span className="text-[12px] text-gray-500">{relModel.provider}</span>
                  </div>
                  <p className="text-[14px] font-medium text-gray-900">{relModel.display_name || relModel.name}</p>
                  <p className="mt-1 text-[12px] text-gray-500 line-clamp-1">{relModel.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}