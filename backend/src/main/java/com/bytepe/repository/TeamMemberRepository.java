package com.bytepe.repository;

import com.bytepe.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {
    List<TeamMember> findByPartnerId(String partnerId);
}
