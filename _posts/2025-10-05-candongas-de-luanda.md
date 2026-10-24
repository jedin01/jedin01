---
title: "Quero chegar à Mutamba: um mapa digital das candongas de Luanda"
description: Um sistema que transforma as paragens e rotas dos táxis informais de Luanda num grafo, com um planeador que diz que táxis apanhar e quanto custa a viagem.
tags: [Mobilidade urbana, Grafos, Luanda, Tech for good]
lang: pt
original: https://www.linkedin.com/feed/update/urn:li:activity:7380538577715154945/
---

> “Quero chegar à Mutamba… será a minha primeira vez, não sei como chegar, que táxis pegar…”

Essa frase resume perfeitamente o problema que quero resolver.

O sistema que estou a desenvolver nasce justamente dessa realidade: o dia a dia de milhares de pessoas que se deslocam por Luanda sem um mapa claro das rotas, preços e conexões das candongas. A ideia é transformar esse caos em dados estruturados e acessíveis.

## As paragens como um grafo

Estou a criar uma base de dados com todas as paragens de táxi da cidade, cada uma com a sua localização (latitude e longitude), o tipo de veículo que passa lá (candongueiro, wawa, rosalina, etc.) e outras informações úteis.

Essas paragens são ligadas por rotas que mostram origem, destino, distância, preço e tempo médio de viagem. Tudo isso é representado num grafo, e a API que desenvolvi permite aceder a esses dados de forma organizada, servindo de base para aplicações que queiram explorar ou visualizar essa rede.

## Um copiloto digital

Por cima disso, há um módulo de planeamento de rotas: o utilizador escolhe o ponto de partida e o destino, e o sistema mostra as rotas possíveis, quantos táxis será preciso apanhar, quanto vai gastar e qual é o caminho mais curto ou mais barato.

Assim, mesmo que seja a tua primeira vez a ir à Mutamba (ou a qualquer outro ponto da cidade), vais saber exatamente que táxis pegar e quanto custará a viagem.

## Dados reais

Tudo está a ser feito em colaboração com o pessoal da ANATA, que será essencial na recolha de dados reais das paragens, para integrar o sistema com o Google Maps.

A interface vai seguir um estilo descontraído e criativo, com um toque de desenho à mão, para tornar a experiência mais humana e próxima da realidade das ruas.

No fim, o objetivo é simples: trazer inteligência, previsibilidade e acessibilidade ao transporte informal de Luanda, e ajudar qualquer pessoa a nunca mais se perder no caminho.
