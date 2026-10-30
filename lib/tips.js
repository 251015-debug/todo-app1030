const tips = [
  { id: 1, text: '大きなタスクは小さく分けて登録する' },
  { id: 2, text: '終わったらすぐチェックを付ける' },
  { id: 3, text: '1日の終わりに残りを見直す' },
]

export async function getTips() {
  return tips
}

export function pickTip(tips,day){
    return tips[day % tips.length]
}