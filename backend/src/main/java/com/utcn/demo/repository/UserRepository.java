package com.utcn.demo.repository;

import com.utcn.demo.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
    Optional<User> findFirstByEmail(String email);
    Optional<User> findById(String id);
}
