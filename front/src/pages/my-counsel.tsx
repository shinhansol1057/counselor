import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useState} from "react"
import { Search, Plus, Pencil } from "lucide-react"
import PostClientModal from "@/components/client/PostClientModal.tsx";
import UpdateClientModal from "@/components/client/UpdateClientModal.tsx";

export interface Client {
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
            <PostClientModal showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog}/>
            <UpdateClientModal showEditDialog={showEditDialog} setShowEditDialog={setShowEditDialog} clientId={1}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCounsel
