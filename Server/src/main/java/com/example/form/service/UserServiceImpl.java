package com.example.form.service;

import com.example.form.ExceptionHandler.ResourceNotFoundException;
import com.example.form.model.User;
import com.example.form.model.UserDto;
import com.example.form.payloads.PostResponse;
import com.example.form.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

//    Pageable pageable =

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void deleteUserById(Long id) {
        this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "Id", id));
        this.userRepository.deleteById(id);
    }

    @Override
    public UserDto saveUser(UserDto userDto) {
        System.out.println("Saving User: " + userDto);
        User user = this.convertToEntity(userDto);
        return this.userRepository.save(user);
    }

    @Override
    public PostResponse getAllUsers(
            Integer pageNumber, Integer pageSize, String sortBy, String sortOrder
    ) {
        Sort sort = (sortOrder.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();


        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<User> userPost = this.userRepository.findAll(pageable);
        List<User> allUsers = userPost.getContent();

        List<UserDto> userDto = allUsers.stream().map(this::convertToDto).collect(Collectors.toList());

        PostResponse postResponse = new PostResponse();

        postResponse.setContent(userDto);
        postResponse.setPageNumber(userPost.getNumber());
        postResponse.setPageSize(userPost.getSize());
        postResponse.setTotalElements(userPost.getTotalElements());

        postResponse.setTotalPages(userPost.getTotalPages());
        postResponse.setLastPage(userPost.isLast());

        return postResponse;
    }

    public List<UserDto> getAllUsersData() {
        List<User> users = this.userRepository.findAll();
        return users.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
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

//    @Override
//    public List<UserDto> searchUser(String keyword){
//        List<User> users = this.userRepository.findByTitleContaining(keyword);
//        return users.stream().map((post) -> this.modelMapper.map(post, UserDto.class)).toList();
//    }

    private User convertToEntity(UserDto userDto) {
        return this.modelMapper.map(userDto, User.class);
    }

    private UserDto convertToDto(User user) {
        return this.modelMapper.map(user, UserDto.class);
    }

}
