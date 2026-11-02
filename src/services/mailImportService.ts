import { sampleMailFolders } from '../data/mailFolders.ts'
import type { DashboardData } from '../types/dashboard.ts'
import type { MailDraft, MailKind, SampleMailFolder, SavedMail } from '../types/mailImport.ts'

type DraftFields = Pick<MailDraft, 'name' | 'company' | 'skills' | 'rate' | 'location' | 'start' | 'role' | 'experience' | 'description'>

// ローカルLLMの解析結果を模した固定値。メール本文・添付ファイルの解析は行わない。
const sampleResults: Record<string, DraftFields> = {
  'MAIL-P01': {
    name: '予約管理システム開発', company: 'サンプルワークス株式会社', skills: 'React, TypeScript',
    rate: '65〜80万円', location: '東京 / 週3リモート', start: '2026年12月', role: '', experience: '',
    description: '予約管理画面の設計・開発・テスト。Reactでの開発経験3年以上。',
  },
  'MAIL-P02': {
    name: 'クラウド基盤の運用・改善', company: 'デモパートナー株式会社', skills: 'AWS, Linux, Terraform',
    rate: '', location: '品川 / 週2リモート', start: '2026年12月', role: '', experience: '',
    description: '監視設定の見直しと構成管理。単価は担当者への確認が必要。',
  },
  'MAIL-T01': {
    name: 'エンジニア D', company: 'サンプルワークス株式会社', skills: 'React, TypeScript',
    rate: '75万円', location: '', start: '2026年12月', role: 'フロントエンドエンジニア', experience: '5年',
    description: 'Webサービスの画面開発経験あり。',
  },
  'MAIL-T02': {
    name: 'エンジニア E', company: 'デモパートナー株式会社', skills: 'AWS, Linux',
    rate: '70万円', location: '', start: '', role: 'インフラエンジニア', experience: '4年',
    description: '稼働開始日は担当者への確認が必要。',
  },
}

// 本格版では社内のフォルダ読取処理へ差し替える。ブラウザのファイルシステムには触れない。
export function readSampleFolder(folderId: string): SampleMailFolder {
  const folder = sampleMailFolders.find(item => item.id === folderId)
  if (!folder) throw new Error('保存フォルダが見つかりません。')
  return structuredClone(folder)
}

export function getAvailableMail(files: SavedMail[], kind: MailKind, drafts: MailDraft[]): SavedMail[] {
  const queuedIds = new Set(drafts.map(draft => draft.sourceMailId))
  return files.filter(mail => mail.state === 'ready' && mail.kind === kind && !queuedIds.has(mail.id))
}

// 将来のローカルLLM接続点。現段階はサンプルに対応する固定結果のみ返す。
export function analyzeSampleMail(files: SavedMail[], kind: MailKind, drafts: MailDraft[]): MailDraft[] {
  return getAvailableMail(files, kind, drafts).map(mail => {
    const fields = sampleResults[mail.id]
    if (!fields) throw new Error('このメールのサンプル解析結果がありません。')
    return {
      ...fields, id: `DRAFT-${mail.id}`, sourceMailId: mail.id, sourceFileName: mail.fileName,
      sourceSubject: mail.subject, sourceBody: mail.body, kind, status: 'pending',
    }
  })
}

export function splitSkills(value: string): string[] {
  return [...new Set(value.split(/[,、\n]/).map(skill => skill.trim()).filter(Boolean))]
}

export function validateDraft(draft: MailDraft): Partial<Record<keyof DraftFields, string>> {
  const labels: Partial<Record<keyof DraftFields, string>> = {
    name: draft.kind === 'project' ? '案件名' : '人材名',
    company: draft.kind === 'project' ? '企業名' : '所属',
    skills: 'スキル', rate: draft.kind === 'project' ? '月額単価' : '希望月額単価',
    start: draft.kind === 'project' ? '参画時期' : '稼働可能時期',
    ...(draft.kind === 'talent' ? { role: '職種', experience: '経験年数' } : {}),
  }
  const errors: Partial<Record<keyof DraftFields, string>> = {}
  for (const field of Object.keys(labels) as (keyof DraftFields)[]) {
    if (!draft[field].trim() || (field === 'skills' && splitSkills(draft.skills).length === 0)) {
      errors[field] = `${labels[field]}を入力してください。`
    }
  }
  return errors
}

export function registerMailDraft(data: DashboardData, draft: MailDraft): DashboardData {
  if (draft.status === 'registered' || [...data.projects, ...data.talents].some(item => item.source?.mailId === draft.sourceMailId)) {
    throw new Error('このメールは登録済みです。')
  }
  if (Object.keys(validateDraft(draft)).length) throw new Error('必須項目を確認してください。')
  const source = { mailId: draft.sourceMailId, fileName: draft.sourceFileName, subject: draft.sourceSubject }
  if (draft.kind === 'project') {
    return {
      ...data,
      projects: [{
        id: `PJ-${draft.sourceMailId}`, title: draft.name.trim(), company: draft.company.trim(),
        skills: splitSkills(draft.skills), budget: draft.rate.trim(), location: draft.location.trim() || '未確認',
        start: draft.start.trim(), status: '募集中', receivedAt: '2026-10-29', description: draft.description.trim(), source,
      }, ...data.projects],
    }
  }
  return {
    ...data,
    talents: [{
      id: `EN-${draft.sourceMailId}`, name: draft.name.trim(), company: draft.company.trim(), role: draft.role.trim(),
      skills: splitSkills(draft.skills), experience: draft.experience.trim(), rate: draft.rate.trim(),
      available: draft.start.trim(), status: '稼働可能', description: draft.description.trim(), source,
    }, ...data.talents],
  }
}
