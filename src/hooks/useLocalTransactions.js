import { useCallback, useEffect, useMemo, useState } from 'react'
import { seedTransactions } from '../data/seedTransactions'

const STORAGE_KEY = 'pocketplan-transactions'

function readTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedTransactions
  } catch {
    return seedTransactions
  }
}

export function useLocalTransactions() {
  const [transactions, setTransactions] = useState(readTransactions)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = useCallback((transaction) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() }
    setTransactions((current) => [newTransaction, ...current])
    return newTransaction
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((current) =>
      current.map((transaction) => transaction.id === id ? { ...transaction, ...updates } : transaction),
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id))
  }, [])

  const totals = useMemo(() => {
    const income = transactions.reduce((sum, item) => item.type === 'income' ? sum + Number(item.amount) : sum, 0)
    const expenses = transactions.reduce((sum, item) => item.type === 'expense' ? sum + Number(item.amount) : sum, 0)
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  return { transactions, totals, addTransaction, updateTransaction, deleteTransaction }
}
