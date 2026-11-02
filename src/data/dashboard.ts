import type { DashboardData } from '../types/dashboard'

export const dashboardData: DashboardData = {
  projects: [
    { id: 'PJ-001', title: '金融サービスのWebアプリ開発', company: 'サンプルテック株式会社', skills: ['Java', 'Spring Boot', 'AWS'], budget: '70〜85万円', location: '東京 / 週3リモート', start: '2026年11月', status: '募集中', receivedAt: '2026-10-29', description: '金融サービスの機能追加に伴う設計・開発・テスト。Javaでの開発経験3年以上を想定しています。' },
    { id: 'PJ-002', title: 'ECプラットフォーム フロントエンド開発', company: '架空コマース株式会社', skills: ['React', 'TypeScript'], budget: '65〜80万円', location: 'フルリモート', start: '2026年11月', status: '募集中', receivedAt: '2026-10-29', description: 'ECサイトの購入体験改善。React・TypeScriptでの画面開発と、デザイナーとの協業を想定しています。' },
    { id: 'PJ-003', title: '社内データ分析基盤の構築', company: 'デモデータ株式会社', skills: ['Python', 'SQL', 'AWS'], budget: '75〜90万円', location: '品川 / 週2リモート', start: '2026年12月', status: '募集中', receivedAt: '2026-10-28', description: 'データパイプラインの設計と構築。Python・SQLによるデータ処理経験を想定しています。' },
    { id: 'PJ-004', title: '業務管理システムのリニューアル', company: 'モデルソリューションズ株式会社', skills: ['Java', 'Vue.js'], budget: '60〜75万円', location: '新宿 / 週3リモート', start: '2026年12月', status: '提案中', receivedAt: '2026-10-28', description: '既存の業務管理システムの刷新。基本設計から結合テストまでを担当する想定です。' },
  ],
  talents: [
    { id: 'EN-001', name: 'エンジニア A', role: 'バックエンドエンジニア', skills: ['Java', 'Spring Boot', 'AWS'], experience: '6年', rate: '75万円', available: '2026年11月', status: '稼働可能' },
    { id: 'EN-002', name: 'エンジニア B', role: 'フロントエンドエンジニア', skills: ['React', 'TypeScript', 'Vue.js'], experience: '4年', rate: '70万円', available: '2026年11月', status: '稼働可能' },
    { id: 'EN-003', name: 'エンジニア C', role: 'データエンジニア', skills: ['Python', 'SQL', 'AWS'], experience: '5年', rate: '80万円', available: '2026年12月', status: '稼働可能' },
  ],
  matches: [
    { id: 'MT-001', projectId: 'PJ-001', talentId: 'EN-001', score: 94, reason: 'Java・Spring Boot・AWSのスキルと、希望単価・参画時期が一致しています。', concern: '出社頻度の希望は未確認です。', status: '未確認' },
    { id: 'MT-002', projectId: 'PJ-002', talentId: 'EN-002', score: 91, reason: 'React・TypeScriptのスキルと、希望単価・参画時期が一致しています。', concern: 'EC領域の業務経験は未確認です。', status: '未確認' },
    { id: 'MT-003', projectId: 'PJ-003', talentId: 'EN-003', score: 87, reason: 'Python・SQL・AWSのスキルと、希望単価が一致しています。', concern: '出社頻度の希望は未確認です。', status: '確認済み' },
  ],
}
