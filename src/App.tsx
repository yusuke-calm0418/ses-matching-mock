import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { navigation } from './data/navigation'
import { Dashboard } from './pages/Dashboard'
import { PlannedPage } from './pages/PlannedPage'
import { getDashboardData } from './services/dashboardService'
import type { PageId } from './types/dashboard'
import './App.css'
function readPage(): PageId {
  const id = window.location.hash.slice(1)
  return navigation.find(page => page.id === id)?.id ?? 'dashboard'
}
function App() {
  const [page, setPage] = useState<PageId>(readPage)
  const [data] = useState(getDashboardData)
  useEffect(() => {
    const handleHash = () => { setPage(readPage()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])
  useEffect(() => { document.title = `${navigation.find(item => item.id === page)?.label} | SES Connect` }, [page])
  function navigate(next: PageId) { window.location.hash = next }
  return <Layout page={page} onNavigate={navigate}>{page === 'dashboard' ? <Dashboard data={data} onNavigate={navigate} /> : <PlannedPage page={page} onBack={() => navigate('dashboard')} />}</Layout>
}
export default App
