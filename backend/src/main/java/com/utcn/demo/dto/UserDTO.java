package com.utcn.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class UserDTO {
    private String id;
    private String email;
    private String password;
    private String name;
    private int score;
    private boolean isAdmin;
}
