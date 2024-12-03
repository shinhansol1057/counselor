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

// ... imports와 recentAnalysis 데이터는 동일

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

      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">음성 파일 분석 결과</h2>
          <p className="text-gray-500 mt-1">최근 분석된 상담 음성 파일의 감정 분석 결과입니다.</p>
        </div>
        <div className="space-y-5">
          {recentAnalysis.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <FileAudio className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-lg font-medium">{analysis.clientName} 내담자</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysis.emotionStatus === '긍정'
                          ? 'bg-green-100 text-green-600'
                          : analysis.emotionStatus === '보통'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {analysis.emotionStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {analysis.fileName} · {analysis.date} · {analysis.duration}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                상세보기
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
