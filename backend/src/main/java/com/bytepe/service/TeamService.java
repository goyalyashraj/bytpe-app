package com.bytepe.service;

import com.bytepe.model.TeamMember;
import com.bytepe.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamMemberRepository teamMemberRepository;

    public TeamService(TeamMemberRepository teamMemberRepository) {
        this.teamMemberRepository = teamMemberRepository;
    }

    public TeamMember addTeamMember(String partnerId, String name, String mobile, String role) {
        String memberId = "TM_" + UUID.randomUUID().toString().substring(0, 8);
        TeamMember member = TeamMember.builder()
                .id(memberId)
                .partnerId(partnerId)
                .name(name)
                .mobile(mobile)
                .role(role != null ? role : "Store Agent")
                .build();
        return teamMemberRepository.save(member);
    }

    public List<TeamMember> getTeamByPartner(String partnerId) {
        return teamMemberRepository.findByPartnerId(partnerId);
    }

    public void deleteTeamMember(String id) {
        teamMemberRepository.deleteById(id);
    }
}
