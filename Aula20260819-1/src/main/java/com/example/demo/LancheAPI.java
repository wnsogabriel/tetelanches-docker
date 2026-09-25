package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/lanches")
@CrossOrigin("*")
@Tag(name = "Lanches", description = "Endpoints para gerenciamento do catálogo de lanches")
public class LancheAPI {
 
 private final LancheDAO dao;

 LancheAPI(LancheDAO dao) {
  this.dao = dao;
 }

 @GetMapping
 public List<Lanche> obterTodos() {
  return dao.findAll();
 }

 @Operation(summary = "Criar novo lanche", description = "Cadastra um lanche.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lanche criado com sucesso"),
    })
 @PostMapping
 public void inserir(@RequestBody Lanche p) {
  dao.save(p);
 }
}