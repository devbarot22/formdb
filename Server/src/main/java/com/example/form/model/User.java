package com.example.form.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;


@Entity
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "Is your name 'Null'? Then why field is empty?")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotNull(message = "I know you hate your last name but we need it to proceed")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotNull(message = "Enter your age, not the one which satisfies you!! Real One!")
    @Min(value = 18, message = "Age should be 18 or above!")
    @Max(value = 100, message = "Age should be realistic!")
    private Integer age;

    @Column(name = "phone", unique = true)
    @NotNull(message = "No spam, No scan!")
    @Pattern(regexp = "^[0-9]{10}$", message = "Enter your correct number")
    private String phone;

    @NotNull(message = "Am sorry if you're from others because my knowledge of gender is only 2")
    private String gender;

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
