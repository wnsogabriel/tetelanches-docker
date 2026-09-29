package com.example.demo;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

// "Atendente do balcao": recebe as requisicoes HTTP e repassa para o DAO
@RestController
@RequestMapping("api/lanches")
@CrossOrigin("*")
@Tag(name = "Lanches", description = "Endpoints para gerenciamento do catálogo de lanches")
public class LancheAPI {

    private final LancheDAO dao;

    LancheAPI(LancheDAO dao) {
        this.dao = dao;
    }

    // READ (todos): GET /api/lanches
    @Operation(summary = "Listar lanches", description = "Retorna todos os lanches cadastrados no cardápio do TeteLanches.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de lanches retornada com sucesso (pode vir vazia se não houver cadastros)")
    })
    @GetMapping
    public List<Lanche> obterTodos() {
        return dao.findAll();
    }

    // READ (um): GET /api/lanches/{id}
    @Operation(summary = "Buscar lanche por id", description = "Retorna um lanche específico pelo seu código.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lanche encontrado"),
        @ApiResponse(responseCode = "404", description = "Não existe lanche com esse id")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Lanche> obterPorId(@PathVariable("id") Integer id) {
        // findById devolve um Optional: "talvez tenha, talvez nao"
        return dao.findById(id)
                .map(ResponseEntity::ok)                      // achou: 200 com o lanche
                .orElse(ResponseEntity.notFound().build());   // nao achou: 404
    }

    // CREATE: POST /api/lanches
    @Operation(summary = "Cadastrar lanche", description = "Cadastra um novo lanche no cardápio do TeteLanches. O id é gerado pelo banco e não deve ser enviado.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lanche cadastrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos: JSON malformado ou campo com tipo errado")
    })
    @PostMapping
    public void inserir(@RequestBody Lanche p) {
        dao.save(p);
    }

    // UPDATE: PUT /api/lanches/{id}
    @Operation(summary = "Atualizar lanche", description = "Substitui os dados de um lanche existente pelos dados enviados.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lanche atualizado; o corpo traz o lanche já salvo"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos: JSON malformado ou campo com tipo errado"),
        @ApiResponse(responseCode = "404", description = "Não existe lanche com esse id")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Lanche> atualizar(@PathVariable("id") Integer id, @RequestBody Lanche lanche) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // O id da URL manda: garante que vai atualizar o registro certo.
        // Com id preenchido, o save() faz UPDATE em vez de INSERT.
        lanche.id = id;
        return ResponseEntity.ok(dao.save(lanche));
    }

    // DELETE: DELETE /api/lanches/{id}
    @Operation(summary = "Excluir lanche", description = "Remove um lanche do cardápio.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Lanche excluído (resposta sem conteúdo)"),
        @ApiResponse(responseCode = "404", description = "Não existe lanche com esse id")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Integer id) {
        if (!dao.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dao.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}