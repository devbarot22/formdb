package com.example.form.controller;

import com.example.form.ExceptionHandler.ApiResponse;
import com.example.form.model.UserDto;
import com.example.form.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    //Creating User Method
    @PostMapping()
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto user) {
        UserDto createUser = this.userService.saveUser(user);
        System.out.println();
        return new ResponseEntity<>(createUser, HttpStatus.CREATED);
    }

    //This method is created to get all users the database users
    @GetMapping()
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(this.userService.getAllUsers());
    }

    //This method is created to get user by its id
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    //This method is created to let user update the user id
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@Valid @PathVariable("id") Long id, @RequestBody UserDto userUp) {
        UserDto updatedUser = this.userService.updateUser(userUp, id);
        return ResponseEntity.ok(updatedUser);
    }

    //This method is created to let user delete data
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable("id") Long id) {
        this.userService.deleteUserById(id);
        return new ResponseEntity<>(new ApiResponse("User has been deleted", true), HttpStatus.OK);
    }


}
