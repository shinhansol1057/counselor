package com.application.Service;

import com.application.Client.NaverCloudClient;
import com.application.Dto.ResponseDto;
import com.application.Entity.EmotionAnalysisReport;
import com.application.Entity.EmotionMap;
import com.application.Entity.Session;
import com.application.Repository.EmotionAnalysisReportRepository;
import com.application.Repository.EmotionMapRepository;
import com.application.Repository.SessionRepository;
import com.application.Service.FlaskCommunicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmotionAnalysisService {

    private final EmotionAnalysisReportRepository emotionAnalysisReportRepository;
    private final EmotionMapRepository emotionMapRepository;
    private final SessionRepository sessionRepository;
    private final NaverCloudClient naverCloudClient;
    private final FlaskCommunicationService flaskCommunicationService;

    @Autowired
    public EmotionAnalysisService(
            EmotionAnalysisReportRepository emotionAnalysisReportRepository,
            EmotionMapRepository emotionMapRepository,
            SessionRepository sessionRepository,
            NaverCloudClient naverCloudClient,
            FlaskCommunicationService flaskCommunicationService // 소문자로 수정
    ) {
        this.emotionAnalysisReportRepository = emotionAnalysisReportRepository;
        this.emotionMapRepository = emotionMapRepository;
        this.sessionRepository = sessionRepository;
        this.naverCloudClient = naverCloudClient;
        this.flaskCommunicationService = flaskCommunicationService; // 주입 연결
    }

    /**
     * 녹음 파일 분석
     *
     * @param clientId  클라이언트 ID
     * @param sessionNumber 세션 number
     * @param file      녹음 파일
     * @return 분석 결과
     */
    // Flask 서버 호출 후 임시 파일 삭제
    public ResponseDto<String> analyzeRecording(Long clientId, Integer sessionNumber, MultipartFile file) {
        File convertedFile = null;
        try {
            // 세션 확인
            Session session = sessionRepository.findByClientIdAndSessionNumber(clientId, sessionNumber)
                    .orElseThrow(() -> new IllegalArgumentException("해당 세션이 존재하지 않습니다."));

            // MultipartFile -> File 변환
            convertedFile = convertMultipartFileToFile(file);

            // Flask 서버로 분석 요청
            List<Map<String, Object>> analysisResults = flaskCommunicationService.analyzeRecording(convertedFile);

            // TODO: MOCK 데이터 생성로직으로 AI 연결 실패시 바로위에 'Flask 서버로 분석 요청' 로직 대신 사용하시면 됩니다.
//            List<Map<String, Object>> mockData = generateSampleData1();

            // 분석 결과를 데이터베이스에 저장
            saveAnalysisResults(session.getId(), analysisResults);

            // 성공 메시지 반환
            return ResponseDto.setSuccessData("분석 완료", "분석 결과가 성공적으로 저장되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("분석 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            // 변환된 임시 파일 삭제
            if (convertedFile != null && convertedFile.exists()) {
                convertedFile.delete();
            }
        }
    }

    // MultipartFile을 File로 변환하는 메서드
    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        // 임시 파일 생성
        File file = new File(System.getProperty("java.io.tmpdir"), multipartFile.getOriginalFilename());
        multipartFile.transferTo(file); // multipartFile 내용을 파일로 복사
        return file;
    }

    /**
     * 감정 분석 결과 저장
     *
     * @param sessionId      세션 ID
     * @param analysisResults 분석 결과
     */
    /**
     * 감정 분석 결과 저장
     *
     * @param sessionId      세션 ID
     * @param analysisResults 분석 결과
     */
    public void saveAnalysisResults(Long sessionId, List<Map<String, Object>> analysisResults) {
        // 1. 세션 정보 조회
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("해당 세션 ID가 존재하지 않습니다."));

        // 2. 세션에서 clientId 가져오기
        Long clientId = session.getClient().getId(); // Session 객체에 Client가 연관된 경우

        // 3. AI 분석 결과를 EmotionAnalysisReport 엔티티로 변환
        List<EmotionAnalysisReport> reports = analysisResults.stream().map(result -> {
            EmotionAnalysisReport report = new EmotionAnalysisReport();

            // 문장 데이터 설정
            String sentenceText = (String) result.get("text");
            String emotion = (String) result.get("emotion"); // 감정 (null 가능)
            String sentenceId = (String) result.get("id");   // "1"과 같은 String 형태
            String speakerLabel = (String) result.get("speaker_label");
            // 키워드 데이터를 JSON 문자열로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String keywords = null;
            Object keywordsObject = result.get("keywords");
            if (keywordsObject != null) {
                try {
                    // 키워드 배열을 JSON 문자열로 변환
                    keywords = objectMapper.writeValueAsString(keywordsObject);
                } catch (Exception e) {
                    e.printStackTrace();
                    keywords = "[]"; // 예외 처리로 빈 배열 문자열 반환
                }
            }
            // 문장 번호 설정 (String -> int 변환)
            int sentenceNumber = Integer.parseInt(sentenceId);


            // 보고서 엔티티 생성
            report.setSession(session);
            report.setClientId(clientId);           // Client ID 설정
            report.setSentenceNumber(sentenceNumber);
            report.setSentenceText(sentenceText);
            report.setDominantEmotion(emotion);     // 감정 값 (null 가능)
            report.setKeywords(keywords);          // 키워드 데이터
            report.setAnalyzedAt(new Timestamp(System.currentTimeMillis()));
            return report;
        }).collect(Collectors.toList());

        // 4. 데이터베이스에 저장
        emotionAnalysisReportRepository.saveAll(reports);
    }

    /**
     * 세션의 감정 분석 결과 조회
     *
     * @param sessionId 세션 ID
     * @param clientId 클라이언트 ID
     * @return 감정 분석 결과 목록
     */
    public List<EmotionAnalysisReport> getEmotionReportsBySessionAndClient(Long sessionId, Long clientId) {
        return emotionAnalysisReportRepository.findBySessionIdAndClientId(sessionId, clientId);
    }


    /**
     * 클라이언트의 감정 요약 데이터 조회
     *
     * @param clientId 클라이언트 ID
     * @return 감정 요약 데이터 목록
     */
    public List<EmotionMap> getEmotionSummaryByClient(Long clientId) {
        return emotionMapRepository.findByClient_Id(clientId);
    }

    public static List<Map<String, Object>> generateSampleData1() {
        List<Map<String, Object>> data = new ArrayList<>();

        // 데이터 1
        Map<String, Object> item1 = new HashMap<>();
        item1.put("id", "1");
        item1.put("speaker_label", "1");
        item1.put("text", "요즘에는 스트레스가 너무 많아서 잠을 제대로 못 자요. 일이 많고, 정신적으로도 지쳐서 하루 종일 피곤해요. 매일 밤마다 잠들기 전에 계속 생각이 나서 쉽사리 잠들지 못하고, 결국 아침에 일어나면 피곤하고 불안한 기분이 들어요.");
        item1.put("emotion", "불안");
        item1.put("keywords", Arrays.asList("스트레스", "잠", "피곤"));
        data.add(item1);

        // 데이터 2
        Map<String, Object> item2 = new HashMap<>();
        item2.put("id", "2");
        item2.put("speaker_label", "0");
        item2.put("text", "그렇다면 스트레스가 너무 많아서 잠을 못 자는 건 어떻게 해결할 수 있을까요? 매일 그렇게 힘들다면 좀 더 나은 방법을 찾아야 하지 않을까요?");
        item2.put("emotion", null);
        item2.put("keywords", null);
        data.add(item2);

        // 데이터 3
        Map<String, Object> item3 = new HashMap<>();
        item3.put("id", "3");
        item3.put("speaker_label", "1");
        item3.put("text", "정확히는 제 일 때문에 그런 것 같아요. 너무 많은 일을 동시에 처리하려다 보니 스트레스가 쌓이고, 그 스트레스 때문에 밤마다 잠을 제대로 자지 못하게 되는 거 같아요. 그로 인해 다음 날도 더 힘들어지고, 결국 악순환이 반복되네요.");
        item3.put("emotion", "불안");
        item3.put("keywords", Arrays.asList("일", "스트레스", "잠"));
        data.add(item3);

        // 데이터 4
        Map<String, Object> item4 = new HashMap<>();
        item4.put("id", "4");
        item4.put("speaker_label", "0");
        item4.put("text", "그렇다면 그 스트레스의 원인을 좀 더 구체적으로 파악해보는 건 어떨까요? 일에서 오는 스트레스가 너무 크다면, 그 일을 어떻게 효율적으로 처리할 수 있는 방법을 찾아보는 게 필요할 수도 있어요.");
        item4.put("emotion", null);
        item4.put("keywords", null);
        data.add(item4);

        // 데이터 5
        Map<String, Object> item5 = new HashMap<>();
        item5.put("id", "5");
        item5.put("speaker_label", "1");
        item5.put("text", "맞아요. 제 일을 좀 더 효율적으로 처리하려면 어떻게 해야 할지 고민이 돼요. 일을 나누어서 처리하거나, 미리 준비를 좀 더 철저히 해서 스트레스를 줄여야겠다고 생각은 했지만, 아직 실천은 못 해본 것 같아요.");
        item5.put("emotion", "슬픔");
        item5.put("keywords", Arrays.asList("효율성", "스트레스", "고민"));
        data.add(item5);

        // 데이터 6
        Map<String, Object> item6 = new HashMap<>();
        item6.put("id", "6");
        item6.put("speaker_label", "0");
        item6.put("text", "그렇다면 좀 더 구체적인 방법을 찾아보는 게 좋을 것 같아요. 예를 들어, 하루 일과를 좀 더 구체적으로 계획해서 시간 관리를 잘 해보거나, 스트레스를 덜 받기 위한 취미 생활을 시작해 보는 것도 방법일 수 있어요.");
        item6.put("emotion", null);
        item6.put("keywords", null);
        data.add(item6);

        // 데이터 7
        Map<String, Object> item7 = new HashMap<>();
        item7.put("id", "7");
        item7.put("speaker_label", "1");
        item7.put("text", "그런 방법도 좋을 것 같아요. 사실 요즘에는 취미도 없고, 집에 오면 너무 피곤해서 아무것도 하고 싶지 않아서 계속 집에만 있어요. 그럴 바에야 그냥 잠이나 자는 게 나을 것 같아서 항상 그렇게 되네요.");
        item7.put("emotion", "슬픔");
        item7.put("keywords", Arrays.asList("취미", "피곤", "우울"));
        data.add(item7);

        // 데이터 8
        Map<String, Object> item8 = new HashMap<>();
        item8.put("id", "8");
        item8.put("speaker_label", "0");
        item8.put("text", "그럴 땐 작은 변화라도 시도하는 게 좋을 것 같아요. 예를 들어, 매일 10분 정도 운동을 해보거나, 주말에 산책을 해보는 것도 기분 전환에 도움이 될 수 있어요.");
        item8.put("emotion", null);
        item8.put("keywords", null);
        data.add(item8);

        // 데이터 9
        Map<String, Object> item9 = new HashMap<>();
        item9.put("id", "9");
        item9.put("speaker_label", "1");
        item9.put("text", "운동은 정말 필요한 것 같아요. 요즘에는 시간이 없어서 운동을 못 하고 있는데, 그래도 조금씩 시간을 내서 운동을 해야겠다 싶어요. 일단 10분이라도 시작해보는 게 중요할 것 같아요.");
        item9.put("emotion", "행복");
        item9.put("keywords", Arrays.asList("운동", "결심", "시간"));
        data.add(item9);

        // 데이터 10
        Map<String, Object> item10 = new HashMap<>();
        item10.put("id", "10");
        item10.put("speaker_label", "0");
        item10.put("text", "맞아요. 10분이라도 운동을 시작하는 게 중요한 것 같아요. 시간을 내기 어려운 상황에서도 조금씩이라도 실천하면, 점차 몸과 마음에 좋은 영향을 미칠 거예요.");
        item10.put("emotion", "중립");
        item10.put("keywords", Arrays.asList("운동", "실천", "긍정"));
        data.add(item10);

        return data;
    }

    public static List<Map<String, Object>> generateSampleData2() {
        List<Map<String, Object>> data = new ArrayList<>();

        // 데이터 1
        Map<String, Object> item1 = new HashMap<>();
        item1.put("id", "1");
        item1.put("speaker_label", "1");
        item1.put("text", "최근에 가족과의 관계가 좀 힘들어져서 스트레스가 쌓이고 있어요. 서로 의견이 맞지 않아서 자주 다투게 되고, 그로 인해 기분이 많이 가라앉고 있습니다.");
        item1.put("emotion", "슬픔");
        item1.put("keywords", Arrays.asList("가족", "스트레스", "다툼"));
        data.add(item1);

        // 데이터 2
        Map<String, Object> item2 = new HashMap<>();
        item2.put("id", "2");
        item2.put("speaker_label", "0");
        item2.put("text", "그렇다면 어떻게 하면 그 관계를 회복할 수 있을까요? 서로의 입장을 좀 더 이해할 필요가 있을 것 같아요.");
        item2.put("emotion", null);
        item2.put("keywords", null);
        data.add(item2);

        // 데이터 3
        Map<String, Object> item3 = new HashMap<>();
        item3.put("id", "3");
        item3.put("speaker_label", "1");
        item3.put("text", "그럴 때마다 저도 많이 걱정돼요. 마음이 너무 무겁고, 어떻게 해야 할지 모르겠어요. 이 상황에서 벗어나고 싶은데, 계속 마음이 불안하고 짜증이 나요.");
        item3.put("emotion", "불안");
        item3.put("keywords", Arrays.asList("걱정", "불안", "갈등"));
        data.add(item3);

        // 데이터 4
        Map<String, Object> item4 = new HashMap<>();
        item4.put("id", "4");
        item4.put("speaker_label", "0");
        item4.put("text", "상황을 조금씩 개선해 나가는 방법을 찾아야 할 것 같아요. 작은 대화부터 시작해서 서로를 이해하려는 노력이 필요할 것 같아요.");
        item4.put("emotion", null);
        item4.put("keywords", null);
        data.add(item4);

        // 데이터 5
        Map<String, Object> item5 = new HashMap<>();
        item5.put("id", "5");
        item5.put("speaker_label", "1");
        item5.put("text", "그렇긴 하지만 마음속에서는 계속 두려움이 커져가고 있어요. 내가 제대로 대처하고 있는지, 이 관계가 계속 지속될 수 있을지 걱정돼요.");
        item5.put("emotion", "불안");
        item5.put("keywords", Arrays.asList("두려움", "불안", "관계"));
        data.add(item5);

        // 데이터 6
        Map<String, Object> item6 = new HashMap<>();
        item6.put("id", "6");
        item6.put("speaker_label", "0");
        item6.put("text", "그러면 그 감정을 어떻게 다루면 좋을까요? 때로는 감정을 솔직하게 표현하는 것도 방법이 될 수 있어요.");
        item6.put("emotion", null);
        item6.put("keywords", null);
        data.add(item6);

        // 데이터 7
        Map<String, Object> item7 = new HashMap<>();
        item7.put("id", "7");
        item7.put("speaker_label", "1");
        item7.put("text", "그렇게 하려고 했는데, 말을 꺼내는 순간 그 순간이 너무 당황스러웠어요. 어떻게 시작해야 할지 몰랐고, 결국 말문이 막혔어요.");
        item7.put("emotion", "당황");
        item7.put("keywords", Arrays.asList("당황", "말문", "어색"));
        data.add(item7);

        // 데이터 8
        Map<String, Object> item8 = new HashMap<>();
        item8.put("id", "8");
        item8.put("speaker_label", "0");
        item8.put("text", "그럴 때는 잠시 숨을 고르고, 마음을 가라앉히는 시간이 필요할 것 같아요. 좀 더 침착하게 대화를 이어나가면 좋겠죠.");
        item8.put("emotion", null);
        item8.put("keywords", null);
        data.add(item8);

        // 데이터 9
        Map<String, Object> item9 = new HashMap<>();
        item9.put("id", "9");
        item9.put("speaker_label", "1");
        item9.put("text", "맞아요. 숨을 고르고 나면 마음이 한결 가벼워져요. 다시 대화를 시작해보면 훨씬 효과적일 것 같아요. 그래도 여전히 조금씩 불안한 감정은 남아있지만요.");
        item9.put("emotion", "불안");
        item9.put("keywords", Arrays.asList("숨", "침착", "불안"));
        data.add(item9);

        // 데이터 10
        Map<String, Object> item10 = new HashMap<>();
        item10.put("id", "10");
        item10.put("speaker_label", "0");
        item10.put("text", "그렇다면 조금씩 시간을 두고, 점차적으로 상황을 풀어가며, 서로를 배려하는 태도가 필요할 것 같아요.");
        item10.put("emotion", "행복");
        item10.put("keywords", Arrays.asList("배려", "서로", "관계"));
        data.add(item10);

        return data;
    }
}
