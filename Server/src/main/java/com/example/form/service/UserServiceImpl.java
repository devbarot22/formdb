package com.example.form.service;

import com.example.form.ExceptionHandler.ResourceNotFoundException;
import com.example.form.model.User;
import com.example.form.model.UserDto;
import com.example.form.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void deleteUserById(Long id){
        this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
        this.userRepository.deleteById(id);
    }

    @Override
    public UserDto saveUser(UserDto userDto) {
        System.out.println("Saving User: " + userDto);
        User user = this.convertToEntity(userDto);
        User savedUser = this.userRepository.save(user);
        return savedUser;
    }

    @Override
    public List<UserDto> getAllUsers(){
        List<User> users = this.userRepository.findAll();
        List<UserDto> userDtos = users.stream().map(this::convertToDto).collect(Collectors.toList());
        return userDtos;
    }

    @Override
    public UserDto getUserById(Long id){
        return this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
    }

    @Override
    public UserDto updateUser(UserDto user, Long id) {
        User existingUser = this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setAge(user.getAge());
        existingUser.setPhone(user.getPhone());
        existingUser.setGender(user.getGender());

        User updatedUser = this.userRepository.save(existingUser);

        return this.convertToDto(updatedUser);
    }

    private User convertToEntity(UserDto userDto){
        return this.modelMapper.map(userDto, User.class);
    }

    private UserDto convertToDto(User user){
        return this.modelMapper.map(user, UserDto.class);
    }

}
