---
title: "Hostinger e configuração de um servidor de Minecraft do zero"
description: "Primeiras impressões da Hostinger e como configurar um servidor Fabric em uma VPS"
date: 2026-01-07
type: tutorial
label: Tutorial
image: images/minecraft01.png
---

## Introdução

A Hostinger facilita bastante isso. Eles te dão um domínio `.cloud` gratuitamente. Eu peguei o **audescire**, que vem de *aude scire*, que supostamente significa “ouse saber”. Não sei latim, estou confiando no Google Translate

Eles também te dão um IP fixo (pelo menos no plano que eu peguei). Com esse IP dá para fazer basicamente tudo usando subdomínios. O meu servidor de Minecraft, por exemplo, está rodando em:

```
minecraft.audescire.cloud
```

## Preparando a VPS

A máquina começa praticamente zerada. No máximo, você vai ter um editor de texto simples como o `nano`.

Antes de instalar qualquer coisa, é **muito importante atualizar o sistema**:

```bash
apt update && apt upgrade -y
```

Isso garante que:
- os pacotes estejam atualizados
- você evite erros estranhos durante instalações
- dependências antigas não quebrem o processo

Se você recebeu algum erro antes ou algo não instalou corretamente, rodar esse comando costuma resolver a maioria dos problemas.

## Instalando o Java

Para rodar Minecraft, você vai precisar de Java.  
Eu estou usando Java 21, mas **você não precisa usar exatamente a mesma versão**.

Se você escolheu uma VPS com Ubuntu:

```bash
apt install openjdk-21-jdk -y
```

Isso instala o **JDK** da OpenJDK na versão 21.

Para verificar se deu tudo certo:

```bash
java -version
```

Se aparecer a versão instalada, está tudo certo.


## Criando a pasta do servidor

Agora vamos organizar os arquivos do servidor.  
Eu gosto de usar `/opt` porque deixa as coisas mais organizadas.

```bash
cd /opt
mkdir minecraft
cd minecraft
```

Dentro dessa pasta ainda não temos nada.  


## Baixando o Fabric

Fora da VPS vá para:

```
https://fabricmc.net/use/server/
```

Escolha a versão do Minecraft que você quer usar.  
O próprio site já gera um comando pronto para você rodar no terminal.

No meu caso, eu baixei a versão **1.21.11**, então o site me indicou este comando:

```bash
curl -OJ https://meta.fabricmc.net/v2/versions/loader/1.21.11/0.18.4/1.1.1/server/jar
```

Esse comando **só baixa o arquivo `.jar`**.  
Nada mais, nada menos (eu acho).

Se algo der errado depois, vale conferir se o nome do arquivo baixado bate exatamente com o que você está tentando executar.

## Criando o script de inicialização

Vamos criar um script para iniciar o servidor.

```bash
touch start.sh
nano start.sh
```

O site, pelo menos na minha época, te indica configurar desse jeito:

```bash
java -Xmx2G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
```

Agora, destrinchando o comando:

- `-Xmx2G`  
  Define o **uso máximo de RAM**. Nesse exemplo, 2 GB.

- `fabric-server-...jar`  
  É o arquivo que você acabou de baixar.  
  Se der erro, confira se o nome está correto.

- `nogui`  
  Inicia o servidor sem interface gráfica, o que é ideal para VPS.


### A configuração que eu usei

Eu usei uma configuração um pouco diferente:

```bash
java -Xms4G -Xmx8G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
```

Aqui entra mais um detalhe importante:

- `-Xms4G`  
  Define a **memória mínima** que o servidor vai usar.

- `-Xmx8G`  
  Define a **memória máxima**.

Ou seja: estou dizendo que o servidor pode usar **entre 4 GB e 8 GB de RAM**.

Já vi muita gente usando:

```bash
-Xms8G -Xmx8G
```

Ou seja, mínimo e máximo iguais.  
Não sei dizer exatamente o ganho real disso, mas fica a seu critério.


## Dando permissão e iniciando o servidor

Agora precisamos dar permissão de execução ao script:

```bash
chmod +x start.sh
```

Se você estiver se sentindo mais caótico, pode usar:

```bash
chmod 777 start.sh
```

Execute o servidor:

```bash
./start.sh
```

Isso vai:
- iniciar o servidor
- criar todas as pastas necessárias
- gerar o arquivo `eula.txt`

## Aceitando o EULA

Abra o arquivo:

```bash
nano eula.txt
```

Procure por:

```txt
eula=false
```

Troque para:

```txt
eula=true
```

Salve com:
- `Ctrl + X`
- `Enter`
- `Enter`


Se essa for sua primeira vez usando um editor no terminal, pode parecer estranho.  
Relaxa. Let it rip, lembre de ousar e logo vai se tornar automático.

Depois disso, você já tem **um servidor funcional**.

## Configurações extras

Algumas coisas que você pode querer fazer depois:

### Permitir jogadores piratas
Edite o arquivo `server.properties` e altere:

```txt
online-mode=false
```

### Instalar mods Fabric
Essa instalação funciona da mesma forma para todos os mods:
- baixe o mod
- coloque na pasta `mods/`
- reinicie o servidor


## Configurando o domínio na Hostinger

Se você comprou hospedagem da Hostinger, o domínio `.cloud` vem de graça e é bem simples de usar.

No painel da Hostinger:
1. Página inicial
2. **Domínios**
3. **Meus domínios**
4. **Gerenciar**
5. **DNS / Nameservers**
6. **Gerenciar registros DNS**

Vamos criar um registro do tipo **A**:

```txt
Tipo: A
Nome: minecraft
Aponta para: IP da sua VPS
TTL: 14400
```

Algumas observações:
- `A` vem de *Address*
- `Aponta` é o mesmo ip que aparece na sua vps
- `TTL` tempo de vida do seu dns em cache. Deixe o padrão
- `Nome` é como vai ficar o seu subdomínio

No meu caso, ficou:

```
minecraft.audescire.cloud
```

Você pode escolher outro nome sem ser minecfrat.

Depois de salvar, em poucos minutos você já consegue se conectar usando o domínio.

