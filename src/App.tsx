import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { navigation } from './data/navigation'
import { Dashboard } from './pages/Dashboard'
import { MailImport } from './pages/MailImport'
import { ImportReview } from './pages/ImportReview'
import { PlannedPage } from './pages/PlannedPage'
import { getDashboardData } from './services/dashboardService'
import { analyzeSampleMail, registerMailDraft } from './services/mailImportService'
import type { MailDraft, MailKind, SavedMail } from './types/mailImport'
import type { PageId } from './types/dashboard'
import './App.css'

function readPage(): PageId {
  const id = window.location.hash.slice(1)
  return navigation.find(page => page.id === id)?.id ?? 'dashboard'
}

function App() {
  const [page, setPage] = useState<PageId>(readPage)
  const [data, setData] = useState(getDashboardData)
  const [drafts, setDrafts] = useState<MailDraft[]>([])
  const [reviewId, setReviewId] = useState<string | null>(null)

  useEffect(() => {
    const handleHash = () => { setPage(readPage()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])
  useEffect(() => {
    document.title = `${navigation.find(item => item.id === page)?.label} | SES Connect`
  }, [page])

  function navigate(next: PageId) { window.location.hash = next }

  function analyze(files: SavedMail[], kind: MailKind) {
    const added = analyzeSampleMail(files, kind, drafts)
    if (!added.length) return
    setDrafts(items => [...added, ...items])
    setReviewId(added[0].id)
    navigate('review')
  }

  function register(draft: MailDraft) {
    const result = registerMailDraft(data, draft)
    setData(result)
    setDrafts(items => items.map(item => item.id === draft.id ? { ...draft, status: 'registered' } : item))
  }

  const pendingCounts = {
    projects: drafts.filter(draft => draft.kind === 'project' && draft.status === 'pending').length,
    talents: drafts.filter(draft => draft.kind === 'talent' && draft.status === 'pending').length,
  }

  return (
    <Layout page={page} onNavigate={navigate}>
      {page === 'dashboard' ? <Dashboard data={data} pendingCounts={pendingCounts} onNavigate={navigate} />
        : page === 'mail' || page === 'talent' ? <MailImport key={page} kind={page === 'mail' ? 'project' : 'talent'} drafts={drafts} onAnalyze={analyze} onReview={() => navigate('review')} />
          : page === 'review' ? <ImportReview drafts={drafts} initialId={reviewId} onChange={draft => setDrafts(items => items.map(item => item.id === draft.id ? draft : item))} onRegister={register} onNavigate={navigate} />
            : <PlannedPage page={page} onBack={() => navigate('dashboard')} />}
    </Layout>
  )
}
export default App
