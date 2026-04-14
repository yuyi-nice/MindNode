import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import MoltyBox from './pages/MoltyBox';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Hardware from './pages/Hardware';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Partner from './pages/Partner';
import ReferralProgram from './pages/ReferralProgram';
import Enterprise from './pages/Enterprise';
import Agents from './pages/Agents';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview';
import DashboardApiKeys from './pages/DashboardApiKeys';
import DashboardBilling from './pages/DashboardBilling';
import DashboardUsage from './pages/DashboardUsage';
import DashboardSettings from './pages/DashboardSettings';
import DashboardReferrals from './pages/DashboardReferrals';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="moltybox" element={<MoltyBox />} />
            <Route path="skills" element={<Skills />} />
            <Route path="skills/:slug" element={<SkillDetail />} />
            <Route path="hardware" element={<Hardware />} />
            <Route path="models" element={<Models />} />
            <Route path="models/:slug" element={<ModelDetail />} />
            <Route path="partner" element={<Partner />} />
            <Route path="referral-program" element={<ReferralProgram />} />
            <Route path="enterprise" element={<Enterprise />} />
            <Route path="agents" element={<Agents />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact-us" element={<ContactUs />} />

            {/* Dashboard 页面 */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="api-keys" element={<DashboardApiKeys />} />
              <Route path="billing" element={<DashboardBilling />} />
              <Route path="usage" element={<DashboardUsage />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="referrals" element={<DashboardReferrals />} />
            </Route>
          </Route>
          {/* 独立布局的页面 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
