import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, Clock, ArrowUpRight, Type} from 'lucide-react'
import {useEffect, useState} from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { EmotionHeptagonChart } from '@/components/ui/emotion-herptagon-chart'
import { DetailedView } from '@/components/detailview'
import {getClients, getDashboardData} from "@/api/client.ts";
import {ClientType, DashboardType} from "@/type/clientType.ts";

// export interface AnalysisData {
//   id: string
//   speaker_label: string
//   text: string
//   emotion: string | null
//   keywords: string[] | null
// }

interface EmotionJson {
  [key: string]: number | undefined;
}

interface EmotionData {
  labels: string[];
  values: number[];
}

function transformEmotionData(emotionJson: EmotionJson): EmotionData {
  // 사용 가능한 감정 키 목록 정의
  const availableKeys = ["행복", "중립", "불안", "당황", "슬픔", "분노", "혐호"];

  // 모든 감정값을 0으로 초기화하여 완성된 객체 생성
  const completeEmotionJson: { [key: string]: number } = Object.fromEntries(
      availableKeys.map(key => [key, emotionJson[key] || 0])
  );

  return {
    labels: Object.keys(completeEmotionJson),
    values: Object.values(completeEmotionJson)
  };
}

function Dashboard() {
  const [expandedAnalysis, setExpandedAnalysis] = useState<number | null>(null)
  const [clients, setClients] = useState<ClientType[]>([]);
  const [selectClient, setSelectClient] = useState<string>("0")
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(null)

  const toggleDetails = (analysisId: number) => {
    setExpandedAnalysis(expandedAnalysis === analysisId ? null : analysisId)
  }

  useEffect(() => {
    getClients()
        .then((res) => {
          setClients(res.data.data)

        })
  }, []);
  useEffect(() => {
    getDashboardData(selectClient)
        .then((res) => {
          setDashboardData(res.data.data)
        })
  }, [selectClient]);
  console.log(dashboardData)
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">대시보드</h1>
          <p className="text-gray-500">상담 현황과 통계를 한눈에 확인하세요</p>
        </div>
        <Select value={selectClient} onValueChange={setSelectClient}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="내담자 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={0} value={"0"}>
              전체
            </SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={String(client.id)}>
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
          <p className="text-2xl font-bold">{dashboardData?.totalClientCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">총 상담 횟수</p>
          <p className="text-2xl font-bold">{dashboardData?.totalCounselingCount}회</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">총 상담 시간</p>
          <p className="text-2xl font-bold">{dashboardData?.totalCounselingTime}</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Type className="w-5 h-5 text-green-600" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">최다 상담 주제</p>
          <p className="text-2xl font-bold">{dashboardData?.mostFrequencyEmotion}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card className="p-6">
          <div>
            <h2 className="text-2xl font-bold">감정 분석 결과</h2>
            <p className="text-gray-500 mt-1">최근 분석된 상담의 감정 분석 결과입니다.</p>
          </div>
          <div className="flex justify-center">
            {dashboardData && <EmotionHeptagonChart data={transformEmotionData(dashboardData?.counselingCountByEmotion)} />}
          </div>
        </Card>
        <Card className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">최근 상담 내역</h2>
            <p className="text-gray-500 mt-1">최근 분석된 상담의 감정 분석 결과입니다.</p>
          </div>
          <div className="space-y-5">
            {dashboardData?.counselingDetails.map((analysis) => (
              <div key={analysis.id}>
                <div className="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-lg font-medium">{analysis.clientName} 내담자</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {analysis.data} ({analysis.duration}분)
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
