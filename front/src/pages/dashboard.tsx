import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FileAudio
} from 'lucide-react'

const recentAnalysis = [
  {
    id: 1,
    clientName: '김철수',
    fileName: 'counseling_session_01.mp3',
    date: '2024.01.15',
    duration: '45:22',
    emotionStatus: '긍정'
  },
  {
    id: 2,
    clientName: '이영희',
    fileName: 'counseling_session_02.mp3',
    date: '2024.01.14',
    duration: '32:15',
    emotionStatus: '보통'
  },
  {
    id: 3,
    clientName: '박지민',
    fileName: 'counseling_session_03.mp3',
    date: '2024.01.13',
    duration: '28:47',
    emotionStatus: '부정'
  }
]

function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-500">상담 현황과 통계를 한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">전체 내담자</p>
          <p className="text-2xl font-bold">127명</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">총 상담 횟수</p>
          <p className="text-2xl font-bold">89회</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">총 상담 시간</p>
          <p className="text-2xl font-bold">267시간</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">평균 상담시간</p>
          <p className="text-2xl font-bold">56분</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">최근 분석된 음성 파일</h2>
            <Button variant="ghost" size="sm" className="text-gray-500">
              전체보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentAnalysis.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileAudio className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">{analysis.clientName} 내담자</p>
                    <p className="text-sm text-gray-500">
                      {analysis.fileName} · {analysis.date} · {analysis.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      analysis.emotionStatus === '긍정'
                        ? 'bg-green-100 text-green-600'
                        : analysis.emotionStatus === '보통'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {analysis.emotionStatus}
                  </span>
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
