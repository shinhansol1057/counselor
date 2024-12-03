package com.application.Repository;

import com.application.Entity.Counselor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CounselorRepository extends JpaRepository<Counselor, Long> {
    boolean existsByEmail(String email);
    Optional<Counselor> findByEmail(String email);  // Optional로 반환하여 orElseThrow 사용할 수 있게 수정
}
