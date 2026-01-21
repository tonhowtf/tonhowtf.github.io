---
title: "Node.js"
description: "Introdução ao Node. Historia e alguns conceitos"
date: 2026-01-20
type: bobajada
label: Bobajada
image: images/Nekoo.jpg
---

## Node.js

Node.js é uma plataforma que permite executar JavaScript fora do navegador. Originalmente o JavaScript foi criado para rodar apenas no browser, mas lá para 2008 o Google lançou o V8, um motor JavaScript OpenSource. Em 2009, Ryan Dahl utilizou o V8 para criar o Node.js, possibilitando assim que o JavaScript fosse executado no servidor.

## Call Stack

A Call Stack é uma estrutura de dados que controla a ordem de execução das funções no JavaScript. Sempre que uma função é chamada, ela é adicionada na Call Stack. Quando termina sua execução, ela é removida. A Call Stack é um LIFO (Last In, First Out). O último que entra é o primeiro a sair.

### Exemplo de código

```javascript
function buga() {
  return "buga";
}

function bugaBuga(cycles) {
  return buga().repeat(cycles);
}

function printBuga(message) {
  const result = message + " " + bugaBuga(3);
  console.log(result);
}

printBuga("Morcego");
```

## Como o JavaScript executa?

**Hoisting**

Antes de executar qualquer código, o JavaScript "iça" (hoisting) todas as declarações de funções para o topo do escopo. 

1. `buga()` é declarada e armazenada na memória
2. `bugaBuga()` é declarada e armazenada na memória
3. `printBuga()` é declarada e armazenada na memória

**Execução**

Após o hoisting, o JavaScript executa o código de cima para baixo:

### Ordem na Call Stack

1. `printBuga("Morcego")` entra na stack
2. Dentro de printBuga, `bugaBuga(3)` é chamado e entra na stack
3. Dentro de bugaBuga, `buga()` é chamado e entra na stack
4. `buga()` retorna "buga" e **sai da stack**
5. `bugaBuga(3)` completa (retorna "bugabugabuga") e **sai da stack**
6. `printBuga()` executa o console.log e completa, então **sai da stack**

**Resultando em**

 `Morcego bugabugabuga`

## Single Thread

O Node.js é **single-threaded**, ou seja, possui apenas uma Call Stack. Isso significa que ele só pode executar uma tarefa por vez na thread principal.

### Mas então, como o JavaScript consegue executar código assíncrono?

## libuv

A **libuv** é uma biblioteca em C que implementa o **Thread Pool** e o **Event Loop** no Node.js. Ela é responsável por delegar operações assíncronas, permitindo que o JavaScript continue executando sem travar.

```javascript
const fs = require('fs');

console.log("start")

fs.readFile('./test.txt', 'utf-8', function callback(_, data) {
    console.log(data);
});

console.log("end")
```

## Como o Node.js lida com operações bloqueantes?

O `fs.readFile()` é uma operação **bloqueante** ela leva tempo para ser executada. Se não tivéssemos a libuv, nosso programa ficaria **travado** esperando a leitura terminar antes de continuar a execução.

### Mas então, como o Node.js resolve isso?

1. **Thread Pool** 
   1. `fs.readFile()` é removido da Call Stack
   2. A libuv delega a tarefa para uma thread do Thread Pool
   3. A Call Stack fica livre para continuar executando outras tarefas

2. **Processamento em background**
   1. Enquanto a Call Stack continua executando o código, a thread do Thread Pool trabalha lendo o arquivo
   2. Quando a leitura termina, a função já processada com todo o texto vai para a **Callback Queue**
3. **Callback Queue**
   1. Ele fica na fila esperando o Event Loop
4. **Event Loop**
   1. O **Event Loop** monitora a Callback Queue e a Call Stack
   2. Quando detecta que a Call Stack fica vazia, ele pega o primeiro callback da fila, se tiver.
   3. O callback é movido para a Call Stack e finalmente executado



