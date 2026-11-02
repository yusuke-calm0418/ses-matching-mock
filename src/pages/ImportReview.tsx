import { useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { validateDraft } from '../services/mailImportService'
import type { MailDraft } from '../types/mailImport'

export function ImportReview({ drafts, initialId, onChange, onRegister, onNavigate }: {
  drafts: MailDraft[]
  initialId: string | null
  onChange: (draft: MailDraft) => void
  onRegister: (draft: MailDraft) => void
  onNavigate: (page: 'mail' | 'talent' | 'dashboard') => void
}) {
  const [selectedId, setSelectedId] = useState(initialId)
  const [filter, setFilter] = useState('all')
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const visible = drafts.filter(draft => filter === 'all' || draft.status === filter)
  const selected = visible.find(draft => draft.id === selectedId) ?? visible[0]
  const errors = selected ? validateDraft(selected) : {}
  const registered = selected?.status === 'registered'
  const pending = drafts.filter(draft => draft.status === 'pending').length

  function field(key: 'name' | 'company' | 'skills' | 'rate' | 'location' | 'start' | 'role' | 'experience', label: string, required = true) {
    if (!selected) return null
    return <label className="form-field" key={key}>
      <span id={`label-${key}`}>{label}{required && <span className="required-label" aria-hidden="true">必須</span>}</span>
      <input
        id={`draft-${key}`} aria-labelledby={`label-${key}`} value={selected[key]} disabled={registered} required={required}
        aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined}
        onChange={event => { onChange({ ...selected, [key]: event.target.value }); setSubmitError('') }}
      />
      {errors[key] && <span className="field-error" id={`error-${key}`}>{errors[key]}</span>}
    </label>
  }

  return (
    <>
      <div className="page-heading"><h1>取り込み結果確認</h1><span className="date">確認待ち {pending}件</span></div>
      <p className="review-description">元メールと解析結果を照合し、必要な項目を修正して登録してください。</p>
      {drafts.length === 0 ? (
        <section className="panel review-empty">
          <h2>確認待ちのメールはありません</h2>
          <p>保存フォルダから案件メール・人材メールを取り込んでください。</p>
          <div className="button-row">
            <button className="button secondary" onClick={() => onNavigate('mail')}>案件メール取り込み</button>
            <button className="button secondary" onClick={() => onNavigate('talent')}>人材メール取り込み</button>
          </div>
        </section>
      ) : (
        <div className="review-layout">
          <aside className="panel review-queue" aria-label="取り込み結果一覧">
            <label className="queue-filter">表示
              <select value={filter} onChange={event => { setFilter(event.target.value); setSubmitError('') }}>
                <option value="all">すべて</option><option value="pending">確認待ち</option><option value="registered">登録済み</option>
              </select>
            </label>
            {visible.map(draft => <button key={draft.id} className={`queue-item ${selected?.id === draft.id ? 'selected' : ''}`} aria-pressed={selected?.id === draft.id} onClick={() => { setSelectedId(draft.id); setSubmitError('') }}>
              <span className="queue-item-meta"><span>{draft.kind === 'project' ? '案件' : '人材'}</span><span>{draft.status === 'registered' ? '登録済み' : Object.keys(validateDraft(draft)).length ? '要修正' : '確認待ち'}</span></span>
              <strong>{draft.name || '名称未入力'}</strong><small>{draft.sourceFileName}</small>
            </button>)}
            {!visible.length && <p className="empty-state">該当する結果はありません。</p>}
          </aside>
          {selected ? <section className="panel review-editor">
            <div className="panel-heading"><h2>{selected.kind === 'project' ? '案件' : '人材'}情報</h2><span className="panel-meta">ローカルLLM解析のデモ結果</span></div>
            <details className="source-mail" open key={selected.id}>
              <summary>元メール：{selected.sourceFileName}</summary>
              <h3>{selected.sourceSubject}</h3><pre className="mail-body">{selected.sourceBody}</pre>
            </details>
            {registered && <div className="registration-notice" role="status">登録しました。<button className="text-button" onClick={() => onNavigate('dashboard')}>ダッシュボードで確認<Icon name="arrow" size={15} /></button></div>}
            <form ref={formRef} noValidate onSubmit={event => {
              event.preventDefault()
              if (Object.keys(errors).length) {
                setSubmitError('未入力の必須項目を確認してください。')
                formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
                return
              }
              try { onRegister(selected); setSubmitError('') }
              catch (cause) { setSubmitError(cause instanceof Error ? cause.message : '登録できませんでした。') }
            }}>
              <div className="draft-fields">
                {field('name', selected.kind === 'project' ? '案件名' : '人材名')}
                {field('company', selected.kind === 'project' ? '企業名' : '所属')}
                {selected.kind === 'talent' && field('role', '職種')}
                {selected.kind === 'talent' && field('experience', '経験年数')}
                {field('skills', 'スキル（カンマ区切り）')}
                {field('rate', selected.kind === 'project' ? '月額単価' : '希望月額単価')}
                {selected.kind === 'project' && field('location', '勤務地・勤務形態', false)}
                {field('start', selected.kind === 'project' ? '参画時期' : '稼働可能時期')}
                <label className="form-field full-width"><span>備考</span><textarea rows={3} value={selected.description} disabled={registered} onChange={event => onChange({ ...selected, description: event.target.value })} /></label>
              </div>
              <div className="review-submit">
                <span className="field-help">{registered ? '登録済みの内容です。' : '登録前に内容を確認してください。'}</span>
                <button type="submit" className="button primary" disabled={registered}>{registered ? '登録済み' : `${selected.kind === 'project' ? '案件' : '人材'}を登録`}</button>
              </div>
              {submitError && <p className="form-error" role="alert">{submitError}</p>}
            </form>
          </section> : <div className="panel empty-state">表示条件を変更してください。</div>}
        </div>
      )}
      <p className="page-note">解析結果は固定のサンプルです。取り込み・編集・登録の内容は、再読み込みすると初期状態に戻ります。</p>
    </>
  )
}
