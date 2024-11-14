package com.example.form.service;


import com.example.form.model.UserDto;
import com.example.form.payloads.PostResponse;

import java.util.List;

public interface UserService {
    void deleteUserById(Long id);
    UserDto saveUser(UserDto user);
    PostResponse getAllUsers(Integer pageNumber, Integer pageSize);
    List<UserDto> getAllUsersData();
    UserDto getUserById(Long id);
    UserDto updateUser(UserDto user, Long id);

}
