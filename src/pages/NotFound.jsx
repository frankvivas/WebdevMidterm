import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return <main className="content not-found"><span className="eyebrow">404 · Wrong turn</span><h1>This page is off budget.</h1><p>Let’s get you back to your dashboard.</p><Link className="primary-button" to="/"><ArrowLeft size={17} /> Back home</Link></main>
}
