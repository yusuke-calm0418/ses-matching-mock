import type { SampleMailFolder, SavedMail } from '../types/mailImport'

const projectMails: SavedMail[] = [
  {
    id: 'MAIL-P01', fileName: '20261029_予約管理システム.eml', kind: 'project',
    subject: '【案件】予約管理システム開発 / React・TypeScript',
    sender: 'サンプル営業部 <sales@example.com>', receivedAt: '2026/10/29 10:15',
    body: '案件名：予約管理システム開発\n企業名：サンプルワークス株式会社\nスキル：React、TypeScript\n単価：65〜80万円／月\n勤務地：東京・週3日リモート\n開始：2026年12月\n\n予約管理画面の設計・開発・テストを担当。Reactでの開発経験3年以上を想定。',
    attachments: [], state: 'ready',
  },
  {
    id: 'MAIL-P02', fileName: '20261029_インフラ運用.msg', kind: 'project',
    subject: '【案件】クラウド基盤の運用・改善 / AWS',
    sender: 'デモパートナー <partner@example.org>', receivedAt: '2026/10/29 11:30',
    body: '案件名：クラウド基盤の運用・改善\n企業名：デモパートナー株式会社\nスキル：AWS、Linux、Terraform\n単価：応相談\n勤務地：品川・週2日リモート\n開始：2026年12月\n\n監視設定の見直しと構成管理を担当。単価の詳細は確認が必要です。',
    attachments: ['案件概要.pdf'], state: 'ready',
  },
  {
    id: 'MAIL-P03', fileName: '20261028_金融サービス.eml', kind: 'project',
    subject: '【案件】金融サービスのWebアプリ開発',
    sender: 'サンプルテック営業部 <sales@example.net>', receivedAt: '2026/10/28 16:00',
    body: '案件名：金融サービスのWebアプリ開発\nスキル：Java、Spring Boot、AWS\n\n登録済み案件 PJ-001 と同じメールです。',
    attachments: [], state: 'duplicate',
  },
]

const talentMails: SavedMail[] = [
  {
    id: 'MAIL-T01', fileName: '20261029_エンジニアD.eml', kind: 'talent',
    subject: '【人材】エンジニア D / React・TypeScript / 12月〜',
    sender: 'サンプル人材担当 <staff@example.com>', receivedAt: '2026/10/29 09:45',
    body: '人材名：エンジニア D\n所属：サンプルワークス株式会社\n職種：フロントエンドエンジニア\nスキル：React、TypeScript\n経験：5年\n希望単価：75万円／月\n稼働可能時期：2026年12月\n\nWebサービスの画面開発経験あり。スキルシートを添付します。',
    attachments: ['スキルシート_エンジニアD.xlsx'], state: 'ready',
  },
  {
    id: 'MAIL-T02', fileName: '20261029_エンジニアE.msg', kind: 'talent',
    subject: '【人材】エンジニア E / AWS・Linux',
    sender: 'デモ人材担当 <staff@example.org>', receivedAt: '2026/10/29 13:00',
    body: '人材名：エンジニア E\n所属：デモパートナー株式会社\n職種：インフラエンジニア\nスキル：AWS、Linux\n経験：4年\n希望単価：70万円／月\n稼働可能時期：調整中\n\n稼働開始日は担当者への確認が必要です。',
    attachments: ['スキルシート_エンジニアE.pdf'], state: 'ready',
  },
]

const otherFile: SavedMail = {
  id: 'FILE-OTHER', fileName: 'フォルダ運用メモ.txt', kind: null,
  subject: '', sender: '', receivedAt: '', body: '', attachments: [], state: 'unsupported',
}

export const sampleMailFolders: SampleMailFolder[] = [
  { id: 'projects', name: '案件メール', path: '営業共有 / メール保存 / 案件', files: projectMails },
  { id: 'talents', name: '人材メール', path: '営業共有 / メール保存 / 人材', files: talentMails },
  { id: 'mixed', name: '未整理メール', path: '営業共有 / メール保存 / 未整理', files: [...projectMails, ...talentMails, otherFile] },
]
