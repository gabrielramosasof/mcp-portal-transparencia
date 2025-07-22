# Manual de Implantação de Servidores MCP no Smithery AI

Este manual detalha o processo de implantação de um servidor Model Context Protocol (MCP) no Smithery AI, uma plataforma que atua como um registro e sistema de gerenciamento para esses servidores, facilitando a interação entre agentes de IA e suas ferramentas.

## 1. Introdução ao Smithery AI e Servidores MCP

O Smithery AI é uma plataforma que permite que desenvolvedores listem, implantem e hospedem seus servidores MCP. Um servidor MCP é uma aplicação que expõe um conjunto de ferramentas ou funcionalidades que podem ser consumidas por modelos de linguagem grandes (LLMs) ou outros agentes de IA. Ao implantar seu servidor no Smithery AI, você o torna detectável e acessível para outros usuários e sistemas.

## 2. Pré-requisitos

Antes de iniciar a implantação, certifique-se de ter o seguinte:

*   **Um Servidor MCP:** Você deve ter uma aplicação de servidor MCP existente que deseja implantar. Este servidor deve estar configurado para expor suas ferramentas e funcionalidades de acordo com o protocolo MCP.
*   **Repositório GitHub:** Seu código-fonte do servidor MCP deve estar hospedado em um repositório GitHub público ou privado (com as permissões adequadas).
*   **Conta Smithery AI:** Uma conta ativa no Smithery AI.
*   **Node.js e npm (Opcional, para `npm create smithery`):** Se você planeja usar a ferramenta `npm create smithery` para criar e implantar seu servidor, certifique-se de ter o Node.js e o npm instalados em sua máquina local.

## 3. Métodos de Implantação

Existem duas abordagens principais para implantar seu servidor MCP no Smithery AI:

### 3.1. Implantação via Repositório GitHub

Este é o método recomendado para servidores MCP existentes. O Smithery AI pode se integrar diretamente ao seu repositório GitHub para implantar e gerenciar seu servidor.

1.  **Prepare seu Repositório:**
    *   Certifique-se de que seu repositório GitHub contenha todo o código-fonte necessário para o seu servidor MCP.
    *   Inclua um `package.json` (para projetos Node.js) ou um arquivo de configuração equivalente que defina as dependências e os scripts de inicialização do seu servidor.
    *   Considere adicionar um arquivo `Procfile` se seu servidor precisar de um comando de inicialização específico para ambientes de nuvem.

2.  **Conecte seu Repositório ao Smithery AI:**
    *   Faça login na sua conta Smithery AI.
    *   Navegue até a seção de "Deployments" ou "Servers".
    *   Siga as instruções para conectar seu repositório GitHub. Você precisará autorizar o Smithery AI a acessar seus repositórios.

3.  **Configure a Implantação:**
    *   Selecione o repositório e a branch que contêm o código do seu servidor MCP.
    *   O Smithery AI tentará detectar automaticamente o tipo de aplicação e os comandos de build/inicialização. Revise e ajuste essas configurações conforme necessário.
    *   Defina quaisquer variáveis de ambiente que seu servidor possa exigir.

4.  **Inicie a Implantação:**
    *   Após configurar, inicie o processo de implantação. O Smithery AI clonará seu repositório, instalará as dependências, construirá seu aplicativo (se necessário) e o iniciará.
    *   Monitore os logs de implantação para garantir que não haja erros.

### 3.2. Criação e Implantação com `npm create smithery`

Esta ferramenta é ideal para iniciar um novo servidor MCP do zero ou para prototipagem rápida.

1.  **Instale o Node.js e npm:** Se ainda não o fez, instale o Node.js, que inclui o npm.

2.  **Crie um Novo Projeto MCP:**
    *   Abra seu terminal e execute o seguinte comando:
        ```bash
        npm create smithery
        ```
    *   Siga as instruções interativas para configurar seu novo projeto MCP. Isso pode incluir a escolha de um template, nome do projeto e outras configurações.

3.  **Desenvolva seu Servidor MCP:**
    *   Navegue até o diretório do projeto recém-criado.
    *   Implemente a lógica do seu servidor MCP, adicionando as ferramentas e funcionalidades desejadas.

4.  **Implante no Smithery AI:**
    *   A ferramenta `npm create smithery` pode oferecer opções para implantação direta no Smithery AI ou para configurar um repositório GitHub que você pode então conectar ao Smithery AI (conforme descrito na Seção 3.1).
    *   Siga as instruções fornecidas pela ferramenta para concluir a implantação.

## 4. Registro do seu Servidor MCP

Após a implantação bem-sucedida, seu servidor MCP precisa ser registrado no registro do Smithery AI para ser detectável. Geralmente, isso acontece automaticamente como parte do processo de implantação se você usou os métodos integrados do Smithery AI. No entanto, você pode verificar e gerenciar o registro através do painel do Smithery AI.

*   **Verifique o Status:** No painel do Smithery AI, procure a lista de seus servidores implantados. O status de registro deve ser indicado lá.
*   **API do Registro:** Para integração programática, o Smithery AI oferece uma API de registro que permite pesquisar e interagir com servidores MCP listados.

## 5. Gerenciamento do seu Servidor MCP

O Smithery AI oferece ferramentas para gerenciar seus servidores implantados:

*   **Logs:** Acesse logs em tempo real para depurar e monitorar o desempenho do seu servidor.
*   **Métricas:** Visualize métricas de uso e desempenho.
*   **Reimplantação:** Acione reimplantações manuais ou configure implantações automáticas a partir de alterações no seu repositório GitHub.
*   **Variáveis de Ambiente:** Gerencie as variáveis de ambiente do seu servidor.
*   **Domínios Personalizados:** Configure domínios personalizados para seu servidor MCP, se aplicável.

---

**Nota Importante sobre o Fluxo de Trabalho:**

Lembre-se que, para todas as futuras alterações neste projeto, você deve criar uma nova branch e um Pull Request (PR) para a branch principal. Certifique-se de que a descrição do PR inclua a tag `@CodeRabbit` para orientação da base de código.