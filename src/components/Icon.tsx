export type IconName = 'grid' | 'mail' | 'users' | 'check' | 'matching' | 'arrow' | 'search' | 'briefcase' | 'close' | 'clock' | 'folder'
const paths: Record<IconName, string> = {
  folder: 'M3 7V4h6l2 3h10v13H3z',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87',
  check: 'M9 3H5v18h14V3h-4 M9 2h6v4H9z M8 13l3 3 5-6',
  matching: 'M8 7h12 M16 3l4 4-4 4 M16 17H4 M8 13l-4 4 4 4',
  arrow: 'M5 12h14 M14 7l5 5-5 5',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0',
  briefcase: 'M3 7h18v14H3z M8 7V3h8v4 M3 12c5 4 13 4 18 0 M10 13h4',
  close: 'M6 6l12 12 M6 18L18 6',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 0-20 0 10 10 0 0 0 20 0',
}
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
