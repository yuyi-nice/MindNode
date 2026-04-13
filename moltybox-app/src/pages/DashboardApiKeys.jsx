import { useState, useEffect } from 'react';
import { getApiKeys, createApiKey, revokeApiKey, getApiKey } from '../lib/api';

const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: '#dcfce7', color: '#16a34a', text: '正常' },
    expired: { bg: '#fee2e2', color: '#dc2626', text: '已过期' },
    disabled: { bg: '#f5f5f5', color: '#525252', text: '已禁用' },
  };
  const { bg, color, text } = config[status] || config.disabled;

  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: bg, color }}>
      {text}
    </span>
  );
};

export default function DashboardApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState(365);
  const [createdKey, setCreatedKey] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await getApiKeys();
      if (response.data) {
        setApiKeys(response.data.map(key => ({
          ...key,
          createdAt: key.created_at?.split('T')[0] || key.createdAt,
          lastUsed: key.last_used_at?.split('T')[0] || key.lastUsed,
        })));
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      alert('请输入密钥名称');
      return;
    }

    try {
      setSubmitting(true);
      const response = await createApiKey({
        name: newKeyName,
        expires_in_days: newKeyExpiry
      });

      if (response.data) {
        setCreatedKey(response.data);
        setNewKeyName('');
        setNewKeyExpiry(365);
        loadApiKeys();
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('创建密钥失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeKey = async () => {
    if (!selectedKey) return;

    try {
      setSubmitting(true);
      await revokeApiKey(selectedKey.id);
      setShowRevokeModal(false);
      setSelectedKey(null);
      loadApiKeys();
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      alert('吊销密钥失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = async (key) => {
    try {
      const response = await getApiKey(key.id);
      if (response.data) {
        setSelectedKey(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Failed to get API key detail:', error);
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    if (typeof date === 'string') return date.split('T')[0];
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>API 密钥</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          管理您的 API 密钥。密钥用于通过 API 访问 MoltyBox 服务。
        </p>
      </div>

      {/* API Keys Table */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] p-6">
          <div>
            <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>API 密钥列表</h2>
            <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
              共 {apiKeys.length} 个密钥，{apiKeys.filter(k => k.status === 'active').length} 个有效
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
          >
            创建 API 密钥
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[14px]" style={{ color: '#525252' }}>加载中...</div>
          </div>
        ) : (
          <>
            {apiKeys.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e5]">
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>名称</th>
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>密钥</th>
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>创建时间</th>
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>最后使用</th>
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>请求数/限制</th>
                      <th className="px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>状态</th>
                      <th className="px-6 py-4 text-right text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5e5]">
                    {apiKeys.map((apiKey) => (
                      <tr key={apiKey.id} className="hover:bg-[#fafafa]">
                        <td className="px-6 py-4">
                          <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>{apiKey.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="rounded-[4px] bg-[#f5f5f5] px-2 py-1 text-[13px]" style={{ color: '#0a0a0a' }}>
                              {apiKey.key?.substring(0, 16)}...
                            </code>
                            <button
                              onClick={() => handleCopyKey(apiKey.key)}
                              className="rounded p-1 hover:bg-[#e5e5e5]"
                              title="复制密钥"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px]" style={{ color: '#525252' }}>{formatDate(apiKey.created_at || apiKey.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px]" style={{ color: '#525252' }}>{formatDate(apiKey.last_used_at || apiKey.lastUsed)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px]" style={{ color: '#525252' }}>
                            {apiKey.request_count || 0} / {apiKey.request_limit || 1000}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={apiKey.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {apiKey.status === 'active' && (
                              <button
                                onClick={() => {
                                  setSelectedKey(apiKey);
                                  setShowRevokeModal(true);
                                }}
                                className="rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[12px] font-medium hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"
                              >
                                吊销
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetail(apiKey)}
                              className="rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[12px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
                            >
                              详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {apiKeys.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>暂无 API 密钥</p>
                <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>创建第一个 API 密钥以开始使用</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 rounded-full bg-[#0a0a0a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
                >
                  创建 API 密钥
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Security Tips */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
        <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>安全提示</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>密钥安全</p>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                请勿将 API 密钥分享给他人或提交到公开代码仓库。定期轮换密钥以提高安全性。
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>使用环境变量</p>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                建议在环境变量中存储密钥，而不是直接硬编码在代码中。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            {!createdKey ? (
              <>
                <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>创建 API 密钥</h3>
                <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
                  创建一个新的 API 密钥用于访问 MoltyBox 服务。
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>密钥名称</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="例如：生产环境密钥"
                      className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>有效期</label>
                    <select
                      value={newKeyExpiry}
                      onChange={(e) => setNewKeyExpiry(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                    >
                      <option value={30}>30 天</option>
                      <option value={90}>90 天</option>
                      <option value={180}>180 天</option>
                      <option value={365}>365 天</option>
                      <option value={0}>永不过期</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewKeyName('');
                      setNewKeyExpiry(365);
                    }}
                    className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={submitting}
                    className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? '创建中...' : '创建'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>密钥创建成功</h3>
                <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
                  请立即复制并保存您的密钥，此密钥只会显示一次。
                </p>

                <div className="mt-6 rounded-[8px] bg-[#fafafa] p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-[14px] break-all" style={{ color: '#0a0a0a' }}>{createdKey.key}</code>
                    <button
                      onClick={() => handleCopyKey(createdKey.key)}
                      className="ml-3 rounded-[8px] bg-[#0a0a0a] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
                    >
                      {copySuccess ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-[8px] bg-[#fffbeb] p-4">
                  <div className="flex items-start gap-2">
                    <svg className="mt-0.5 h-5 w-5 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-[13px]" style={{ color: '#92400e' }}>
                      关闭此窗口后将无法再次查看完整密钥，请务必保存。
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreatedKey(null);
                    }}
                    className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
                  >
                    我已保存，关闭
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>确认吊销密钥</h3>
            <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
              您确定要吊销密钥「{selectedKey?.name}」吗？吊销后，使用该密钥的所有请求都将失败，此操作不可撤销。
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRevokeModal(false);
                  setSelectedKey(null);
                }}
                className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRevokeKey}
                disabled={submitting}
                className="rounded-full bg-[#dc2626] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#dc2626]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? '吊销中...' : '确认吊销'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>密钥详情</h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>名称</span>
                <span className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>{selectedKey.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>状态</span>
                <StatusBadge status={selectedKey.status} />
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>创建时间</span>
                <span className="text-[14px]" style={{ color: '#0a0a0a' }}>{formatDate(selectedKey.created_at)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>过期时间</span>
                <span className="text-[14px]" style={{ color: '#0a0a0a' }}>{selectedKey.expires_at ? formatDate(selectedKey.expires_at) : '永不过期'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>最后使用</span>
                <span className="text-[14px]" style={{ color: '#0a0a0a' }}>{selectedKey.last_used_at ? formatDate(selectedKey.last_used_at) : '从未使用'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e5]">
                <span className="text-[14px]" style={{ color: '#525252' }}>请求数 / 限制</span>
                <span className="text-[14px]" style={{ color: '#0a0a0a' }}>{selectedKey.request_count || 0} / {selectedKey.request_limit || 1000}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedKey(null);
                }}
                className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}