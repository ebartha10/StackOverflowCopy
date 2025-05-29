package com.utcn.demo.dto;

import com.utcn.demo.entity.User;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class QuestionDTO {
    private String id;
    private String authorId;
    private String title;
    private User author;
    private String body;
    private Date createdAt;
    private List<String> tags;
    private Long voteCount = 0L;
    private Set<String> likedById;
    private Set<String> dislikedById;
}
