import { useState, useEffect } from 'react';
import { fetchHardware } from '../lib/api';

export default function Hardware() {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHardware();
  }, []);

  const loadHardware = async () => {
    try {
      setLoading(true);
      const response = await fetchHardware();
      setHardware(response.data || []);
    } catch (error) {
      console.error('Failed to load hardware:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    window.open('https://moltybox.shop/', '_blank');
  };

  // 默认硬件信息（当 API 无数据时使用）
  const defaultHardware = {
    name: 'MindNode AI 私人助理 · Mini 主机',
    price: '¥2999',
    description: '通电即用 · 预装 OpenClaw 和 MoltyBot · 零门槛部署 · 私有化安全',
    features: [
      { title: '开箱即用', desc: '无需技术配置' },
      { title: '私有安全', desc: '数据本地存储' },
      { title: '全能助手', desc: '支持 Minimax、kimi、Claude、GPT-4o 等' },
      { title: '远程访问', desc: '通过 WhatsApp / 钉钉 / 飞书 / 企业微信控制' },
      { title: '全天运行', desc: '低功耗、静音运行' },
      { title: '纯净系统', desc: '无广告、无弹窗' },
    ],
    specs: [
      ['处理器', 'Intel Core i7 四核八线程'],
      ['内存', '8GB 运行内存'],
      ['存储', '256GB 固态硬盘'],
      ['系统', 'Windows'],
      ['接口', 'HDMI、USB 3.0、RJ45 网口'],
      ['无线', 'Wi-Fi 802.11ac、蓝牙 4.0'],
      ['电源', '12V 3A 电源适配器'],
    ],
    whyChoose: [
      '软硬件一体化 - 专为 AI 智能体预配置',
      '私有化部署 - 您的数据，您做主',
      '远程控制 - 随时随地通过手机访问',
      '丰富工具生态 - 网络搜索、浏览器自动化、文件操作',
      '多模型支持 - Claude、GPT-4o，自动回退',
      '自动化任务 - 定时日报、新闻摘要',
    ]
  };

  const hwData = hardware.length > 0 ? hardware[0] : defaultHardware;

  // 将 specs 对象转换为数组格式
  const getSpecsArray = (specs) => {
    if (!specs) return defaultHardware.specs;
    if (Array.isArray(specs)) return specs;
    // 如果是对象，转换为 [key, value] 数组
    const specLabels = {
      processor: '处理器',
      memory: '内存',
      storage: '存储',
      os: '系统',
      network: '网络',
      ports: '接口'
    };
    return Object.entries(specs).map(([key, value]) => [
      specLabels[key] || key,
      value
    ]);
  };

  // 格式化价格
  const formatPrice = (price, currency = 'CNY') => {
    if (!price) return '¥2999';
    // API 返回的是分，需要转换为元
    const priceNum = typeof price === 'number' ? price / 100 : price;
    return currency === 'CNY' ? `¥${priceNum.toLocaleString()}` : `$${priceNum.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-[36px] font-semibold sm:text-[48px]" style={{ color: 'var(--v2-fg)' }}>
                {loading ? 'MindNode AI 私人助理 · Mini 主机' : hwData.name}
              </h1>
              <p className="mt-4 text-[16px] leading-[26px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                {loading ? '通电即用 · 预装 OpenClaw 和 MoltyBot · 零门槛部署 · 私有化安全' : (hwData.tagline || hwData.short_description || '通电即用 · 预装 OpenClaw 和 MoltyBot · 零门槛部署 · 私有化安全')}
              </p>
              <p className="mt-6 text-[32px] font-semibold" style={{ color: 'var(--v2-fg)' }}>
                {loading ? '¥2999' : formatPrice(hwData.price, hwData.currency)}
              </p>
              <p className="mt-4 text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                您的第一台开箱即用的 AI 智能体服务器。预装 Windows、OpenClaw 和 MoltyBot，无需复杂配置。
              </p>
              <ul className="mt-6 space-y-4">
                {(loading ? defaultHardware.features : (hwData.features || defaultHardware.features)).map(item => (
                  <li key={item.title || item} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      {typeof item === 'object' ? (
                        <>
                          <span className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>{item.title}</span>
                          <span className="ml-2 text-[13px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item.desc}</span>
                        </>
                      ) : (
                        <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleBuy}
                className="mt-8 rounded-full bg-[#0a0a0a] px-8 py-3 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
              >
                立即购买
              </button>
            </div>
            <div className="relative min-h-[300px] sm:min-h-[400px]">
              <img
                src={hwData.cover_image || hwData.images?.[0] || "/images/openclaw-device.webp"}
                alt={hwData.name || "Moltybox mini host"}
                className="h-full w-full object-contain rounded-[14px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--v2-bg-page)' }}>
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-[24px] font-semibold" style={{ color: 'var(--v2-fg)' }}>为什么选择 MindNode？</h3>
              <p className="mt-4 text-[16px]" style={{ color: 'var(--v2-fg-secondary)' }}>
                告别复杂的 AI 部署。MindNode 消除了复杂的部署、昂贵的云服务器和隐私担忧。
              </p>
              <ul className="mt-6 space-y-4">
                {(loading ? defaultHardware.whyChoose : (hwData.why_choose || defaultHardware.whyChoose)).map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[14px]" style={{ color: 'var(--v2-fg-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-h-[300px] sm:min-h-[400px]">
              <img
                src={hwData.images?.[1] || hwData.cover_image || "/images/openclaw-device.webp"}
                alt="Moltybox front view"
                className="h-full w-full object-contain rounded-[14px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="rounded-[14px] border border-[#e5e5e5] bg-white p-8">
            <h3 className="text-[20px] font-semibold" style={{ color: 'var(--v2-fg)' }}>标准配置</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {getSpecsArray(hwData.specs).map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#e5e5e5] pb-3">
                  <span className="text-[14px]" style={{ color: 'var(--v2-fg-tertiary)' }}>{label}</span>
                  <span className="text-[14px] font-medium" style={{ color: 'var(--v2-fg)' }}>{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleBuy}
              className="mt-8 w-full rounded-full bg-[#0a0a0a] py-3 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
            >
              立即购买
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
