import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReferrals, exportReferralsCsv } from '../lib/api';

const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: '#dcfce7', color: '#16a34a', text: '已激活' },
    pending: { bg: '#fef3c7', color: '#d97706', text: '待激活' },
    expired: { bg: '#fee2e2', color: '#dc2626', text: '已过期' },
  };
  const { bg, color, text } = config[status] || config.pending;

  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: bg, color }}>
      {text}
    </span>
  );
};

export default function DashboardReferrals() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const response = await getReferrals();
      if (response.data) {
        setRecords(response.data);
      }
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportReferralsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referrals-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('导出失败');
    }
  };

  const totalInvites = records.length;
  const activeInvites = records.filter(r => r.status === 'active').length;
  const totalReward = records.reduce((sum, r) => sum + (r.reward || 0), 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>MOLTYBOX PARTNER</p>
        <h1 className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>我的邀请记录</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          查看邀请转化情况与奖励发放明细。
        </p>
      </div>

      {/* Stats Cards */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="grid grid-cols-3 divide-x divide-[#e5e5e5]">
          <div className="p-6">
            <p className="text-[12px]" style={{ color: '#525252' }}>累计邀请</p>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>{totalInvites}</p>
          </div>
          <div className="p-6">
            <p className="text-[12px]" style={{ color: '#525252' }}>有效邀请</p>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>{activeInvites}</p>
          </div>
          <div className="p-6">
            <p className="text-[12px]" style={{ color: '#525252' }}>累计奖励</p>
            <p className="mt-2 text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>${totalReward.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Records Table */}
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
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>
                      邀请对象
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>
                      邀请时间
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>
                      状态
                    </th>
                    <th className="px-6 py-4 text-right text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>
                      奖励
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-[14px]" style={{ color: '#525252' }}>暂无邀请记录</p>
                          <p className="mt-1 text-[13px]" style={{ color: '#737373' }}>邀请好友注册后，这里将显示邀请记录</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="hover:bg-[#fafafa]">
                        <td className="px-6 py-4">
                          <span className="text-[13px]" style={{ color: '#0a0a0a' }}>{record.invited_email || record.invitedEmail}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px]" style={{ color: '#525252' }}>{formatDate(record.invited_at || record.invitedAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[13px] font-medium" style={{ color: (record.reward || 0) > 0 ? '#16a34a' : '#525252' }}>
                            {(record.reward || 0) > 0 ? `+$${(record.reward || 0).toFixed(2)}` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {records.length > 0 && (
              <div className="flex items-center justify-between border-t border-[#e5e5e5] px-6 py-4">
                <p className="text-[12px]" style={{ color: '#525252' }}>
                  奖励发放可能存在账务延迟，请以最终结算为准。
                </p>
                <button
                  onClick={handleExport}
                  className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
                >
                  导出记录
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Referral Program Info */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
        <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>邀请计划说明</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ff] text-[12px] font-medium" style={{ color: '#6366f1' }}>
              1
            </div>
            <p className="text-[13px]" style={{ color: '#525252' }}>
              每成功邀请一位新用户注册并完成认证，您将获得 $5 奖励。
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ff] text-[12px] font-medium" style={{ color: '#6366f1' }}>
              2
            </div>
            <p className="text-[13px]" style={{ color: '#525252' }}>
              被邀请人首次充值后，您可额外获得充值金额 10% 的奖励。
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ff] text-[12px] font-medium" style={{ color: '#6366f1' }}>
              3
            </div>
            <p className="text-[13px]" style={{ color: '#525252' }}>
              奖励将直接发放至您的账户余额，可用于消费或提现。
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            to="/referral-program"
            className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
          >
            查看邀请计划详情
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}