import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';          // ← make sure this import exists
import Register from './pages/Register';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import MyInvestments from './pages/MyInvestments';
import Transactions from './pages/Transactions';
import Referrals from './pages/Referrals';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Payment from './pages/Payment';
import TopUp from './pages/TopUp';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInvestments from './pages/admin/AdminInvestments';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminPackages from './pages/admin/AdminPackages';
import AdminPayments from './pages/admin/AdminPayments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />            {/* ← add this */}
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Protected user routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/invest" element={<PrivateRoute><Invest /></PrivateRoute>} />
        <Route path="/my-investments" element={<PrivateRoute><MyInvestments /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/referrals" element={<PrivateRoute><Referrals /></PrivateRoute>} />
        <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/topup" element={<PrivateRoute><TopUp /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/investments" element={<AdminRoute><AdminInvestments /></AdminRoute>} />
        <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
        <Route path="/admin/packages" element={<AdminRoute><AdminPackages /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
