package com.example.form.controller;

import com.example.form.ExceptionHandler.ApiResponse;
import com.example.form.Utils.ImageValidator;
import com.example.form.config.AppConstants;
import com.example.form.model.UserDto;
import com.example.form.payloads.PostResponse;
import com.example.form.service.FileService;
import com.example.form.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Value("images")
    private String path;


    //Creating User Method
    @PostMapping("/createUser")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        UserDto createUser = this.userService.saveUser(userDto);
        return new ResponseEntity<>(createUser, HttpStatus.CREATED);
    }

    //This method is created to get all users the database users
    @GetMapping("/all-users-paging")
    public ResponseEntity<PostResponse> getAllUsers(
            @RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = AppConstants.SORT_ORDER, required = false) String sortOrder
    ) {

        PostResponse postResponse = this.userService.getAllUsers(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<PostResponse>(postResponse, OK);
    }

    @GetMapping("/all-users")
    public ResponseEntity<List<UserDto>> getAllUserData() {
        List<UserDto> userDto = this.userService.getAllUsersData();

        return new ResponseEntity<List<UserDto>>(userDto, OK);
    }

    //This method is created to get user by its id
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(this.userService.getUserById(Math.toIntExact(id)));
    }

    //This method is created to let user update the user id
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@Valid @PathVariable("id") Long id, @RequestBody UserDto userUp) {
        UserDto updatedUser = this.userService.updateUser(userUp, Math.toIntExact(id));
        return ResponseEntity.ok(updatedUser);
    }

    //This method is created to let user delete data
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable("id") Long id) {
        this.userService.deleteUserById(id);
        return new ResponseEntity<>(new ApiResponse("User has been deleted", true), OK);
    }

//    @GetMapping("/search/{keywords}")
//    //This method is created to search from all users
//    public ResponseEntity<List<UserDto>> searchUserByTitle(
//            @PathVariable("keywords") String keywords
//    )
//    {
//        List<UserDto> result = this.userService.searchUser(keywords);
//        return new ResponseEntity<List<UserDto>>(result, HttpStatus.OK);
//    }


//    ----------------------------------------Image CRUD------------------------------------------------


    //    post image upload
    @PostMapping("/image/{id}")
    public ResponseEntity<?> uploadUserImage(@RequestParam("image") MultipartFile image,
                                             @PathVariable long id) throws IOException {

        if (!ImageValidator.isValidImage(image)) {
            return new ResponseEntity<>(new ApiResponse("Invalid image file: only JPG, PNG allowed and size should be under 2 MB", false), HttpStatus.BAD_REQUEST);
        }

        UserDto userDto = this.userService.getUserById((int) id);

        String fileName = this.fileService.uploadImage(path, image);
        userDto.setImageName(fileName);
        UserDto updatedUser = this.userService.updateUser(userDto, (int) id);
        return new ResponseEntity<>(updatedUser, OK);
    }

    //    Method to serve files
    @GetMapping(value = "/image/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
    public void getUserImage(@PathVariable("imageName") String imageName, HttpServletResponse response) throws IOException {

        InputStream resource = this.fileService.getResource(path, imageName);
        response.setContentType(MediaType.IMAGE_PNG_VALUE);
        StreamUtils.copy(resource, response.getOutputStream());
    }

    //    Method to Update file
    @PutMapping("/image/update/{id}")
    public ResponseEntity<?> updateUserImage(
            @PathVariable("id") long id,
            @RequestParam("image") MultipartFile image) throws IOException {

        if (!ImageValidator.isValidImage(image)) {
            return new ResponseEntity<>(new ApiResponse("Invalid image file: only JPG, PNG allowed and size should be under 2 MB", false), HttpStatus.BAD_REQUEST);
        }
        // Fetch the existing user by id
        UserDto userDto = this.userService.getUserById((int) id);

        // Get the name of the existing image file to be replaced
        String existingFileName = userDto.getImageName();

        // Use the FileService to replace the existing image with the new one
        String updatedFileName = this.fileService.updateImage(path, existingFileName, image);

        // Update the user DTO with the new file name
        userDto.setImageName(updatedFileName);

        // Save the updated user information
        UserDto updatedUser = this.userService.updateUser(userDto, (int) id);

        // Return the updated user information
        return new ResponseEntity<>(updatedUser, OK);
    }

    //    Method to delete file
//    @DeleteMapping("/image/delete/{id}")
//    public ResponseEntity<ApiResponse> deleteUserImage(@PathVariable("id") long id) throws IOException {
//        // Fetch the user by id to get the image name
//        UserDto userDto = this.userService.getUserById(id);
//
//        // Get the name of the existing image file
//        String fileName = userDto.getImageName();
//
//        if (fileName != null && !fileName.isEmpty()) {
//            // Delete the image file using the FileService
//            try {
//                System.out.println("Deleting image");
//
//                this.fileService.deleteImage(path, fileName);
//                System.out.println("Deleted image");
//
//                // Set the image name in the user DTO to null or empty
//                userDto.setImageName(null);
//
//                // Update the user to remove the image reference
//                this.userService.updateUser(userDto, id);
//
//                // Return a response indicating success
//                return new ResponseEntity<>(new ApiResponse("User image deleted successfully", true), OK);
//            } catch (IOException e) {
//                System.err.println("Failed to delete the image: " + e.getMessage());
//                return new ResponseEntity<>(new ApiResponse("Failed to delete the image", false), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        } else {
//            // Return a response indicating failed
//            return new ResponseEntity<>(new ApiResponse("No image found for this user", false), HttpStatus.NOT_FOUND);
//        }
//    }


    @DeleteMapping("/image/delete/{id}")
    public ResponseEntity<ApiResponse> deleteUserImage(@PathVariable("id") Integer id) throws IOException {

        // Fetch the user by id to get the image name
        UserDto userDto = this.userService.getUserById(id);

        // Get the name of the existing image file
        String fileName = userDto.getImageName();

        if (fileName != null && !fileName.isEmpty()) {

            // Delete the image file using the FileService
            this.fileService.deleteImage(path, fileName);

            // Set the image name in the user DTO to null or empty
            userDto.setImageName(null);

            // Update the user to remove the image reference
            this.userService.updateUser(userDto, id);

            // Return a response indicating success
            return new ResponseEntity<>(new ApiResponse("User image deleted successfully", true), HttpStatus.OK);
        } else {

            // Return a response indicating failed
            return new ResponseEntity<>(new ApiResponse("No image found for this user", false), HttpStatus.NOT_FOUND);
        }
    }
}
