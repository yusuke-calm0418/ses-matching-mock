import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
export function DetailDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const titleId = useId()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close() }, [])
  return <dialog ref={ref} className="detail-dialog" aria-labelledby={titleId} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}><div className="dialog-heading"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="詳細を閉じる" onClick={onClose}><Icon name="close" /></button></div>{children}<div className="dialog-footer"><span>架空データ・デモ表示</span><button className="button secondary" onClick={onClose}>閉じる</button></div></dialog>
}
