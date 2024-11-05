package com.example.form.controller;

import com.example.form.model.User;
import com.example.form.repository.UserRepository;
import com.example.form.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController

public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        System.out.println("Received User: " + user); // Debugging log
        System.out.println("First Name: " + user.getFirstName()); // Debugging log
        System.out.println("Last Name: " + user.getLastName()); // Debugging log
        System.out.println("Age: " + user.getAge()); // Debugging log
        System.out.println("Phone: " + user.getPhone()); // Debugging log
        System.out.println("Gender: " + user.getGender()); // Debugging log
        userService.saveUser(user);
        return ResponseEntity.ok("User created successfully");
    }


    @PostMapping
    public User submitForm(@Valid @RequestBody User user) {
        System.out.println("The user is being saved " + user);
        return userService.saveUser(user);
    }

    @GetMapping("/users")
    public List<User> fetchUsers() {
        return userService.getAllUsers();
    }
    
    @DeleteMapping("users/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Integer id) {
        boolean isDeleted = userService.deleteUserById(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public User UpdateUser(UserRepository user){
        
    }

}
