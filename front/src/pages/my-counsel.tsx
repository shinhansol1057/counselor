import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState } from "react"
import { Search, Plus, Pencil } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

interface Client {
  id: number
  date: string
  name: string
  counselType: string
  counselor: string
  status: string
  counselDate: string
  nextDate: string
  gender: string
  birthDate: Date
  count: number
}

const dummyData: Client[] = [
  {
    id: 1,
    date: "2024-01-15",
    name: "김철수",
    counselType: "진로상담",
    counselor: "이상담",
    status: "진행",
    counselDate: "2024-01-20",
    nextDate: "2024-02-20",
    gender: "male",
    birthDate: new Date("1990-01-15"),
    count: 1
  },
  {
    id: 2,
    date: "2024-01-16",
    name: "이영희",
    counselType: "가족상담",
    counselor: "김상담",
    status: "신규",
    counselDate: "2024-01-25",
    nextDate: "2024-02-25",
    gender: "female",
    birthDate: new Date("1995-03-20"),
    count: 1
  },
  {
    id: 3,
    date: "2024-01-10",
    name: "박지민",
    counselType: "학업상담",
    counselor: "이상담",
    status: "종결",
    counselDate: "2024-01-18",
    nextDate: "2024-02-18",
    gender: "female",
    birthDate: new Date("1988-12-05"),
    count: 3
  }
]

function MyCounsel() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [birthDate, setBirthDate] = useState<Date>()

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-medium">안녕하세요 상담사님,</h1>
            <p className="text-gray-500">마음읽기가 도와드릴게요!</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <Plus className="w-4 h-4" />
            내담자 등록
          </Button>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button variant="outline" className="bg-red-50 text-red-500 flex-1 md:flex-none">
                전체
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                진행
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                완료
              </Button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="내담자 검색" className="pl-10 w-full" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">상담일</TableHead>
                  <TableHead className="whitespace-nowrap">이름</TableHead>
                  <TableHead className="whitespace-nowrap">상담주제</TableHead>
                  <TableHead className="whitespace-nowrap">면담자</TableHead>
                  <TableHead className="whitespace-nowrap">상담상태</TableHead>
                  <TableHead className="whitespace-nowrap">상담날짜</TableHead>
                  <TableHead className="whitespace-nowrap">다음상담</TableHead>
                  <TableHead className="whitespace-nowrap">내담자 회차</TableHead>
                  <TableHead className="whitespace-nowrap"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="whitespace-nowrap">{client.date}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.counselType}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.counselor}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.status}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.counselDate}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.nextDate}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.count}회차</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client)
                          setShowEditDialog(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">내담자 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신규">신규</SelectItem>
                  <SelectItem value="진행">진행</SelectItem>
                  <SelectItem value="종결">종결</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="이름을 입력하세요" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="상담주제 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="가족상담">가족상담</SelectItem>
                  <SelectItem value="진로상담">진로상담</SelectItem>
                  <SelectItem value="학업상담">학업상담</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="면담자 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="김상담">김상담</SelectItem>
                  <SelectItem value="이상담">이상담</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
              <DatePicker
                selected={birthDate}
                onSelect={setBirthDate}
                placeholder="생년월일 선택"
              />
              <Input
                type="number"
                placeholder="내담 회차"
                min={1}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <DialogFooter>
              <Button className="w-full" size="lg">
                등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">내담자 정보 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Select defaultValue={selectedClient?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신규">신규</SelectItem>
                  <SelectItem value="진행">진행</SelectItem>
                  <SelectItem value="종결">종결</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="이름을 입력하세요" defaultValue={selectedClient?.name} />
              <Select defaultValue={selectedClient?.counselType}>
                <SelectTrigger>
                  <SelectValue placeholder="상담주제 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="가족상담">가족상담</SelectItem>
                  <SelectItem value="진로상담">진로상담</SelectItem>
                  <SelectItem value="학업상담">학업상담</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={selectedClient?.counselor}>
                <SelectTrigger>
                  <SelectValue placeholder="면담자 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="김상담">김상담</SelectItem>
                  <SelectItem value="이상담">이상담</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={selectedClient?.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
              <DatePicker
                selected={selectedClient?.birthDate}
                onSelect={setBirthDate}
                placeholder="생년월일 선택"
              />
              <Input
                type="number"
                placeholder="내담 회차"
                defaultValue={selectedClient?.count}
                min={1}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <DialogFooter>
              <Button className="w-full" size="lg">
                수정
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default MyCounsel
