package com.example.form.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public interface FileService {
    String uploadImage(String path, MultipartFile file) throws IOException;
    InputStream getResource(String path, String fileName) throws FileNotFoundException;
    String updateImage(String path, String existingFileName, MultipartFile newFile) throws IOException;
    void deleteImage(String path, String fileName) throws IOException;
}
