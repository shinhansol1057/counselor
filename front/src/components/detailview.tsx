import { AnalysisData } from '@/pages/dashboard'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type Props = {
  analysis: AnalysisData[]
  onClose: () => void
}

export function DetailedView({ analysis }: Props) {
  const emotions = analysis.map((data) => {
    switch (data.emotion) {
      case '행복':
        return 0
      case '중립':
        return 1
      case '불안':
        return 2
      case '당황':
        return 3
      case '슬픔':
        return 4
      case '분노':
        return 5
      case '혐오':
        return 6
      default:
        return 1
    }
  })

  const chartData = emotions.map((value, index) => ({
    name: `대화 ${index + 1}`,
    value: value
  }))

  const getMostCommonKeywordAndEmotion = (data: AnalysisData[]) => {
    const keywords: string[] = []
    const emotions: string[] = []

    data.forEach((item) => {
      if (item.speaker_label === '1') {
        if (item.keywords) keywords.push(...item.keywords)
        if (item.emotion) emotions.push(item.emotion)
      }
    })

    const keywordCount = keywords.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const emotionCount = emotions.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCommonKeyword = Object.entries(keywordCount).sort((a, b) => b[1] - a[1])[0]?.[0]
    const mostCommonEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0]

    return [mostCommonKeyword, mostCommonEmotion]
  }

  const [mostCommonKeyword, mostCommonEmotion] = getMostCommonKeywordAndEmotion(analysis)

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">상세보기</h2>
      </div>
      <p className="text-lg">
        가장 많이 언급된 키워드: <span className="font-medium">{mostCommonKeyword}</span>
      </p>
      <p className="text-lg mb-4">
        주요 감정: <span className="font-medium text-red-500">{mostCommonEmotion}</span>
      </p>

      <div className="mb-6 h-[300px]">
        <h3 className="text-lg font-semibold mb-2">감정 변화 그래프</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
            <YAxis domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {analysis.map((item, index) => (
          <div key={index} className="p-2 bg-white rounded">
            <p>
              <strong>{item.speaker_label === '1' ? '내담자' : '상담사'}:</strong> {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
