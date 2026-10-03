package com.example.demo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CardapioTete {

    private static final String COMPLEMENTOS = " + os complementos (maionese temperada, ketchup, Billy Jack, "
            + "molho verde, barbecue, alface, milho, ervilha, queijo ralado e batata palha).";

    @Bean
    CommandLineRunner carregarCardapio(LancheDAO dao) {
        return args -> {
            if (dao.count() > 0) {
                return;
            }

            List<Lanche> cardapio = List.of(
                lanche("Hambúrguer", "Pão e carne" + COMPLEMENTOS, "8.00"),
                lanche("X-Burguer", "Pão, carne, queijo e presunto" + COMPLEMENTOS, "10.00"),
                lanche("X-Egg", "Pão, carne, queijo, presunto e ovo" + COMPLEMENTOS, "11.00"),
                lanche("X-Tudo", "Pão, carne, queijo, presunto, ovo e bacon" + COMPLEMENTOS, "12.00"),
                lanche("X-Bacon", "Pão, carne, queijo, presunto e bacon" + COMPLEMENTOS, "14.00"),
                lanche("X-Tudo Duplo", "Pão, 2 carnes, 2 queijos, presunto, ovo e bacon" + COMPLEMENTOS, "15.00"),
                lanche("X-Tudo Triplo", "Pão, 3 carnes, 3 queijos, presunto, ovo e bacon" + COMPLEMENTOS, "17.00"),
                lanche("Hot Dog de Salsicha", "Pão com salsicha" + COMPLEMENTOS, "8.00"),
                lanche("Hot Dog de Linguiça", "Pão com linguiça" + COMPLEMENTOS, "9.00")
            );

            dao.saveAll(cardapio);
        };
    }

    private static Lanche lanche(String nome, String descricao, String preco) {
        Lanche l = new Lanche();
        l.nome = nome;
        l.descricao = descricao;
        l.preco = new BigDecimal(preco);
        return l;
    }
}
