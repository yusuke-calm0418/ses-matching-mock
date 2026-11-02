import { useState } from 'react'
import type { DashboardData, Match, PageId, Project, Talent } from '../types/dashboard'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import { DetailDialog } from '../components/DetailDialog'

function Status({ value }: { value: string }) {
  const color = value === '確認待ち' ? 'amber' : value === '提案中' ? 'blue' : 'green'
  return <span className={`status ${color}`}><i />{value}</span>
}

function Skills({ values }: { values: string[] }) {
  return <span className="skills">{values.map(value => <span key={value}>{value}</span>)}</span>
}

const actions: { page: PageId; icon: IconName; title: string }[] = [
  { page: 'mail', icon: 'mail', title: '案件メール取り込み' },
  { page: 'talent', icon: 'users', title: '人材メール取り込み' },
  { page: 'review', icon: 'check', title: '取り込み結果確認' },
  { page: 'matching', icon: 'matching', title: 'マッチング' },
]

export function Dashboard({ data, pendingCounts, onNavigate }: {
  data: DashboardData
  pendingCounts: { projects: number; talents: number }
  onNavigate: (page: PageId) => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('すべて')
  const [detail, setDetail] = useState<Project | Talent | Match | null>(null)
  const [matches, setMatches] = useState(data.matches)
  const pendingProjects = pendingCounts.projects
  const pendingTalents = pendingCounts.talents
  const metrics = [
    {
      label: '登録案件数', count: data.projects.length, unit: '件',
      description: `募集中 ${data.projects.filter(p => p.status === '募集中').length}件`,
    },
    {
      label: '登録人材数', count: data.talents.length, unit: '名',
      description: `稼働可能 ${data.talents.filter(t => t.status === '稼働可能').length}名`,
    },
    {
      label: 'マッチング候補', count: matches.length, unit: '件',
      description: `未確認 ${matches.filter(m => m.status === '未確認').length}件`,
    },
    {
      label: '取り込み確認待ち', count: pendingProjects + pendingTalents, unit: '件',
      description: `案件 ${pendingProjects}件・人材 ${pendingTalents}名`,
    },
  ]
  const projects = data.projects.filter(p =>
    `${p.title} ${p.company} ${p.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim())
    && (status === 'すべて' || p.status === status),
  )
  const selectedMatch = detail && 'score' in detail ? matches.find(m => m.id === detail.id)! : null

  return (
    <>
      <div className="page-heading">
        <h1>ダッシュボード</h1>
        <div className="date">サンプル基準日：2026年10月29日</div>
      </div>
      <section className="metrics" aria-label="登録状況">
        {metrics.map(metric => (
          <article className="metric" key={metric.label}>
            <div className="metric-top">{metric.label}</div>
            <div className="metric-value">{metric.count}<span>{metric.unit}</span></div>
            <div className="metric-description">{metric.description}</div>
          </article>
        ))}
      </section>
      <section className="quick-actions" aria-label="業務ショートカット">
        {actions.map(action => (
          <button className="quick-action" key={action.page} onClick={() => onNavigate(action.page)}>
            <Icon name={action.icon} size={18} />
            <span>{action.title}</span>
            <Icon name="arrow" size={16} />
          </button>
        ))}
      </section>
      <section className="panel projects-panel">
        <div className="panel-heading">
          <h2>最近取り込んだ案件 <span className="count-badge">{data.projects.length}件</span></h2>
          <span className="panel-meta">取り込み日順</span>
        </div>
        <div className="table-toolbar">
          <label className="search">
            <Icon name="search" size={17} />
            <input
              aria-label="案件を検索"
              placeholder="案件名・企業名・スキルで検索"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>
          <label className="filter">
            ステータス
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>すべて</option><option>募集中</option><option>確認待ち</option><option>提案中</option>
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>案件名 / 企業名</th><th>スキル</th><th>月額単価</th>
                <th>ステータス</th><th>取り込み日</th><th><span className="sr-only">詳細</span></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <button className="record-title" onClick={() => setDetail(project)}>{project.title}</button>
                    <small className="company">{project.company}</small>
                  </td>
                  <td><Skills values={project.skills} /></td>
                  <td className="nowrap">{project.budget}</td>
                  <td><Status value={project.status} /></td>
                  <td className="muted nowrap">{project.receivedAt.replaceAll('-', '/')}</td>
                  <td>
                    <button className="icon-button" aria-label={`${project.title}の詳細`} onClick={() => setDetail(project)}>
                      <Icon name="arrow" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <div className="empty-state">該当する案件がありません。検索条件を変更してください。</div>}
        </div>
        <div className="table-footer">{projects.length} / {data.projects.length}件を表示</div>
      </section>
      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>最近登録した人材 <span className="count-badge">{data.talents.length}名</span></h2>
          </div>
          <div className="talent-list">
            {data.talents.map((talent, index) => (
              <button className="talent-row" key={talent.id} onClick={() => setDetail(talent)}>
                <span className="talent-avatar">{String.fromCharCode(65 + index)}</span>
                <span className="talent-info">
                  <strong>{talent.name}<small>経験 {talent.experience}</small></strong>
                  <span>{talent.role}</span>
                  <Skills values={talent.skills} />
                </span>
                <Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>最近のマッチング</h2>
            <span className="panel-meta">スコアはデモ用の固定値</span>
          </div>
          <div className="match-list">
            {matches.map(match => (
              <button className="match-row" key={match.id} onClick={() => setDetail(match)}>
                <span className="score">{match.score}<small>%</small></span>
                <span className="match-info">
                  <strong>{data.projects.find(p => p.id === match.projectId)?.title}</strong>
                  <span>
                    {data.talents.find(t => t.id === match.talentId)?.name}
                    <span className="match-status">{match.status}</span>
                  </span>
                </span>
                <Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
        </section>
      </div>
      {detail && (
        <DetailDialog
          title={'title' in detail ? detail.title : 'name' in detail ? detail.name : 'マッチング詳細'}
          onClose={() => setDetail(null)}
        >
          {'source' in detail && detail.source && <p className="source-reference">取り込み元：{detail.source.fileName}</p>}
          {'title' in detail ? (
            <>
              <p className="detail-id">{detail.id} · {detail.company}</p>
              <Status value={detail.status} />
              <p className="detail-description">{detail.description}</p>
              <Skills values={detail.skills} />
              <dl>
                <dt>月額単価</dt><dd>{detail.budget}</dd>
                <dt>勤務地・勤務形態</dt><dd>{detail.location}</dd>
                <dt>参画時期</dt><dd>{detail.start}</dd>
                <dt>取り込み日</dt><dd>{detail.receivedAt}</dd>
              </dl>
            </>
          ) : 'name' in detail ? (
            <>
              <p className="detail-id">{detail.id} · {detail.role}</p>
              <Status value={detail.status} />
              <dl>
                {detail.company && <><dt>所属</dt><dd>{detail.company}</dd></>}
                <dt>経験年数</dt><dd>{detail.experience}</dd>
                <dt>希望月額単価</dt><dd>{detail.rate}</dd>
                <dt>稼働可能時期</dt><dd>{detail.available}</dd>
              </dl>
              <Skills values={detail.skills} />
              {detail.description && <p className="detail-description">{detail.description}</p>}
            </>
          ) : selectedMatch && (
            <>
              <p className="detail-id">{detail.id} · デモ結果（固定値）</p>
              <div className="detail-score">{detail.score}<span>% 適合</span></div>
              <h3>{data.projects.find(p => p.id === detail.projectId)?.title}</h3>
              <p>{data.talents.find(t => t.id === detail.talentId)?.name}</p>
              <div className="reason"><h3>一致条件</h3><p>{detail.reason}</p></div>
              <div className="concern"><h3>要確認事項</h3><p>{detail.concern}</p></div>
              <button
                className="button primary"
                disabled={selectedMatch.status === '確認済み'}
                onClick={() => setMatches(items => items.map(item =>
                  item.id === detail.id ? { ...item, status: '確認済み' } : item,
                ))}
              >
                {selectedMatch.status === '確認済み' ? '確認済み' : '確認済みにする'}
              </button>
              <p className="session-note">確認状態は再読み込み・画面移動で初期状態に戻ります。</p>
            </>
          )}
        </DetailDialog>
      )}
    </>
  )
}
