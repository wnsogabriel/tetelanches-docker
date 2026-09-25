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
@RequestMapping("api/produtos")
@CrossOrigin("*")
@Tag(name = "Produtos", description = "Endpoints para gerenciamento do catálogo de produtos")
public class ProdutoAPI {
 
 private final ProdutoDAO dao;

 ProdutoAPI(ProdutoDAO dao) {
  this.dao = dao;
 }

 @GetMapping
 public List<Produto> obterTodos() {
  return dao.findAll();
 }

 @Operation(summary = "Criar novo produto", description = "Cadastra um produto e valida duplicidade.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados da requisição inválidos")
    })
 @PostMapping
 public void inserir(@RequestBody Produto p) {
  dao.save(p);
 }
}