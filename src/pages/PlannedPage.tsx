import { navigation } from '../data/navigation'

const plans = {
  matching: ['案件・人材の選択', 'マッチングの実行', '候補と適合理由の比較'],
}

export function PlannedPage({ page, onBack }: {
  page: 'matching'
  onBack: () => void
}) {
  const item = navigation.find(item => item.id === page)!
  return (
    <>
      <div className="page-heading"><h1>{item.label}</h1></div>
      <section className="panel planned-page">
        <h2>未実装</h2>
        <p>この画面はまだ利用できません。</p>
        <div className="planned-features">
          <h3>実装予定の機能</h3>
          <ul>{plans[page].map(feature => <li key={feature}>{feature}</li>)}</ul>
        </div>
        <button className="button secondary" onClick={onBack}>ダッシュボードに戻る</button>
      </section>
    </>
  )
}
