import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserStats } from '../lib/api';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getUserStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>概览</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          配置工作区、查看使用情况，并管理账户级访问权限。
        </p>
      </div>

      {/* Usage Overview */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#e5e5e5] p-6">
          <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>使用概览</h2>
          <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
            查看过去 7 天的花费、稳定性和 API 活动实时指标。
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[12px] border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              当前余额
            </div>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>
              {loading ? '...' : `$${stats?.balance?.toFixed(2) || '0.00'}`}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
              7 天支出
            </div>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>
              {loading ? '...' : `$${stats?.total_consumption?.toFixed(2) || '0.00'}`}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              请求数（7 天）
            </div>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>
              {loading ? '...' : stats?.requests_7d || 0}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#e5e5e5] p-4">
            <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              成功率
            </div>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>
              {loading ? '...' : `${stats?.success_rate?.toFixed(1) || 100}%`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e5e5e5] px-6 py-4 bg-[#fafafa]">
          <p className="text-[13px]" style={{ color: '#525252' }}>
            需要更详细的数据？<Link to="/dashboard/usage" className="text-[#6366f1] hover:underline">打开完整账单历史和请求日志</Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard/usage')}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              查看使用情况
            </button>
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
            >
              打开账单
            </button>
          </div>
        </div>
      </div>

      {/* Developer Access */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#e5e5e5] p-6">
          <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>开发接入</h2>
          <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
            从创建密钥到调用模型的快速上线路径。
          </p>
        </div>

        <div className="divide-y divide-[#e5e5e5]">
          {/* Step 1 */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dcfce7]">
                <svg className="h-4 w-4 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>账户已创建</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
                <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>创建第一个 API 密钥</span>
            </div>
            <button
              onClick={() => navigate('/dashboard/api-keys')}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              获取密钥
            </button>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
                <svg className="h-4 w-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>测试模型端点并验证使用日志</span>
            </div>
            <button
              onClick={() => navigate('/models')}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              查看模型
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}