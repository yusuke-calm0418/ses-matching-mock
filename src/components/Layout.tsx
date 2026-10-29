import type { ReactNode } from 'react'
import type { PageId } from '../types/dashboard'
import { Icon } from './Icon'
import { navigation } from '../data/navigation'

export function Layout({ page, onNavigate, children }: {
  page: PageId
  onNavigate: (page: PageId) => void
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-mark">s<span>＋</span></span>
          <span>SES Connect<small>案件・人材管理</small></span>
        </a>
        <div className="workspace">
          <span className="workspace-avatar">S</span>
          <div>営業ワークスペース</div>
        </div>
        <nav aria-label="メインナビゲーション">
          {navigation.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              aria-current={page === item.id ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="user">
          <span className="user-avatar">営</span>
          <div>営業担当者<small>デモユーザー</small></div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>ワークスペース <span>/</span> <strong>{navigation.find(item => item.id === page)?.label}</strong></div>
          <span className="environment">デモ環境・架空データ</span>
        </header>
        <main id="main-content">{children}</main>
        <footer>SES Connect</footer>
      </div>
    </div>
  )
}
