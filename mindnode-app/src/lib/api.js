/**
 * API 调用工具类
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// 通用响应结构
export class APIResponse {
  constructor(code = 0, message = 'success', data = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

// 获取存储的 Token
export function getToken() {
  return localStorage.getItem('access_token');
}

// 存储 Token
export function setToken(token) {
  localStorage.setItem('access_token', token);
}

// 移除 Token
export function removeToken() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// 通用请求方法
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有 Token，添加到请求头
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// GET 请求
export async function get(endpoint) {
  return request(endpoint, { method: 'GET' });
}

// POST 请求
export async function post(endpoint, body) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PUT 请求
export async function put(endpoint, body) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// DELETE 请求
export async function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

// ==================== 认证 API ====================

export async function login(email, password) {
  const response = await post('/auth/login', { email, password });
  if (response.data?.access_token) {
    setToken(response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user_info', JSON.stringify(response.data.user));
  }
  return response;
}

export async function register(userData) {
  const response = await post('/auth/register', userData);
  if (response.data?.access_token) {
    setToken(response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user_info', JSON.stringify(response.data.user));
  }
  return response;
}

export async function logout() {
  try {
    await post('/auth/logout');
  } catch (error) {
    // 忽略错误，直接清除本地数据
  }
  removeToken();
  localStorage.removeItem('user_info');
}

export async function getCurrentUser() {
  try {
    const response = await get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
}

// ==================== AI 模型 API ====================

export async function fetchModels(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/models?${queryParams}` : '/models';
  return get(url);
}

export async function fetchModelBySlug(slug) {
  return get(`/models/${slug}`);
}

export async function fetchProviders() {
  return get('/models/providers');
}

// ==================== 技能 API ====================

export async function fetchSkills(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/skills?${queryParams}` : '/skills';
  return get(url);
}

export async function fetchSkillBySlug(slug) {
  return get(`/skills/${slug}`);
}

export async function fetchSkillCategories() {
  return get('/skills/categories');
}

export async function fetchFeaturedSkills(limit = 6) {
  return get(`/skills/featured?limit=${limit}`);
}

export async function searchSkills(query, limit = 10) {
  return get(`/skills/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

export async function downloadSkill(slug) {
  return get(`/skills/${slug}/download`);
}

// ==================== 智能体 API ====================

export async function fetchAgents(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/agents?${queryParams}` : '/agents';
  return get(url);
}

export async function fetchAgentBySlug(slug) {
  return get(`/agents/${slug}`);
}

export async function fetchAgentCategories() {
  return get('/agents/categories');
}

// ==================== 硬件 API ====================

export async function fetchHardware() {
  return get('/hardware');
}

export async function fetchHardwareBySlug(slug) {
  return get(`/hardware/${slug}`);
}

export async function createOrder(orderData) {
  return post('/hardware/orders', orderData);
}

// ==================== 定价 API ====================

export async function fetchPricingPlans() {
  return get('/pricing/plans');
}

export async function comparePlans() {
  return get('/pricing/compare');
}

// ==================== 合伙人 API ====================

export async function submitPartnerApplication(data) {
  return post('/partners/apply', data);
}

export async function fetchPartnerBenefits() {
  return get('/partners/benefits');
}

export async function fetchPartnerProcess() {
  return get('/partners/process');
}

// ==================== 推荐官 API ====================

export async function submitReferralApplication(data) {
  return post('/referrals/apply', data);
}

export async function fetchReferralTiers() {
  return get('/referrals/tiers');
}

// ==================== 企业版 API ====================

export async function submitEnterpriseInquiry(data) {
  return post('/enterprise/inquire', data);
}

export async function fetchEnterpriseCases() {
  return get('/enterprise/cases');
}

// ==================== 博客 API ====================

export async function fetchBlogPosts(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/blog/posts?${queryParams}` : '/blog/posts';
  return get(url);
}

export async function fetchBlogPostBySlug(slug) {
  return get(`/blog/posts/${slug}`);
}

export async function fetchBlogCategories() {
  return get('/blog/categories');
}

// ==================== 文档 API ====================

export async function fetchDocumentationTree() {
  return get('/docs');
}

export async function fetchDocumentationBySlug(slug) {
  return get(`/docs/${slug}`);
}

export async function searchDocumentation(q) {
  return get(`/docs/search?q=${encodeURIComponent(q)}`);
}

// ==================== 客户端 API ====================

export async function checkClientVersion(platform, arch, version) {
  return get(`/client/version?platform=${platform}&arch=${arch}&version=${version}`);
}

// ==================== 其他 API ====================

export async function subscribeNewsletter(email) {
  return post('/newsletter/subscribe', { email, consent: true });
}

export async function submitContactForm(data) {
  return post('/contact', data);
}

// ==================== 用户信息帮助函数 ====================

// 生成随机头像 URL (使用 DiceBear 头像服务)
export function getAvatarUrl(email) {
  if (!email) return '';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('user_info');
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function getUserDisplayName() {
  const user = getUserInfo();
  if (user) {
    return user.full_name || user.username || user.email;
  }
  return null;
}

// ==================== 用户统计 API ====================

export async function getUserStats() {
  return get('/users/me/stats');
}

export async function getUserSubscription() {
  return get('/users/me/subscription');
}

export async function updateUserInfo(data) {
  return put('/users/me', data);
}

export async function changePassword(data) {
  return put('/users/me/password', data);
}

export async function deleteAccount() {
  return del('/users/me');
}

// ==================== API 密钥管理 ====================

export async function getApiKeys() {
  return get('/api-keys');
}

export async function createApiKey(data) {
  return post('/api-keys', data);
}

export async function getApiKey(id) {
  return get(`/api-keys/${id}`);
}

export async function revokeApiKey(id) {
  return del(`/api-keys/${id}`);
}

// ==================== 账单与充值 ====================

export async function getBillingInfo() {
  return get('/users/me/billing');
}

export async function createRecharge(amount, method) {
  return post(`/users/me/billing/recharge?amount=${amount}&method=${method}`);
}

export async function getTransactions(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/users/me/billing/transactions?${queryParams}` : '/users/me/billing/transactions';
  return get(url);
}

// ==================== 使用历史 ====================

export async function getUsageHistory(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/users/me/usage?${queryParams}` : '/users/me/usage';
  return get(url);
}

export async function exportUsageCsv(params = {}) {
  const token = getToken();
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/users/me/usage/export?${queryParams}`;
  return fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.blob());
}

// ==================== 邀请记录 ====================

export async function getReferrals() {
  return get('/users/me/referrals');
}

export async function exportReferralsCsv() {
  const token = getToken();
  const url = `${API_BASE_URL}/users/me/referrals/export`;
  return fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.blob());
}
