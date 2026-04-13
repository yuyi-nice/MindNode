import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsageHistory, exportUsageCsv } from '../lib/api';

const EventTypeBadge = ({ type }) => {
  const config = {
    completion: { bg: '#eef2ff', color: '#6366f1', text: '对话完成' },
    embedding: { bg: '#dcfce7', color: '#16a34a', text: '嵌入' },
    image: { bg: '#fef3c7', color: '#d97706', text: '图像生成' },
    error: { bg: '#fee2e2', color: '#dc2626', text: '错误' },
  };
  const { bg, color, text } = config[type] || config.completion;

  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: bg, color }}>
      {text}
    </span>
  );
};

const StatusIcon = ({ status }) => {
  if (status === 'success') {
    return (
      <svg className="h-5 w-5 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export default function DashboardUsage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [filterModel, setFilterModel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadUsageHistory();
  }, [dateRange]);

  const loadUsageHistory = async (newOffset = 0) => {
    try {
      setLoading(true);
      const response = await getUsageHistory({
        limit,
        offset: newOffset,
      });
      if (response.data) {
        setRecords(response.data.records || []);
        setTotal(response.data.total || 0);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error('Failed to load usage history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportUsageCsv({ date_range: dateRange });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usage-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('导出失败');
    }
  };

  const handleRefresh = () => {
    loadUsageHistory(offset);
  };

  const filteredRecords = records.filter(record => {
    if (filterStatus !== 'all' && record.status !== filterStatus) return false;
    if (filterModel !== 'all' && record.model !== filterModel) return false;
    return true;
  });

  const models = [...new Set(records.map(r => r.model))];

  const totalTokens = filteredRecords.reduce((sum, r) => sum + (r.input_tokens || 0) + (r.output_tokens || 0), 0);
  const totalCost = filteredRecords.reduce((sum, r) => sum + (r.cost || 0), 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>使用历史</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          查看您的 API 调用历史记录，包括模型使用情况、Token 消耗和费用明细。
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <p className="text-[12px]" style={{ color: '#525252' }}>总请求数</p>
          <p className="mt-1 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>{total}</p>
        </div>
        <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <p className="text-[12px]" style={{ color: '#525252' }}>成功请求</p>
          <p className="mt-1 text-[24px] font-semibold" style={{ color: '#16a34a' }}>
            {filteredRecords.filter(r => r.status === 'success').length}
          </p>
        </div>
        <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <p className="text-[12px]" style={{ color: '#525252' }}>总 Token 数</p>
          <p className="mt-1 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>{totalTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <p className="text-[12px]" style={{ color: '#525252' }}>总费用</p>
          <p className="mt-1 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>${totalCost.toFixed(4)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-[13px] font-medium" style={{ color: '#0a0a0a' }}>时间范围</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-1.5 rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="24h">过去 24 小时</option>
              <option value="7days">过去 7 天</option>
              <option value="30days">过去 30 天</option>
              <option value="90days">过去 90 天</option>
              <option value="all">全部</option>
            </select>
          </div>

          <div>
            <label className="text-[13px] font-medium" style={{ color: '#0a0a0a' }}>模型</label>
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="mt-1.5 rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="all">全部模型</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[13px] font-medium" style={{ color: '#0a0a0a' }}>状态</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1.5 rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="all">全部状态</option>
              <option value="success">成功</option>
              <option value="error">失败</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleExport}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              导出 CSV
            </button>
            <button
              onClick={handleRefresh}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[14px]" style={{ color: '#525252' }}>加载中...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>状态</th>
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>时间</th>
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>模型</th>
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>类型</th>
                    <th className="px-6 py-4 text-right text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>Token</th>
                    <th className="px-6 py-4 text-right text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>费用</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-[#fafafa]">
                      <td className="px-6 py-4">
                        <StatusIcon status={record.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-medium" style={{ color: '#0a0a0a' }}>{formatDate(record.timestamp)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px]" style={{ color: '#0a0a0a' }}>{record.model}</span>
                      </td>
                      <td className="px-6 py-4">
                        <EventTypeBadge type={record.event_type || 'completion'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px]" style={{ color: '#525252' }}>
                          {((record.input_tokens || 0) + (record.output_tokens || 0)).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px] font-medium" style={{ color: record.cost > 0 ? '#dc2626' : '#525252' }}>
                          {record.cost > 0 ? `-$${record.cost.toFixed(4)}` : '$0.00'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredRecords.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>暂无使用记录</p>
                <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>开始使用 API 后，这里将显示您的使用历史</p>
              </div>
            )}

            {/* Pagination */}
            {total > limit && (
              <div className="flex items-center justify-between border-t border-[#e5e5e5] px-6 py-4">
                <p className="text-[13px]" style={{ color: '#525252' }}>
                  显示 {offset + 1}-{Math.min(offset + limit, total)} 条，共 {total} 条
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadUsageHistory(offset - limit)}
                    disabled={offset === 0}
                    className="rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-1.5 text-[13px] font-medium hover:border-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    上一页
                  </button>
                  <span className="text-[13px]" style={{ color: '#525252' }}>
                    第 {currentPage} / {totalPages} 页
                  </span>
                  <button
                    onClick={() => loadUsageHistory(offset + limit)}
                    disabled={offset + limit >= total}
                    className="rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-1.5 text-[13px] font-medium hover:border-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* API Reference */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
        <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>API 使用指南</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>Token 计算</p>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                Token 是模型处理文本的基本单位。一般来说，1 个 Token 约等于 4 个英文字符或 2 个中文字符。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>费用明细</p>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                不同模型的定价不同。费用 = (输入 Token 数 × 输入单价) + (输出 Token 数 × 输出单价)。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => navigate('/documentation')}
            className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
          >
            查看 API 文档
          </button>
        </div>
      </div>
    </div>
  );
}