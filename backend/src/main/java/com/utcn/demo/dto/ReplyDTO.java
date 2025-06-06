package com.utcn.demo.dto;

import com.utcn.demo.entity.Question;
import com.utcn.demo.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Set;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReplyDTO {
    private String id;
    private String body;
    private User author;
    private String questionId;
    private String created_at;
    private Long voteCount = 0L;
    private boolean isAccepted = false;
    private Set<String> likedBy;
    private Set<String> dislikedBy;
}
