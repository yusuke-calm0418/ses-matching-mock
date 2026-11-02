export type PageId = 'dashboard' | 'mail' | 'talent' | 'review' | 'matching'
export type RecordStatus = '募集中' | '確認待ち' | '提案中' | '稼働可能'
export interface MailSource {
  mailId: string
  fileName: string
  subject: string
}
export interface Project {
  source?: MailSource
  id: string
  title: string
  company: string
  skills: string[]
  budget: string
  location: string
  start: string
  status: RecordStatus
  receivedAt: string
  description: string
}
export interface Talent {
  source?: MailSource
  company?: string
  description?: string
  id: string
  name: string
  role: string
  skills: string[]
  experience: string
  rate: string
  available: string
  status: RecordStatus
}
export interface Match {
  id: string
  projectId: string
  talentId: string
  score: number
  reason: string
  concern: string
  status: '未確認' | '確認済み'
}
export interface DashboardData {
  projects: Project[]
  talents: Talent[]
  matches: Match[]
}
