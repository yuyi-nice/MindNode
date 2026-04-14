import { useState, useEffect } from 'react';
import { getBillingInfo, createRecharge } from '../lib/api';

const rechargeAmounts = [
  { amount: 10, bonus: 0, popular: false },
  { amount: 20, bonus: 1, popular: false },
  { amount: 50, bonus: 5, popular: true },
  { amount: 100, bonus: 15, popular: false },
];

const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: 'alipay', enabled: true },
  { id: 'wechat', name: '微信支付', icon: 'wechat', enabled: true },
  { id: 'bank', name: '银行卡', icon: 'bank', enabled: false },
];

export default function DashboardBilling() {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [selectedPayment, setSelectedPayment] = useState('alipay');
  const [submitting, setSubmitting] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeOrder, setRechargeOrder] = useState(null);
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [autoRechargeThreshold, setAutoRechargeThreshold] = useState('1.00');
  const [autoRechargeAmount, setAutoRechargeAmount] = useState('10.00');

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      setLoading(true);
      const response = await getBillingInfo();
      if (response.data) {
        setBillingInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to load billing info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    try {
      setSubmitting(true);
      const response = await createRecharge(selectedAmount, selectedPayment);
      if (response.data) {
        setRechargeOrder(response.data);
        setShowRechargeModal(true);
      }
    } catch (error) {
      console.error('Failed to create recharge:', error);
      alert('创建充值订单失败');
    } finally {
      setSubmitting(false);
    }
  };

  const balance = billingInfo?.balance || 0;
  const totalRecharge = billingInfo?.total_recharge || 0;
  const totalConsumption = billingInfo?.total_consumption || 0;
  const transactions = billingInfo?.transactions || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
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
        <h1 className="text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>账单与充值</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          管理您的账户余额、充值记录和支付方式。
        </p>
      </div>

      {/* Balance & Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Current Balance */}
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
          <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            当前余额
          </div>
          <p className="mt-3 text-[32px] font-semibold" style={{ color: '#0a0a0a' }}>
            {loading ? '...' : `$${balance.toFixed(2)}`}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: '#525252' }}>≈ ¥{(balance * 7.24).toFixed(2)} CNY</p>
        </div>

        {/* Cumulative Recharge */}
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
          <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            累计充值
          </div>
          <p className="mt-3 text-[32px] font-semibold" style={{ color: '#16a34a' }}>
            {loading ? '...' : `$${totalRecharge.toFixed(2)}`}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: '#525252' }}>共 {transactions.filter(t => t.type === 'recharge').length} 笔充值</p>
        </div>

        {/* Cumulative Consumption */}
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
          <div className="flex items-center gap-2 text-[12px]" style={{ color: '#525252' }}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            累计消费
          </div>
          <p className="mt-3 text-[32px] font-semibold" style={{ color: '#dc2626' }}>
            {loading ? '...' : `$${totalConsumption.toFixed(2)}`}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: '#525252' }}>过去 30 天</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recharge Section */}
        <div className="lg:col-span-2 rounded-[16px] border border-[#e5e5e5] bg-white">
          <div className="border-b border-[#e5e5e5] p-6">
            <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>在线充值</h2>
            <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
              选择充值金额，立即可用。大额充值享受额外赠送。
            </p>
          </div>

          <div className="p-6">
            {/* Amount Selection */}
            <div className="mb-6">
              <h3 className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>选择充值金额</h3>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {rechargeAmounts.map((item) => (
                  <button
                    key={item.amount}
                    onClick={() => setSelectedAmount(item.amount)}
                    className={`relative rounded-[12px] border p-4 text-center transition-all ${
                      selectedAmount === item.amount
                        ? 'border-[#6366f1] bg-[#eef2ff]'
                        : 'border-[#e5e5e5] hover:border-[#6366f1]'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#f59e0b] px-2 py-0.5 text-[10px] font-medium text-white">
                        热门
                      </span>
                    )}
                    <p className="text-[20px] font-semibold" style={{ color: '#0a0a0a' }}>${item.amount}</p>
                    {item.bonus > 0 && (
                      <p className="mt-1 text-[12px]" style={{ color: '#16a34a' }}>
                        赠送${item.bonus}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>支付方式</h3>
              <div className="mt-3 space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-[12px] border p-4 transition-all ${
                      selectedPayment === method.id
                        ? 'border-[#6366f1] bg-[#eef2ff]'
                        : 'border-[#e5e5e5] hover:border-[#6366f1]'
                    } ${!method.enabled ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => method.enabled && setSelectedPayment(method.id)}
                        className="h-4 w-4"
                        disabled={!method.enabled}
                      />
                      <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>{method.name}</span>
                    </div>
                    {!method.enabled && (
                      <span className="text-[12px]" style={{ color: '#525252' }}>暂未开通</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-[12px] bg-[#fafafa] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: '#525252' }}>充值金额</span>
                <span className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>${selectedAmount}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[13px]" style={{ color: '#525252' }}>赠送金额</span>
                <span className="text-[14px] font-medium" style={{ color: '#16a34a' }}>
                  +${rechargeAmounts.find(r => r.amount === selectedAmount)?.bonus || 0}
                </span>
              </div>
              <div className="mt-3 border-t border-[#e5e5e5] pt-3 flex items-center justify-between">
                <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>实际到账</span>
                <span className="text-[20px] font-semibold" style={{ color: '#0a0a0a' }}>
                  ${selectedAmount + (rechargeAmounts.find(r => r.amount === selectedAmount)?.bonus || 0)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRecharge}
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-[#0a0a0a] py-3 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50"
            >
              {submitting ? '处理中...' : `确认充值 $${selectedAmount}`}
            </button>
          </div>
        </div>

        {/* Auto-Recharge Settings */}
        <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
          <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>自动充值</h2>
          <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
            设置自动充值，避免余额不足导致服务中断。
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>自动充值</p>
                <p className="text-[12px]" style={{ color: '#525252' }}>余额低于阈值时自动充值</p>
              </div>
              <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={autoRecharge}
                  onChange={(e) => setAutoRecharge(e.target.checked)}
                />
                <div className="absolute h-6 w-11 rounded-full bg-[#e5e5e5] transition-colors peer-checked:bg-[#6366f1]"></div>
                <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>

            {autoRecharge && (
              <div className="rounded-[12px] border border-[#e5e5e5] p-4">
                <p className="text-[13px] font-medium" style={{ color: '#0a0a0a' }}>充值阈值</p>
                <select
                  value={autoRechargeThreshold}
                  onChange={(e) => setAutoRechargeThreshold(e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="1.00">$1.00</option>
                  <option value="2.00">$2.00</option>
                  <option value="5.00">$5.00</option>
                  <option value="10.00">$10.00</option>
                </select>

                <p className="mt-4 text-[13px] font-medium" style={{ color: '#0a0a0a' }}>充值金额</p>
                <select
                  value={autoRechargeAmount}
                  onChange={(e) => setAutoRechargeAmount(e.target.value)}
                  className="mt-2 w-full rounded-[8px] border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="10.00">$10.00</option>
                  <option value="20.00">$20.00</option>
                  <option value="50.00">$50.00</option>
                  <option value="100.00">$100.00</option>
                </select>
              </div>
            )}

            <div className="rounded-[12px] bg-[#fffbeb] p-4">
              <div className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12px]" style={{ color: '#92400e' }}>
                  开启自动充值后，当余额低于阈值时，系统将自动从您选择的支付方式扣款充值。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#e5e5e5] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>最近交易</h2>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>查看您的充值和消费记录</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[14px]" style={{ color: '#525252' }}>加载中...</div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-[#e5e5e5]">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'recharge' ? 'bg-[#dcfce7]' : 'bg-[#fee2e2]'}`}>
                    {tx.type === 'recharge' ? (
                      <svg className="h-5 w-5 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>
                      {tx.type === 'recharge' ? '在线充值' : tx.description || 'API 调用消费'}
                    </p>
                    <p className="text-[12px]" style={{ color: '#525252' }}>{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <span className={`text-[16px] font-semibold ${tx.type === 'recharge' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                  {tx.type === 'recharge' ? '+' : ''}{tx.amount > 0 && tx.type === 'consumption' ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>暂无交易记录</p>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && rechargeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>充值订单已创建</h3>
            <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
              请在新窗口中完成支付。支付完成后，余额将自动到账。
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>订单号</span>
                <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>{rechargeOrder.order_id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>充值金额</span>
                <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>${rechargeOrder.amount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>支付方式</span>
                <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>
                  {paymentMethods.find(m => m.id === rechargeOrder.method)?.name || rechargeOrder.method}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[14px]" style={{ color: '#525252' }}>状态</span>
                <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[12px] font-medium text-[#d97706]">
                  待支付
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRechargeModal(false);
                  setRechargeOrder(null);
                }}
                className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  if (rechargeOrder.payment_url) {
                    window.open(rechargeOrder.payment_url, '_blank');
                  }
                }}
                className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
              >
                前往支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}