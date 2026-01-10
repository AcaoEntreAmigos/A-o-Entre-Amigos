# Ação Entre Amigos

Sistema web para gerenciamento de participantes e envio de convites para a Ação Entre Amigos.

## Estrutura do Projeto

- `index.html` – Tela inicial com regras e login
- `dashboard.html` – Painel do ADM ou usuário
- `cadastro_convidado.html` – Tela para cadastrar novos participantes
- `modulo_convite.html` – Tela de envio de convites
- `app.js` – Script principal com toda a lógica do sistema
- `style.css` – Estilos do sistema

## Funcionalidades

- Cadastro de participantes com geração de código único e senha
- Registro de PIX (CPF, celular, email ou chave aleatória)
- Listas de participantes organizadas por 5 em 5
- Envio de convites via WhatsApp
- Visualização de convites enviados e listas geradas
- Reset do sistema via LocalStorage

## Como colocar no GitHub Pages

1. Crie um repositório no GitHub.
2. Faça upload de todos os arquivos do projeto.
3. Vá em **Settings → Pages → Source → main branch / root folder**.
4. Salve → GitHub vai gerar um link público:  
   `https://seuusuario.github.io/seurepositorio/`
5. Abra o link no navegador e teste todas as funcionalidades.

> ⚠️ O sistema utiliza **LocalStorage**, portanto os dados são armazenados no navegador. Cada navegador ou modo anônimo terá armazenamento separado.

## Navegadores testados

- Chrome ✅
- Edge ✅
- Internet Explorer ✅
- Firefox ⚠️ (pode precisar limpar cache / LocalStorage)
- Safari ✅
- Android (Chrome / Firefox) ✅
