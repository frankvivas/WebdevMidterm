import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronDown, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import TransactionRow from '../components/TransactionRow'
import { useTransactions } from '../context/TransactionsContext'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const { transactions, totals } = useTransactions()
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const categories = useMemo(() =>
    [...new Set(transactions.map((item) => item.category))].sort(), [transactions])

  const filteredTransactions = useMemo(() =>
    transactions
      .filter((item) => typeFilter === 'all' || item.type === typeFilter)
      .filter((item) => categoryFilter === 'all' || item.category === categoryFilter)
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date)),
  [transactions, typeFilter, categoryFilter, query])

  const expenseCount = transactions.filter((item) => item.type === 'expense').length
  const incomeCount = transactions.length - expenseCount

  return (
    <main className="content">
      <PageHeader
        eyebrow="Tuesday, August 25"
        title="Good morning, Frank."
        description="Here’s how your money is moving this month."
        action={<Link className="primary-button" to="/add"><Plus size={18} /> Add transaction</Link>}
      />
      <section className="stat-grid" aria-label="Budget overview">
        <article className="stat-card balance-card"><span>Current balance</span><strong>{formatCurrency(totals.balance)}</strong><small>Income minus all expenses</small><div className="balance-orb" /></article>
        <article className="stat-card"><div className="stat-icon income"><ArrowDownLeft size={20} /></div><span>Total income</span><strong>{formatCurrency(totals.income)}</strong><small>{incomeCount} income {incomeCount === 1 ? 'entry' : 'entries'}</small></article>
        <article className="stat-card"><div className="stat-icon expense"><ArrowUpRight size={20} /></div><span>Total spent</span><strong>{formatCurrency(totals.expenses)}</strong><small>{expenseCount} expense {expenseCount === 1 ? 'entry' : 'entries'}</small></article>
      </section>

      <section className="dashboard-grid">
        <article className="panel transactions-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">Cash flow</span><h2>Recent transactions</h2></div>
            <button className="icon-button" type="button" aria-label="Search transactions" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}><Search size={19} /></button>
          </div>
          {searchOpen && <label className="search-field"><Search size={17} /><span className="sr-only">Search transactions</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name…" /></label>}
          <div className="filter-row">
            {['all', 'income', 'expense'].map((type) => <button key={type} type="button" onClick={() => setTypeFilter(type)} className={`chip ${typeFilter === type ? 'active' : ''}`}>{type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expenses'}</button>)}
            <label className="category-select">Category <ChevronDown size={13} /><select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <div className="transaction-list">
            {filteredTransactions.length ? filteredTransactions.map((item) => <TransactionRow transaction={item} key={item.id} />) : <div className="empty-state"><Search size={24} /><strong>No transactions found</strong><span>Try clearing one of your filters.</span></div>}
          </div>
        </article>
        <SpendingPace transactions={transactions} total={totals.expenses} />
      </section>
    </main>
  )
}

function SpendingPace({ transactions, total }) {
  const categoryTotals = useMemo(() => {
    const result = {}
    transactions.filter((item) => item.type === 'expense').forEach((item) => {
      result[item.category] = (result[item.category] || 0) + Number(item.amount)
    })
    return Object.entries(result).sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [transactions])
  const colors = ['green', 'peach', 'lime']

  return (
    <article className="panel overview-panel">
      <div className="panel-heading"><div><span className="eyebrow">August overview</span><h2>Spending pace</h2></div></div>
      <div className="donut" style={{ '--spent-progress': `${Math.min(100, (total / 1700) * 100)}%` }}><div><strong>{formatCurrency(total, 0)}</strong><span>spent</span></div></div>
      <div className="legend">{categoryTotals.map(([category, amount], index) => <span key={category}><i className={colors[index]} /> {category} <b>{formatCurrency(amount, 0)}</b></span>)}</div>
      <Link className="text-link" to="/summary">View full summary <ArrowUpRight size={16} /></Link>
    </article>
  )
}
