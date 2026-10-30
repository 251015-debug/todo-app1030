import { getTips, pickTip } from '@/lib/tips'

export const metadata = {
  title: 'TODOのコツ | TODOアプリ',
}

export default async function TipsPage() {
  const tips = await getTips()
  return (
    <main className="container">
      <h1>TODOのコツ</h1>
      <ol>
        {tips.map((tip) => (
          <li key={tip.id}>{tip.text}</li>
        ))}
      </ol>
      <h1>今日のおすすめ</h1>
      <p>{pickTip(tips,new Date().getDay()).text}</p>
    </main>
  )
}
