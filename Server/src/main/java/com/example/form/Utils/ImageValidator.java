package com.example.form.Utils;

import org.springframework.web.multipart.MultipartFile;

public class ImageValidator {

    // Define max file size (e.g., 2 MB)
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

    // Allowed content types for images
    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg",
            "image/png",
    };

    // Method to validate file size and type
    public static boolean isValidImage(MultipartFile file) {
        return isValidSize(file) && isValidContentType(file);
    }

    // Check if file size is within the limit
    public static boolean isValidSize(MultipartFile file) {
        return file.getSize() <= MAX_FILE_SIZE;
    }

    // Check if file content type is allowed
    public static boolean isValidContentType(MultipartFile file) {
        String contentType = file.getContentType();
        for (String allowedType : ALLOWED_CONTENT_TYPES) {
            if (allowedType.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
}
