package com.bytepe.controller;

import com.bytepe.config.JwtAuthFilter.CustomUserDetails;
import com.bytepe.model.TeamMember;
import com.bytepe.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<TeamMember>> getTeam(Authentication auth) {
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        return ResponseEntity.ok(teamService.getTeamByPartner(details.partnerId()));
    }

    @PostMapping
    public ResponseEntity<TeamMember> addTeamMember(@RequestBody Map<String, String> body, Authentication auth) {
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        String name = body.get("name");
        String mobile = body.get("mobile");
        String role = body.get("role");

        TeamMember member = teamService.addTeamMember(details.partnerId(), name, mobile, role);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable String id) {
        teamService.deleteTeamMember(id);
        return ResponseEntity.noContent().build();
    }
}
