import { dashboardData } from '../data/dashboard'
import type { DashboardData } from '../types/dashboard'

// 本格開発時は、この窓口をAPI通信へ置き換える。
export function getDashboardData(): DashboardData {
  return structuredClone(dashboardData)
}
