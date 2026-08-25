/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useLocalTransactions } from '../hooks/useLocalTransactions'

const TransactionsContext = createContext(null)

export function TransactionsProvider({ children }) {
  const value = useLocalTransactions()
  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) throw new Error('useTransactions must be used inside TransactionsProvider')
  return context
}
