import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { EmotionHeptagonChart } from '@/components/ui/emotion-herptagon-chart'
import { DetailedView } from '@/components/detailview'

interface Client {
  id: number
  name: string
  status: string
}

interface Analysis {
  id: number
  clientName: string
  date: string
  duration: string
  analysisData?: AnalysisData[]
}

export interface AnalysisData {
  id: string
  speaker_label: string
  text: string
  emotion: string | null
  keywords: string[] | null
}

const clientList: Client[] = [
  { id: 0, name: '전체 내담자', status: 'active' },
  { id: 1, name: '김OO', status: 'active' },
  { id: 2, name: '이OO', status: 'active' },
  { id: 3, name: '박OO', status: 'active' }
]

const recentAnalysis: Analysis[] = [
  {
    id: 1,
    clientName: '김OO',
    date: '2024.01.15',
    duration: '60분',
    analysisData: [
      {
        id: '1',
        speaker_label: '1',
        text: '저는 요즘 소화가 잘 안돼요.',
        emotion: '불안',
        keywords: ['소화', '요즘']
      },
      {
        id: '2',
        speaker_label: '0',
        text: '무엇 때문에 소화가 잘 안된다고 생각하나요?',
        emotion: null,
        keywords: null
      },
      {
        id: '3',
        speaker_label: '1',
        text: '밤에 늦게 먹고 자서 그런 것 같아요.',
        emotion: '불안',
        keywords: ['밤', '먹다']
      }
    ]
  },
  {
    id: 2,
    clientName: '이OO',
    date: '2024.01.16',
    duration: '60분',
    analysisData: [
      {
        id: '1',
        speaker_label: '1',
        text: '저는 요즘 소화가 잘 안돼요.',
        emotion: '불안',
        keywords: ['소화', '요즘']
      },
      {
        id: '2',
        speaker_label: '0',
        text: '무엇 때문에 소화가 잘 안된다고 생각하나요?',
        emotion: null,
        keywords: null
      },
      {
        id: '3',
        speaker_label: '1',
        text: '밤에 늦게 먹고 자서 그런 것 같아요.',
        emotion: '불안',
        keywords: ['밤', '먹다']
      }
    ]
  },
  {
    id: 3,
    clientName: '박OO',
    date: '2024.01.17',
    duration: '60분',
    analysisData: [
      {
        id: '1',
        speaker_label: '1',
        text: '저는 요즘 소화가 잘 안돼요.',
        emotion: '불안',
        keywords: ['소화', '요즘']
      },
      {
        id: '2',
        speaker_label: '0',
        text: '무엇 때문에 소화가 잘 안된다고 생각하나요?',
        emotion: null,
        keywords: null
      },
      {
        id: '3',
        speaker_label: '1',
        text: '밤에 늦게 먹고 자서 그런 것 같아요.',
        emotion: '불안',
        keywords: ['밤', '먹다']
      }
    ]
  }
]

const emotionData = {
  labels: ['행복', '슬픔', '분노', '평온', '걱정', '즐거움', '신뢰'],
  values: [4, 1, 2, 5, 3, 6, 9]
}

function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get('clientId') || '0'
  const [expandedAnalysis, setExpandedAnalysis] = useState<number | null>(null)

  const handleClientChange = (value: string) => {
    navigate(`/dashboard?clientId=${value}`)
  }

  const toggleDetails = (analysisId: number) => {
    setExpandedAnalysis(expandedAnalysis === analysisId ? null : analysisId)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">대시보드</h1>
          <p className="text-gray-500">상담 현황과 통계를 한눈에 확인하세요</p>
        </div>
        <Select value={clientId} onValueChange={handleClientChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="내담자 선택" />
          </SelectTrigger>
          <SelectContent>
            {clientList.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">이번 달 상담</p>
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
          <p className="text-2xl font-bold">48 분</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="p-6">
          <div>
            <h2 className="text-2xl font-bold">감정 분석 결과</h2>
            <p className="text-gray-500 mt-1">최근 분석된 상담의 감정 분석 결과입니다.</p>
          </div>
          <div className="flex justify-center">
            <EmotionHeptagonChart data={emotionData} />
          </div>
        </Card>
        <Card className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">최근 상담 내역</h2>
            <p className="text-gray-500 mt-1">최근 분석된 상담의 감정 분석 결과입니다.</p>
          </div>
          <div className="space-y-5">
            {recentAnalysis.map((analysis) => (
              <div key={analysis.id}>
                <div className="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-lg font-medium">{analysis.clientName} 내담자</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {analysis.date} · {analysis.duration}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleDetails(analysis.id)}>
                    {expandedAnalysis === analysis.id ? '접기' : '상세보기'}
                  </Button>
                </div>
                {expandedAnalysis === analysis.id && analysis.analysisData && (
                  <DetailedView
                    analysis={analysis.analysisData}
                    onClose={() => setExpandedAnalysis(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
