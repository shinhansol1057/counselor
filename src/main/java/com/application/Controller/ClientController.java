package com.application.Controller;

import com.application.Dto.ClientResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.application.Dto.ClientRequestDto;
import com.application.Dto.ResponseDto;
import com.application.Entity.Client;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Service.ClientService;
import com.application.Service.EmotionAnalysisService;
import com.application.Service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;
    private final EmotionAnalysisService emotionAnalysisService;
    private final SessionService sessionService;

    @Autowired
    public ClientController(ClientService clientService, EmotionAnalysisService emotionAnalysisService, SessionService sessionService) {
        this.clientService = clientService;
        this.emotionAnalysisService = emotionAnalysisService;
        this.sessionService = sessionService;
    }

    // 로그인된 상담사에게 배정된 내담자 목록 조회
    @GetMapping("/assigned-clients")
    public ResponseDto<List<Client>> getClientsByLoggedInCounselor() {
        return clientService.getClientsByLoggedInCounselor();
    }


    // 특정 내담자 조회
    @GetMapping("/{clientId}")
    public ResponseDto<ClientResponseDto> getClientById(@PathVariable Long clientId) {
        return clientService.getClientById(clientId);
    }


    // 특정 내담자의 감정 요약 조회
    @GetMapping("/{clientId}/summary")
    public ResponseDto<List<EmotionMap>> getEmotionSummaryByClient(@PathVariable Long clientId) {
        List<EmotionMap> emotionSummary = emotionAnalysisService.getEmotionSummaryByClient(clientId);
        return ResponseDto.setSuccessData(emotionSummary);
    }

    // 특정 내담자의 모든 세션 조회
    @GetMapping("/{clientId}/sessions")
    public ResponseDto<List<Session>> getSessionsByClient(@PathVariable Long clientId) {
        return sessionService.getSessionsByClient(clientId);
    }

    private static final Logger logger = LoggerFactory.getLogger(ClientController.class);

    // 내담자 추가
    @PostMapping
    public ResponseDto<Client> addClient(@RequestBody ClientRequestDto clientRequestDto) {
        System.out.println("\n\nReceived topic: " + clientRequestDto.getTopic()+"\n\n"); // 디버깅용

        Client client = new Client();
        client.setRegistrationStatus(clientRequestDto.getRegistrationStatus());
        client.setName(clientRequestDto.getName());
        client.setContactNumber(clientRequestDto.getContactNumber());
        client.setGender(clientRequestDto.getGender());
        client.setAge(clientRequestDto.getAge());
        client.setRegistrationDate(LocalDate.parse(clientRequestDto.getRegistrationDate()));
        client.setTopic(clientRequestDto.getTopic()); // topic 설정

        return clientService.addClient(client);
    }



    // 내담자 정보 수정
    @PutMapping("/{id}")
    public ResponseDto<Client> updateClient(
            @PathVariable Long id,
            @RequestBody Client client) {
        return clientService.updateClient(id, client);
    }

    // 내담자 삭제
    @DeleteMapping("/{id}")
    public ResponseDto<?> deleteClient(@PathVariable Long id) {
        return clientService.deleteClient(id);
    }
}
