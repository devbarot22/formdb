package com.example.form.controller;

import com.example.form.model.User;
import com.example.form.repository.UserRepository;
import com.example.form.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Validated
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        User createUser = this.userService.saveUser(user);
        return new ResponseEntity<>(createUser, HttpStatus.OK);
    }


//    @PostMapping("/saveUser")
//    public User submitForm(@Valid @RequestBody User user) {
//        System.out.println("The user is being saved " + user);
//        return userService.saveUser(user);
//    }

    @GetMapping()
    public List<User> fetchUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@Valid @PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setAge(updatedUser.getAge());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setGender(updatedUser.getGender());
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }


}
