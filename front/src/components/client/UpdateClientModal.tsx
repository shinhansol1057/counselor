import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {DatePicker} from "@/components/ui/date-picker.tsx";
import {Button} from "@/components/ui/button.tsx";
import {getTopics} from "@/api/topic.ts";

type Props = {
    showEditDialog: boolean;
    setShowEditDialog: (show: boolean) => void;
    clientId: number;
}
const UpdateClientModal = ({showEditDialog, setShowEditDialog}:Props) => {
    const [birthDate, setBirthDate] = useState<Date>()
    const [topics, setTopics] = useState<string[]>([])

    useEffect(() => {
        getTopics()
            .then((res) => {
                setTopics(res.data.data)
            })
    }, []);
    return (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            {/*<DialogContent>*/}
            {/*    <DialogHeader>*/}
            {/*        <DialogTitle className="text-lg font-medium">내담자 정보 수정</DialogTitle>*/}
            {/*    </DialogHeader>*/}
            {/*    <div className="space-y-3 py-4">*/}
            {/*        <Select defaultValue={selectedClient?.status}>*/}
            {/*            <SelectTrigger>*/}
            {/*                <SelectValue placeholder="상태 선택" />*/}
            {/*            </SelectTrigger>*/}
            {/*            <SelectContent>*/}
            {/*                <SelectItem value="신규">신규</SelectItem>*/}
            {/*                <SelectItem value="진행">진행</SelectItem>*/}
            {/*                <SelectItem value="종결">종결</SelectItem>*/}
            {/*            </SelectContent>*/}
            {/*        </Select>*/}
            {/*        <Input placeholder="이름을 입력하세요" defaultValue={selectedClient?.name} />*/}
            {/*        <Select defaultValue={selectedClient?.counselType}>*/}
            {/*            <SelectTrigger>*/}
            {/*                <SelectValue placeholder="상담주제 선택" />*/}
            {/*            </SelectTrigger>*/}
            {/*            <SelectContent>*/}
            {/*                <SelectItem value="가족상담">가족상담</SelectItem>*/}
            {/*                <SelectItem value="진로상담">진로상담</SelectItem>*/}
            {/*                <SelectItem value="학업상담">학업상담</SelectItem>*/}
            {/*            </SelectContent>*/}
            {/*        </Select>*/}
            {/*        <Select defaultValue={selectedClient?.counselor}>*/}
            {/*            <SelectTrigger>*/}
            {/*                <SelectValue placeholder="면담자 선택" />*/}
            {/*            </SelectTrigger>*/}
            {/*            <SelectContent>*/}
            {/*                <SelectItem value="김상담">김상담</SelectItem>*/}
            {/*                <SelectItem value="이상담">이상담</SelectItem>*/}
            {/*            </SelectContent>*/}
            {/*        </Select>*/}
            {/*        <Select defaultValue={selectedClient?.gender}>*/}
            {/*            <SelectTrigger>*/}
            {/*                <SelectValue placeholder="성별 선택" />*/}
            {/*            </SelectTrigger>*/}
            {/*            <SelectContent>*/}
            {/*                <SelectItem value="male">남성</SelectItem>*/}
            {/*                <SelectItem value="female">여성</SelectItem>*/}
            {/*            </SelectContent>*/}
            {/*        </Select>*/}
            {/*        <DatePicker*/}
            {/*            selected={selectedClient?.birthDate}*/}
            {/*            onSelect={setBirthDate}*/}
            {/*            placeholder="생년월일 선택"*/}
            {/*        />*/}
            {/*        <Input*/}
            {/*            type="number"*/}
            {/*            placeholder="내담 회차"*/}
            {/*            defaultValue={selectedClient?.count}*/}
            {/*            min={1}*/}
            {/*            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <DialogFooter>*/}
            {/*        <Button className="w-full" size="lg">*/}
            {/*            수정*/}
            {/*        </Button>*/}
            {/*    </DialogFooter>*/}
            {/*</DialogContent>*/}
        </Dialog>
    );
};

export default UpdateClientModal;
