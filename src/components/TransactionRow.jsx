import { memo } from 'react'
import { BriefcaseBusiness, Bus, Clapperboard, House, ReceiptText, ShoppingBag, Soup, Wifi } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../utils/formatters'

const categoryIcons = {
  Food: Soup,
  Housing: House,
  Transport: Bus,
  Utilities: Wifi,
  Entertainment: Clapperboard,
  Shopping: ShoppingBag,
  Salary: BriefcaseBusiness,
  Freelance: BriefcaseBusiness,
}

function TransactionRow({ transaction }) {
  const Icon = categoryIcons[transaction.category] || ReceiptText
  return (
    <Link className="transaction" to={`/transaction/${transaction.id}`}>
      <div className={`transaction-icon ${transaction.type}`}><Icon size={19} /></div>
      <div className="transaction-copy">
        <strong>{transaction.title}</strong>
        <span>{transaction.category} · {formatDate(transaction.date)}</span>
      </div>
      <strong className={transaction.type}>
        {transaction.type === 'income' ? '+' : '−'}{formatCurrency(transaction.amount)}
      </strong>
    </Link>
  )
}

// The row only re-renders when its transaction changes, avoiding a full list redraw while filtering.
export default memo(TransactionRow)
