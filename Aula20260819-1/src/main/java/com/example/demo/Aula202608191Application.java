package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 
Comandos do docker...

docker network create backn_rede_001

docker network connect backn_rede_001 pdbbackn

docker build . -t app_back_n1

docker run --network backn_rede_001 --name serv-back-n1 -p 8080:8080 app_back_n1

docker build . -t app_front_n1

docker run --network backn_rede_001 --name serv-front-n1 -p 3000:3000 app_front_n1

 
*/

@SpringBootApplication
public class Aula202608191Application {

	public static void main(String[] args) {
		SpringApplication.run(Aula202608191Application.class, args);
	}

}
