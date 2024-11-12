package com.example.form.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UserDto {
    private int id;

    //    @NotBlank
    private String firstName;

    //    @NotBlank
    private String lastName;

    //    @NotEmpty(message = "Are you a soul? Because our body has expiry date!")
    @Min(value = 18, message = "Age should be 18 or above!")
    @Max(value = 100, message = "Age should be realistic!")
    private Integer age;

    //    @NotBlank
    @Min(value = 10, message = "Enter your number, x")
    private String phone;

    //    @NotBlank(message = "Ohh! You Identify as 'Others'? Am sorry about that because my understanding of gender is only 2")
    private String gender;

    private String imageName;


    public String getImageName(){
        return imageName;
    }

    public void setImageName(String imageName){
        this.imageName = imageName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

}
