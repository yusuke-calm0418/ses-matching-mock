import test from 'node:test'
import assert from 'node:assert/strict'
import { readSampleFolder, getAvailableMail, analyzeSampleMail, validateDraft, registerMailDraft } from '../src/services/mailImportService.ts'

const emptyData = () => ({ projects: [], talents: [], matches: [] })

test('フォルダの種類・取込済み状態から解析対象を絞り込む', () => {
  const mixed = readSampleFolder('mixed')
  const projects = getAvailableMail(mixed.files, 'project', [])
  assert.deepEqual(projects.map(mail => mail.id), ['MAIL-P01', 'MAIL-P02'])
  const drafts = analyzeSampleMail(projects, 'project', [])
  assert.equal(getAvailableMail(mixed.files, 'project', drafts).length, 0)
  assert.equal(getAvailableMail(mixed.files, 'talent', drafts).length, 2)
  assert.equal(analyzeSampleMail(mixed.files, 'project', drafts).length, 0)
})

test('サンプルフォルダの変更が元データに影響しない', () => {
  const folder = readSampleFolder('projects')
  folder.files[0].subject = '変更済み'
  assert.notEqual(readSampleFolder('projects').files[0].subject, '変更済み')
  assert.throws(() => readSampleFolder('unknown'), /見つかりません/)
})

test('不足項目の修正後に案件を登録し、二重登録を防ぐ', () => {
  const files = readSampleFolder('projects').files
  const draft = analyzeSampleMail(files, 'project', [])[1]
  assert.deepEqual(Object.keys(validateDraft(draft)), ['rate'])
  assert.throws(() => registerMailDraft(emptyData(), draft), /必須項目/)
  const corrected = { ...draft, rate: '70〜80万円', skills: 'AWS、 Linux, AWS\nTerraform' }
  const original = emptyData()
  const result = registerMailDraft(original, corrected)
  assert.equal(original.projects.length, 0)
  assert.equal(result.projects.length, 1)
  assert.deepEqual(result.projects[0].skills, ['AWS', 'Linux', 'Terraform'])
  assert.equal(result.projects[0].source.mailId, draft.sourceMailId)
  assert.equal(result.projects[0].budget, '70〜80万円')
  assert.throws(() => registerMailDraft(result, corrected), /登録済み/)
  assert.throws(() => registerMailDraft(emptyData(), { ...corrected, status: 'registered' }), /登録済み/)
})

test('人材の稼働可能時期・所属と元メールを保持する', () => {
  const draft = analyzeSampleMail(readSampleFolder('talents').files, 'talent', [])[1]
  assert.deepEqual(Object.keys(validateDraft(draft)), ['start'])
  const corrected = { ...draft, start: '2026年12月' }
  const result = registerMailDraft(emptyData(), corrected)
  assert.equal(result.projects.length, 0)
  assert.equal(result.talents[0].available, '2026年12月')
  assert.equal(result.talents[0].company, draft.company)
  assert.equal(result.talents[0].source.fileName, draft.sourceFileName)
})

test('空白や区切り文字だけの必須項目は登録できない', () => {
  const draft = analyzeSampleMail(readSampleFolder('projects').files, 'project', [])[0]
  const invalid = { ...draft, name: '  ', skills: ', 、\n' }
  assert.deepEqual(Object.keys(validateDraft(invalid)), ['name', 'skills'])
  assert.throws(() => registerMailDraft(emptyData(), invalid), /必須項目/)
})
