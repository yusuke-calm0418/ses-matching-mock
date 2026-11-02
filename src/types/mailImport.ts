export type MailKind = 'project' | 'talent'
export type MailFileState = 'ready' | 'duplicate' | 'unsupported'

export interface SavedMail {
  id: string
  fileName: string
  kind: MailKind | null
  subject: string
  sender: string
  receivedAt: string
  body: string
  attachments: string[]
  state: MailFileState
}

export interface SampleMailFolder {
  id: string
  name: string
  path: string
  files: SavedMail[]
}

export interface MailDraft {
  id: string
  sourceMailId: string
  sourceFileName: string
  sourceSubject: string
  sourceBody: string
  kind: MailKind
  name: string
  company: string
  skills: string
  rate: string
  location: string
  start: string
  role: string
  experience: string
  description: string
  status: 'pending' | 'registered'
}
