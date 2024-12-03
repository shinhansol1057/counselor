import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

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
          <p className="text-2xl font-bold">56분</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">최근 상담 내역</h2>
            <Button variant="ghost" size="sm" className="text-gray-500">
              전체보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium mb-1">김OO 내담자</p>
                  <p className="text-sm text-gray-500">2024.01.{15 + i} · 60분</p>
                </div>
                <Button variant="outline" size="sm">
                  상세보기
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">감정 분석 통계</h2>
            <Button variant="ghost" size="sm" className="text-gray-500">
              자세히 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {["긍정", "보통", "부정"].map((emotion, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-16">{emotion}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-green-500 w-[60%]"
                        : i === 1
                        ? "bg-yellow-500 w-[30%]"
                        : "bg-red-500 w-[10%]"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {i === 0 ? "60%" : i === 1 ? "30%" : "10%"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
