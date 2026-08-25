import { ArrowDownLeft, ArrowUpRight, Moon, Sun, TrendingDown } from 'lucide-react'
import { useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { useTheme } from '../context/ThemeContext'
import { useTransactions } from '../context/TransactionsContext'
import { formatCurrency } from '../utils/formatters'

const colors = ['#2f6b4f', '#ffb58f', '#c8f169', '#7ba594', '#e9cf78', '#bb8bc0', '#79a7c8', '#dd8b82']

export default function Summary() {
  const { transactions, totals } = useTransactions()
  const { theme, toggleTheme } = useTheme()
  const categories = useMemo(() => {
    const groups = {}
    transactions.filter((item) => item.type === 'expense').forEach((item) => { groups[item.category] = (groups[item.category] || 0) + Number(item.amount) })
    return Object.entries(groups).sort((a, b) => b[1] - a[1])
  }, [transactions])
  const topCategory = categories[0]
  const savingsRate = totals.income ? ((totals.income - totals.expenses) / totals.income) * 100 : 0

  const stops = categories.reduce((result, [, amount], index) => {
    const start = result.angle
    const angle = start + (totals.expenses ? (amount / totals.expenses) * 360 : 0)
    return { angle, values: [...result.values, `${colors[index % colors.length]} ${start}deg ${angle}deg`] }
  }, { angle: 0, values: [] }).values.join(', ')

  return (
    <main className="content summary-page">
      <PageHeader eyebrow="August 2026" title="Your spending story" description="A clear look at where your money went—and what stayed." action={<button className="theme-button" type="button" onClick={toggleTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />} {theme === 'light' ? 'Dark theme' : 'Light theme'}</button>} />
      <section className="summary-highlights">
        <article><div className="stat-icon expense"><ArrowUpRight size={20} /></div><span>Total spent</span><strong>{formatCurrency(totals.expenses)}</strong><small>Across {categories.length} categories</small></article>
        <article><div className="stat-icon income"><ArrowDownLeft size={20} /></div><span>Saved this month</span><strong>{formatCurrency(totals.balance)}</strong><small>{savingsRate.toFixed(1)}% savings rate</small></article>
        <article><div className="stat-icon neutral"><TrendingDown size={20} /></div><span>Top category</span><strong>{topCategory?.[0] || '—'}</strong><small>{topCategory ? formatCurrency(topCategory[1]) : 'No spending yet'}</small></article>
      </section>
      <section className="summary-grid">
        <article className="panel category-breakdown">
          <div className="panel-heading"><div><span className="eyebrow">Category breakdown</span><h2>Where your money went</h2></div></div>
          <div className="summary-chart-wrap">
            <div className="summary-donut" style={{ background: `conic-gradient(${stops || '#dfe6df 0deg 360deg'})` }}><div><strong>{formatCurrency(totals.expenses, 0)}</strong><span>Total spent</span></div></div>
            <div className="category-list">{categories.map(([category, amount], index) => { const percent = totals.expenses ? (amount / totals.expenses) * 100 : 0; return <div className="category-row" key={category}><i style={{ background: colors[index % colors.length] }} /><div><strong>{category}</strong><span>{percent.toFixed(1)}% of spending</span></div><b>{formatCurrency(amount)}</b></div> })}</div>
          </div>
        </article>
        <article className="panel insight-card">
          <span className="eyebrow">Budget Tracker insight</span>
          <div className="insight-number">{Math.round(savingsRate)}<sup>%</sup></div>
          <h2>of your income stayed in your pocket.</h2>
          <p>{savingsRate >= 20 ? 'That’s a healthy margin. Keep your essential spending steady and you’ll finish the month strong.' : 'A few small adjustments to flexible spending can make next month feel roomier.'}</p>
          <div className="income-expense-bar"><span style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} /></div>
          <div className="bar-labels"><span>Saved</span><span>Spent</span></div>
        </article>
      </section>
    </main>
  )
}
