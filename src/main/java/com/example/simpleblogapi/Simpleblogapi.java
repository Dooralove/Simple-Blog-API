package com.example.simpleblogapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class Simpleblogapi {

	public static void main(String[] args) {
		SpringApplication.run(Simpleblogapi.class, args);
	}
}
