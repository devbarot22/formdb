package org.example.springsecurity.Repository;

import org.example.springsecurity.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UserRepo extends JpaRepository<Users,Integer> {
    Users findByUsername(String username);

}
