import { ChartNoAxesColumnIncreasing, LayoutDashboard, Moon, Plus, Sun } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTransactions } from '../context/TransactionsContext'
import { formatCurrency } from '../utils/formatters'

export default function Layout() {
  const { theme, toggleTheme } = useTheme()
  const { totals } = useTransactions()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">Budget Tracker</Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end><LayoutDashboard size={19} /><span>Dashboard</span></NavLink>
          <NavLink to="/add"><Plus size={19} /><span>Add transaction</span></NavLink>
          <NavLink to="/summary"><ChartNoAxesColumnIncreasing size={19} /><span>Summary</span></NavLink>
        </nav>
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
