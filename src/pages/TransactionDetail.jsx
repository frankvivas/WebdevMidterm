import { ArrowLeft, CalendarDays, Check, CircleDollarSign, Pencil, Tag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTransactions } from '../context/TransactionsContext'
import { expenseCategories, incomeCategories } from '../data/seedTransactions'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function TransactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { transactions, updateTransaction, deleteTransaction } = useTransactions()
  const transaction = transactions.find((item) => item.id === id)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState(transaction || {})

  if (!transaction) {
    return <main className="content not-found"><span className="eyebrow">404 · Missing entry</span><h1>Transaction not found.</h1><p>It may have been deleted or the link may be incorrect.</p><Link className="primary-button" to="/"><ArrowLeft size={17} /> Back to dashboard</Link></main>
  }

  const categories = form.type === 'expense' ? expenseCategories : incomeCategories
  const handleSave = (event) => {
    event.preventDefault()
    if (!form.title.trim() || Number(form.amount) <= 0) return
    updateTransaction(id, { ...form, title: form.title.trim(), amount: Number(form.amount) })
    setEditing(false)
  }
  const handleDelete = () => { deleteTransaction(id); navigate('/') }

  return (
    <main className="content detail-page">
      <div className="detail-actions"><Link className="back-link" to="/"><ArrowLeft size={17} /> Back to dashboard</Link><div>{editing ? <button className="secondary-button" type="button" onClick={() => { setForm(transaction); setEditing(false) }}><X size={16} /> Cancel</button> : <button className="secondary-button" type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Edit</button>}<button className="danger-button" type="button" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Delete</button></div></div>
      <section className="detail-hero">
        <div className={`detail-badge ${transaction.type}`}>{transaction.type === 'income' ? 'IN' : 'OUT'}</div>
        <div><span className="eyebrow">Transaction detail</span><h1>{transaction.title}</h1><p>{transaction.category} · {formatDate(transaction.date)}</p></div>
        <strong className={transaction.type}>{transaction.type === 'income' ? '+' : '−'}{formatCurrency(transaction.amount)}</strong>
      </section>

      {editing ? (
        <form className="panel transaction-form detail-form" onSubmit={handleSave}>
          <div className="type-toggle"><button type="button" className={form.type === 'expense' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'expense', category: 'Food' })}>Expense</button><button type="button" className={form.type === 'income' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'income', category: 'Salary' })}>Income</button></div>
          <div className="form-grid">
            <label className="field full"><span>Transaction name</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label className="field"><span>Amount</span><div className="amount-input"><b>₱</b><input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required /></div></label>
            <label className="field"><span>Category</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="field full"><span>Date</span><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required /></label>
            <label className="field full"><span>Note</span><textarea rows="4" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
          </div>
          <div className="form-actions"><button className="primary-button" type="submit"><Check size={17} /> Save changes</button></div>
        </form>
      ) : (
        <section className="detail-grid">
          <article className="panel detail-card"><span className="eyebrow">Transaction info</span><dl><div><dt><CircleDollarSign size={17} /> Type</dt><dd className={transaction.type}>{transaction.type}</dd></div><div><dt><Tag size={17} /> Category</dt><dd>{transaction.category}</dd></div><div><dt><CalendarDays size={17} /> Date</dt><dd>{formatDate(transaction.date)}</dd></div></dl></article>
          <article className="panel note-card"><span className="eyebrow">Your note</span><blockquote>{transaction.note || 'No note was added for this transaction.'}</blockquote></article>
        </section>
      )}

      {confirmDelete && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="modal-icon"><Trash2 size={22} /></div><h2 id="delete-title">Delete this transaction?</h2><p>This removes “{transaction.title}” from your records. This action cannot be undone.</p><div><button className="secondary-button" onClick={() => setConfirmDelete(false)}>Keep it</button><button className="danger-button solid" onClick={handleDelete}>Delete transaction</button></div></div></div>}
    </main>
  )
}
