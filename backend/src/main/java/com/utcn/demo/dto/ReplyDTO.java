package com.utcn.demo.dto;

import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Set;
@AllArgsConstructor
@Getter
@Setter
public class ReplyDTO {
    private String id;
    private String body;
    private User author;
    private Question questionId;
    private String created_at;
    private Long voteCount = 0L;
    private boolean isAccepted = false;
    private Set<User> likedBy;
    private Set<User> dislikedBy;
}
