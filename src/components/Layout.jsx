import { ChartNoAxesColumnIncreasing, LayoutDashboard, Moon, Plus, Sun } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTransactions } from '../context/TransactionsContext'
import { formatCurrency } from '../utils/formatters'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { totals } = useTransactions()
  const monthlyBudget = 1700
  const remaining = Math.max(monthlyBudget - totals.expenses, 0)
  const percent = Math.max(0, Math.min(100, (remaining / monthlyBudget) * 100))

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/"><span className="brand-mark">P</span><span>PocketPlan</span></Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end><LayoutDashboard size={19} /><span>Dashboard</span></NavLink>
          <NavLink to="/add"><Plus size={19} /><span>Add transaction</span></NavLink>
          <NavLink to="/summary"><ChartNoAxesColumnIncreasing size={19} /><span>Summary</span></NavLink>
        </nav>
        <div className="sidebar-card">
          <span className="eyebrow">Monthly pulse</span>
          <strong>{remaining > 0 ? 'You’re on track' : 'Budget reached'}</strong>
          <p>{Math.round(percent)}% of your monthly budget remains.</p>
          <div className="progress"><span style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <div className="profile"><div className="avatar">FE</div><div><strong>Frank Ely</strong><span>{formatCurrency(totals.balance)} balance</span></div></div>
        </div>
      </aside>
      <Outlet />
    </div>
  )
}
