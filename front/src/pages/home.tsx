import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isUploading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 15) + 5
          return Math.min(prev + increment, 100)
        })
      }, 500)

      return () => clearTimeout(timer)
    }

    if (progress === 100) {
      setTimeout(() => {
        setIsComplete(true)
      }, 500)
    }
  }, [isUploading, progress])

  const handleUpload = () => {
    setIsUploading(true)
    setProgress(0)
    setIsComplete(false)
  }

  const handleReset = () => {
    setIsUploading(false)
    setProgress(0)
    setIsComplete(false)
  }

  return (
    <div className="mt-12 bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium mb-2">안녕하세요 님!</h2>
          <p className="text-gray-500">분석할 음성 파일을 업로드 하세요.</p>
        </div>

        <div className="max-w-md mx-auto">
          {!isUploading && !isComplete && (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <p className="text-sm text-gray-500 mb-2">
                내담자 감정 분석까지는 최대 10분의 소요될 수 있어요.
              </p>
              <p className="text-sm text-gray-500 mb-6">감정 분석이 완료되면 알려드릴게요!</p>
              <Button className="w-full" onClick={handleUpload}>
                파일 업로드
              </Button>
            </div>
          )}

          {isUploading && !isComplete && (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-sm text-gray-500 mb-4">내담자의 감정을 분석하고 있어요.</p>
              <Progress value={progress} className="mb-4" />
              <p className="text-sm text-gray-500">
                감정 분석까지 약 {Math.ceil((100 - progress) / 20)}분 남았어요.
              </p>
            </div>
          )}

          {isComplete && (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-xl font-medium mb-4">감정 분석이 완료되었습니다!</p>
              <p className="text-sm text-gray-500 mb-6">
                내담자님의 감정 분석 결과를 확인해보세요.
              </p>
              <div className="grid grid-cols-2 gap-x-4">
                <Button variant="outline" onClick={handleReset}>
                  다른 파일 분석
                </Button>
                <Button>
                  <Link to="/dashboard">결과 보로가기</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
