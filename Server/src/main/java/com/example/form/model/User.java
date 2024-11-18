package com.example.form.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import javax.validation.constraints.NotEmpty;

@Entity
@Table(name = "users")
public class User extends UserDto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    @Column(name = "firstName", nullable = false)
    private String firstName;

    @NotBlank
    @Column(name = "lastName", nullable = false)
    private String lastName;

    @NotEmpty(message = "Are you a soul? Because our body has expiry date!")
    private Integer age;

    @NotBlank
    private String phone;

    @NotBlank(message = "Ohh! You Identify as 'Others'? Am sorry about that because my understanding of gender is only 2")
    private String gender;


    private String imageName;

    public String getImageName(){
        return imageName;
    }

    public void setImageName(String imageName){
        this.imageName = imageName;
    }

    @NotEmpty(message = "Nanakdo message")
    private String password;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
