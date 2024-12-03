package com.application.Repository;

import com.application.Entity.EmotionAnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmotionAnalysisReportRepository extends JpaRepository<EmotionAnalysisReport, Long> {
    List<EmotionAnalysisReport> findBySessionIdAndClientId(Long sessionId, Long clientId);
}
