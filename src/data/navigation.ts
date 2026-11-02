import type { PageId } from '../types/dashboard'
import type { IconName } from '../components/Icon'

export const navigation: { id: PageId; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'ダッシュボード', icon: 'grid' },
  { id: 'mail', label: '案件メール取り込み', icon: 'mail' },
  { id: 'talent', label: '人材メール取り込み', icon: 'users' },
  { id: 'review', label: '取り込み結果確認', icon: 'check' },
  { id: 'matching', label: 'マッチング', icon: 'matching' },
]
