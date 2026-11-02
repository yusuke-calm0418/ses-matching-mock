import { useState } from 'react'
import { DetailDialog } from '../components/DetailDialog'
import { Icon } from '../components/Icon'
import { sampleMailFolders } from '../data/mailFolders'
import { getAvailableMail, readSampleFolder } from '../services/mailImportService'
import type { MailDraft, MailKind, SampleMailFolder, SavedMail } from '../types/mailImport'

export function MailImport({ kind, drafts, onAnalyze, onReview }: {
  kind: MailKind
  drafts: MailDraft[]
  onAnalyze: (files: SavedMail[], kind: MailKind) => void
  onReview: () => void
}) {
  const [folderId, setFolderId] = useState(kind === 'project' ? 'projects' : 'talents')
  const [folder, setFolder] = useState<SampleMailFolder | null>(null)
  const [selection, setSelection] = useState<string[]>([])
  const [preview, setPreview] = useState<SavedMail | null>(null)
  const [error, setError] = useState('')
  const label = kind === 'project' ? '案件' : '人材'
  const pending = drafts.filter(draft => draft.status === 'pending' && draft.kind === kind).length
  const available = getAvailableMail(folder?.files ?? [], kind, drafts)
  const chosen = available.filter(mail => selection.includes(mail.id))

  function readFolder() {
    const result = readSampleFolder(folderId)
    setFolder(result)
    setSelection(getAvailableMail(result.files, kind, drafts).map(mail => mail.id))
    setError('')
  }

  function fileStatus(mail: SavedMail) {
    if (mail.state === 'unsupported') return '対象外の形式'
    if (mail.state === 'duplicate' || drafts.some(draft => draft.sourceMailId === mail.id && draft.status === 'registered')) return '登録済み'
    if (drafts.some(draft => draft.sourceMailId === mail.id)) return '確認待ち'
    if (mail.kind !== kind) return `${mail.kind === 'project' ? '案件' : '人材'}メール`
    return '未取り込み'
  }

  return (
    <>
      <div className="page-heading">
        <h1>{label}メール取り込み</h1>
        <button className="button secondary" onClick={onReview}>確認待ち {pending}件<Icon name="arrow" size={16} /></button>
      </div>
      <ol className="import-steps" aria-label="取り込み手順">
        <li><span>1</span>Outlookからフォルダに保存</li>
        <li aria-current="step"><span>2</span>メールを選択・ローカル解析</li>
        <li><span>3</span>確認・修正して登録</li>
      </ol>
      <section className="panel folder-panel" aria-label="保存フォルダ">
        <div className="panel-heading"><h2><Icon name="folder" size={18} />保存フォルダ</h2><span className="panel-meta">フォルダ・解析結果はサンプルです</span></div>
        <div className="folder-controls">
          <label className="form-field">
            <span>フォルダ</span>
            <select value={folderId} onChange={event => { setFolderId(event.target.value); setFolder(null); setSelection([]); setError('') }}>
              {sampleMailFolders.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <button className="button secondary" onClick={readFolder}>フォルダを確認</button>
        </div>
        <p className="folder-path">{sampleMailFolders.find(item => item.id === folderId)?.path}</p>
        <p className="field-help">Outlookで保存したメールを取り込みます。Outlookへの直接接続は行いません。</p>
      </section>
      <section className="panel mail-list-panel">
        <div className="panel-heading">
          <h2>保存メール {folder && <span className="count-badge">{folder.files.length}ファイル</span>}</h2>
          {folder && <span className="panel-meta">{label}メールの取り込み対象 {available.length}件</span>}
        </div>
        {!folder ? (
          <div className="empty-state">フォルダを選び、「フォルダを確認」を押してください。</div>
        ) : (
          <div className="table-scroll">
            <table className="mail-table">
              <thead><tr>
                <th><input type="checkbox" aria-label="取り込み対象をすべて選択" checked={available.length > 0 && chosen.length === available.length} disabled={!available.length} onChange={event => setSelection(event.target.checked ? available.map(mail => mail.id) : [])} /></th>
                <th>ファイル名 / 件名</th><th>受信日時</th><th>添付</th><th>状態</th><th>本文</th>
              </tr></thead>
              <tbody>{folder.files.map(mail => {
                const canSelect = available.some(item => item.id === mail.id)
                const state = fileStatus(mail)
                return <tr key={mail.id}>
                  <td><input type="checkbox" aria-label={`${mail.fileName}を選択`} checked={canSelect && selection.includes(mail.id)} disabled={!canSelect} onChange={event => setSelection(ids => event.target.checked ? [...ids, mail.id] : ids.filter(id => id !== mail.id))} /></td>
                  <td><span className="mail-filename">{mail.fileName}</span><small className="company">{mail.subject || 'メールファイルではありません'}</small></td>
                  <td className="muted nowrap">{mail.receivedAt || '—'}</td>
                  <td className="nowrap">{mail.attachments.length ? `${mail.attachments.length}件` : '—'}</td>
                  <td><span className={`status ${state === '確認待ち' ? 'amber' : state === '未取り込み' ? 'blue' : 'neutral'}`}>{state}</span></td>
                  <td>{mail.kind && <button className="text-button" aria-label={`${mail.fileName}の本文`} onClick={() => setPreview(mail)}>表示</button>}</td>
                </tr>
              })}</tbody>
            </table>
          </div>
        )}
        {folder && <div className="import-footer">
          <span>{chosen.length}件選択<span className="field-help">登録済み・確認待ち・対象外のファイルは除外</span></span>
          <button className="button primary" disabled={!chosen.length} onClick={() => {
            try { onAnalyze(chosen, kind) } catch (cause) { setError(cause instanceof Error ? cause.message : '解析結果を作成できませんでした。') }
          }}>選択したメールを解析（デモ）<Icon name="arrow" size={16} /></button>
        </div>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
      <p className="page-note">モックでは実際のフォルダやローカルLLMに接続しません。添付ファイルは名前のみ表示します。</p>
      {preview && <DetailDialog title="保存メール" onClose={() => setPreview(null)}>
        <p className="detail-id">{preview.fileName}</p>
        <h3>{preview.subject}</h3>
        <dl><dt>差出人</dt><dd>{preview.sender}</dd><dt>受信日時</dt><dd>{preview.receivedAt}</dd><dt>添付ファイル</dt><dd>{preview.attachments.join('、') || 'なし'}</dd></dl>
        <pre className="mail-body">{preview.body}</pre>
      </DetailDialog>}
    </>
  )
}
