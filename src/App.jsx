import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { ThemeProvider } from './context/ThemeContext'
import { TransactionsProvider } from './context/TransactionsContext'
import AddTransaction from './pages/AddTransaction'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Summary from './pages/Summary'
import TransactionDetail from './pages/TransactionDetail'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/transaction/:id" element={<TransactionDetail />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </ThemeProvider>
  )
}

export default App
