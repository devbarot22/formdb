package com.example.form.ExceptionHandler;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ApiResponse {

    private String message;
    private boolean success;

    public ApiResponse(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }

}
