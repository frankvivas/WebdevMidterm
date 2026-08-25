import { ArrowLeft, CalendarDays, Check, CircleDollarSign, FileText, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useTransactions } from '../context/TransactionsContext'
import { expenseCategories, incomeCategories } from '../data/seedTransactions'

const initialForm = { title: '', amount: '', type: 'expense', category: 'Food', date: '2026-08-25', note: '' }

export default function AddTransaction() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()
  const categories = form.type === 'expense' ? expenseCategories : incomeCategories

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => {
      if (name === 'type') return { ...current, type: value, category: value === 'income' ? 'Salary' : 'Food' }
      return { ...current, [name]: value }
    })
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Please enter a transaction name.'
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'Enter an amount greater than zero.'
    if (!form.category) nextErrors.category = 'Please choose a category.'
    if (!form.date) nextErrors.date = 'Please choose a date.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    addTransaction({ ...form, title: form.title.trim(), note: form.note.trim(), amount: Number(form.amount) })
    navigate('/')
  }

  return (
    <main className="content form-page">
      <PageHeader eyebrow="New entry" title="Add a transaction" description="Record income or spending while it’s still fresh." action={<Link className="secondary-button" to="/"><ArrowLeft size={17} /> Back to dashboard</Link>} />
      <section className="form-layout">
        <form className="panel transaction-form" onSubmit={handleSubmit} noValidate>
          <div className="type-toggle" aria-label="Transaction type">
            <button type="button" className={form.type === 'expense' ? 'active' : ''} onClick={() => updateField({ target: { name: 'type', value: 'expense' } })}>Expense</button>
            <button type="button" className={form.type === 'income' ? 'active' : ''} onClick={() => updateField({ target: { name: 'type', value: 'income' } })}>Income</button>
          </div>
          <div className="form-grid">
            <label className="field full"><span><FileText size={15} /> Transaction name</span><input name="title" value={form.title} onChange={updateField} placeholder="e.g. Weekly groceries" aria-invalid={Boolean(errors.title)} />{errors.title && <small className="error">{errors.title}</small>}</label>
            <label className="field"><span><CircleDollarSign size={15} /> Amount</span><div className="amount-input"><b>₱</b><input name="amount" value={form.amount} onChange={updateField} type="number" min="0.01" step="0.01" placeholder="0.00" aria-invalid={Boolean(errors.amount)} /></div>{errors.amount && <small className="error">{errors.amount}</small>}</label>
            <label className="field"><span><Tag size={15} /> Category</span><select name="category" value={form.category} onChange={updateField}>{categories.map((category) => <option key={category}>{category}</option>)}</select>{errors.category && <small className="error">{errors.category}</small>}</label>
            <label className="field full"><span><CalendarDays size={15} /> Date</span><input name="date" value={form.date} onChange={updateField} type="date" aria-invalid={Boolean(errors.date)} />{errors.date && <small className="error">{errors.date}</small>}</label>
            <label className="field full"><span><FileText size={15} /> Note <em>Optional</em></span><textarea name="note" value={form.note} onChange={updateField} rows="4" placeholder="Add any helpful details…" maxLength="180" /><small className="character-count">{form.note.length}/180</small></label>
          </div>
          <div className="form-actions"><Link className="secondary-button" to="/">Cancel</Link><button className="primary-button" type="submit"><Check size={18} /> Save transaction</button></div>
        </form>
      </section>
    </main>
  )
}
