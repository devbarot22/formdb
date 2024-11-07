package com.example.form.service;


import com.example.form.model.UserDto;

import java.util.List;

public interface UserService {
    void deleteUserById(Long id);
    UserDto saveUser(UserDto user);
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto updateUser(UserDto user, Long id);

}
