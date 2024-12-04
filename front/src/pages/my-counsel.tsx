import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState } from 'react'
import { Search, Plus, Pencil } from 'lucide-react'
import PostClientModal from '@/components/client/PostClientModal'
import UpdateClientModal from '@/components/client/UpdateClientModal'

export interface Client {
  id: number
  name: string
  age: number
  gender: string
  contactNumber: string
  topic: string
  birthDate: string
  registrationDate: string
  registrationStatus: string
  counselorClients: any[]
  emotionMap: any
  createdAt: string
  updatedAt: string
}

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
                  <TableHead className="whitespace-nowrap">ID</TableHead>
                  <TableHead className="whitespace-nowrap">이름(나이)</TableHead>
                  <TableHead className="whitespace-nowrap">성별</TableHead>
                  <TableHead className="whitespace-nowrap">연락처</TableHead>
                  <TableHead className="whitespace-nowrap">생년월일</TableHead>
                  <TableHead className="whitespace-nowrap">등록일</TableHead>
                  <TableHead className="whitespace-nowrap"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* API 데이터를 매핑할 때 사용할 예시 */}
                {/* {clients.map((client) => ( */}
                <TableRow>
                  <TableCell className="whitespace-nowrap">5</TableCell>
                  <TableCell className="whitespace-nowrap">신한솔(8)</TableCell>
                  <TableCell className="whitespace-nowrap">남성</TableCell>
                  <TableCell className="whitespace-nowrap">01028041057</TableCell>
                  <TableCell className="whitespace-nowrap">2016-02-04</TableCell>
                  <TableCell className="whitespace-nowrap">2024-12-04</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedClient(null)
                        setShowEditDialog(true)
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
            <PostClientModal showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} />
            <UpdateClientModal
              showEditDialog={showEditDialog}
              setShowEditDialog={setShowEditDialog}
              clientId={1}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCounsel
