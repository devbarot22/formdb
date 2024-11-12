package com.example.form.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

    @Service
    public class FileServiceImpl implements FileService {

        @Override
        public String uploadImage(String path, MultipartFile file) throws IOException {

//         File Name
            String fileName = file.getOriginalFilename();

//        random name generate file
            String randomID = UUID.randomUUID().toString();
            String fileName1 = randomID.concat(fileName.substring(fileName.lastIndexOf(".")));

//        Full path
            String filePath = path + File.separator + fileName1;


//        create folder if not created
            File newFile = new File(path);
            if (!newFile.exists()) {
                newFile.mkdirs();
            }

//        file copy
            Files.copy(file.getInputStream(), Paths.get(filePath));
            return fileName1;
        }

        @Override
        public InputStream getResource(String path, String fileName) throws FileNotFoundException {
            String filePath = path + File.separator + fileName;
            InputStream inputStream = new FileInputStream(filePath);

//        db logic to return inputStream
            return inputStream;
        }


        // Method to update an image file
        @Override
        public String updateImage(String path, String existingFileName, MultipartFile newFile) throws IOException {
            // Construct the path to the existing file
            String existingFilePath = path + File.separator + existingFileName;

            // Delete the existing file if it exists
            File oldFile = new File(existingFilePath);
            if (oldFile.exists()) {
                oldFile.delete();
            }

            // Call uploadImage to upload the new file and return the new filename
            return uploadImage(path, newFile);
        }

        //    Method to delete an image file
        @Override
        public void deleteImage(String path, String fileName) throws IOException {
            // Construct the full path to the image file
            String filePath = path + File.separator + fileName;

            // Create a File object
            File file = new File(filePath);

            // Check if the file exists and delete it
            if (file.exists()) {
                if (file.delete()) {
                    System.out.println("Image deleted successfully.");
                } else {
                    throw new IOException("Failed to delete the image.");
                }
            } else {
                System.out.println("Image file not found.");
            }
        }


    }

