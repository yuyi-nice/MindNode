import { useState, useEffect } from 'react';
import { getCurrentUser, updateUserInfo, changePassword, deleteAccount, getUserSubscription } from '../lib/api';
import { getAvatarUrl } from '../lib/api';

export default function DashboardSettings() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 表单状态
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, subRes] = await Promise.all([
        getCurrentUser(),
        getUserSubscription()
      ]);
      if (userRes) {
        setUser(userRes);
        setUsername(userRes.username || '');
        setFullName(userRes.full_name || '');
      }
      if (subRes?.data) {
        setSubscription(subRes.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!username.trim()) {
      alert('用户名不能为空');
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateUserInfo({
        username: username,
        full_name: fullName
      });
      if (response.data) {
        setUser(response.data);
        setShowUserModal(false);
        // 更新本地存储
        localStorage.setItem('user_info', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('请填写所有密码字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('新密码两次输入不一致');
      return;
    }
    if (newPassword.length < 6) {
      alert('密码长度至少 6 位');
      return;
    }

    try {
      setSubmitting(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('密码修改成功');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('密码修改失败，请检查当前密码是否正确');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSubmitting(true);
      await deleteAccount();
      // 清除本地存储
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      // 跳转到首页
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('注销失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-semibold" style={{ color: '#0a0a0a' }}>账户设置</h1>
        <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
          管理您的身份和账户权限。
        </p>
      </div>

      {/* Account Header */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
        <p className="text-[12px] font-medium uppercase tracking-wider" style={{ color: '#525252' }}>常规</p>
        <h2 className="mt-2 text-[20px] font-semibold" style={{ color: '#0a0a0a' }}>账户</h2>
        <p className="mt-1 text-[14px]" style={{ color: '#525252' }}>
          在一处管理身份和账户权限。
        </p>
      </div>

      {/* Account Controls */}
      <div className="rounded-[16px] border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#e5e5e5] p-6">
          <h2 className="text-[16px] font-semibold" style={{ color: '#0a0a0a' }}>账户控制</h2>
          <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
            管理个人资料和账户设置。
          </p>
        </div>

        <div className="divide-y divide-[#e5e5e5]">
          {/* User */}
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <h3 className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>用户</h3>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                管理您的登录凭据、安全设置或删除您的账户。
              </p>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              管理
            </button>
          </div>

          {/* Account Type */}
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <h3 className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>账户类型</h3>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                您当前的账户等级。
              </p>
            </div>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[13px] font-medium" style={{ color: '#6366f1' }}>
              {loading ? '加载中...' : subscription?.plan_name || '个人版'}
            </span>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <h3 className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>修改密码</h3>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                更新您的登录密码。
              </p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
            >
              修改
            </button>
          </div>

          {/* Danger Zone */}
          <div className="flex items-center justify-between p-6 bg-[#fef2f2]">
            <div className="flex-1">
              <h3 className="text-[14px] font-medium" style={{ color: '#dc2626' }}>注销账户</h3>
              <p className="mt-1 text-[13px]" style={{ color: '#525252' }}>
                永久删除您的账户和所有数据，此操作不可撤销。
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-full border border-[#fecaca] bg-white px-4 py-2 text-[13px] font-medium text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-colors"
            >
              注销
            </button>
          </div>
        </div>
      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>个人信息</h3>
            <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
              更新您的个人信息。
            </p>

            <div className="mt-6 space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar_url || getAvatarUrl(user?.email)}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <p className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>头像</p>
                  <p className="text-[12px]" style={{ color: '#525252' }}>由 DiceBear 自动生成</p>
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>邮箱</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-2.5 text-[14px] text-[#737373] cursor-not-allowed"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>姓名</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="请输入姓名"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setUsername(user?.username || '');
                  setFullName(user?.full_name || '');
                }}
                className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={submitting}
                className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold" style={{ color: '#0a0a0a' }}>修改密码</h3>
            <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
              请输入当前密码和新密码。
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>当前密码</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少 6 位）"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="text-[14px] font-medium" style={{ color: '#0a0a0a' }}>确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="mt-1.5 w-full rounded-[8px] border border-[#e5e5e5] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                disabled={submitting}
                className="rounded-full bg-[#0a0a0a] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0a0a0a]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? '修改中...' : '确认修改'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6">
            <h3 className="text-[18px] font-semibold text-[#dc2626]">注销账户</h3>
            <p className="mt-2 text-[14px]" style={{ color: '#525252' }}>
              您确定要注销账户吗？此操作将永久删除您的所有数据，包括：
            </p>

            <ul className="mt-4 space-y-2 text-[14px]" style={{ color: '#525252' }}>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
                所有 API 密钥
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
                账户余额和交易记录
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
                使用历史记录
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
                邀请奖励记录
              </li>
            </ul>

            <div className="mt-6 rounded-[8px] bg-[#fef2f2] p-4">
              <p className="text-[13px] font-medium text-[#dc2626]">
                ⚠️ 此操作不可撤销，请谨慎操作。
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={submitting}
                className="rounded-full bg-[#dc2626] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#dc2626]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? '注销中...' : '确认注销'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}