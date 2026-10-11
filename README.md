# 📦 Almoxarifado Digital

> Controle de almoxarifado de obra e elétrica direto pelo celular, sem papel, sem servidor e sem custo de licença.

Desenvolvido para o almoxarifado da **SINALVIDA**, usando **Google Planilhas + Google Apps Script**.

## 🧩 O problema

No almoxarifado, cada retirada e cada entrada de material (cimento, areia, alicate, talabarte, cabos…) era anotada **à mão, em folhas de papel**. Isso trazia vários problemas:

- **Muito papel gasto** todo mês;
- **Difícil saber com quem estava cada ferramenta** e há quanto tempo;
- **Estoque desatualizado**: só dava para saber o que tinha procurando nas folhas;
- **Vários pedidos ao mesmo tempo** causavam confusão e anotações erradas;
- Montar um **relatório do mês** levava horas.

## 💡 A solução

Um **aplicativo web que abre no celular** (pode ser salvo na tela inicial, como se fosse um app) e grava tudo numa **planilha do Google**, que serve de banco de dados.

- O funcionário retira o material **assinando com o dedo na tela**;
- O **estoque é atualizado na hora**;
- Ferramentas e máquinas ficam registradas **com quem está e há quantos dias**;
- Os relatórios saem prontos em **PDF ou planilha** em poucos cliques.

Tudo roda na conta Google da empresa: **não precisa de servidor, hospedagem nem mensalidade**.

---

## ✨ Funções principais

### Movimentação
- 📤 **Retirada** de vários itens de uma vez, com **assinatura digital** na tela
- ↩️ **Devolução** de ferramentas e máquinas, com filtro por data, obra e atrasadas
- 📥 **Adicionar ao estoque** (entrada de material)
- 📋 **Fila de pedidos**: o pedido é feito antes e o almoxarife separa e entrega
- ⚠️ Permite retirar **mesmo sem saldo no sistema** (o estoque fica negativo e o app avisa)
- 📏 Quantidades com **vírgula para itens em metro** (ex.: 2,5 m de cabo)

### Estoque
- Abas separadas para **Itens Obra** e **Itens Elétrica**
- Listas padronizadas de **tipo** (Material, Ferramenta, EPI, Máquinas, Cabo, Disjuntores…) e de **unidade de medida**
- **Cadastrar, editar (nome/tipo), ajustar quantidade e excluir** itens
- Alerta de **estoque mínimo**
- 🏷️ **Etiquetas com QR Code** para as ferramentas, com leitura pela câmera do celular

### Equipe e acesso
- 🔐 **Login com e-mail e senha** + **PIN pessoal** para quem pode fazer alterações
- Quem não tem PIN fica em **modo consulta** (pode ver e fazer pedidos)
- Cadastro de funcionários com **tipo de contrato** (CLT, PJ, Jovem Aprendiz)
- Ficha de cada colaborador com as **ferramentas em posse**

### Relatórios
- 🏢 **Empregador**: resumo do período + estoque completo (ID, nome, tipo, quantidade, mínimo e unidade)
- 👷 **Colaborador**: retiradas, devoluções e ferramentas em posse de cada pessoa
- Por **mês de referência** (ex.: 08/2026) ou **período** (ex.: 01/08/2026 a 31/08/2026)
- Exportação em **PDF** e em **planilha** (Google Planilhas ou Excel)
- 📧 **E-mails automáticos**: aviso diário de ferramentas atrasadas e resumo semanal

### Segurança e organização
- Movimentações separadas em **uma aba por mês** (Setembro 2026, Outubro 2026…)
- **Histórico completo** com estorno e exclusão de lançamentos (o estoque é corrigido automaticamente)
- 🧪 **Modo teste**: marca os lançamentos de teste para apagar tudo de uma vez depois
- Controle de **concorrência** (várias pessoas usando ao mesmo tempo sem bagunçar o estoque)
- **Modo claro e escuro**

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Banco de dados | Google Planilhas |
| Back-end | Google Apps Script (JavaScript V8) |
| Front-end | HTML, CSS e JavaScript puro (sem frameworks) |
| Arquivos | Google Drive (assinaturas e relatórios em PDF) |
| E-mail | MailApp (Apps Script) |
| QR Code | [qrcodejs](https://github.com/davidshimjs/qrcodejs) e [jsQR](https://github.com/cozmo/jsQR) |

---

## 🚀 Como instalar

> Leva uns 10 minutos. Você só precisa de uma conta Google.

1. **Crie uma planilha nova** no [Google Planilhas](https://sheets.google.com).
2. Vá em **Extensões → Apps Script**.
3. No arquivo `Código.gs`, apague o conteúdo e cole o conteúdo de [`Codigo.gs`](Codigo.gs).
4. Clique em **+ → HTML**, crie um arquivo chamado **`Index`** (exatamente assim) e cole o conteúdo de [`Index.html`](Index.html).
5. Em **⚙️ Configurações do projeto**, deixe o fuso horário em **(GMT-03:00) São Paulo**.
6. Salve, escolha a função **`configurar`** no menu de cima e clique em **▷ Executar**.
   Autorize o acesso quando o Google pedir (**Avançado → Acessar → Permitir**).
   Isso cria todas as abas da planilha.
7. Clique em **Implantar → Nova implantação → ⚙️ → App da Web**:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
8. Copie o link gerado e abra no celular. Para usar como app, toque em **⋮ → Adicionar à tela inicial** (Android) ou **Compartilhar → Adicionar à Tela de Início** (iPhone).

### Primeiro acesso

1. Abra o app e **crie sua conta**.
2. Na aba **Usuarios** da planilha, mude **"Pode editar?"** para **Sim**. O PIN é gerado automaticamente.
3. Na aba **Config**, preencha o e-mail para alertas e os nomes das obras.
4. Cadastre os itens nas abas **Itens Obra** e **Itens Elétrica** e os funcionários na aba **Funcionarios**.

### Atualizar o código

Depois de alterar os arquivos, vá em **Implantar → Gerenciar implantações → ✏️ → Nova versão → Implantar**. O link continua o mesmo.

---

## 📁 Estrutura

```
├── Codigo.gs     # Back-end: regras de negócio, planilha, login, relatórios, e-mails
├── Index.html    # Front-end: todas as telas do app (HTML + CSS + JS)
└── imagens/      # Prints usados neste README
```

Abas criadas na planilha:

| Aba | Para que serve |
|---|---|
| `Itens Obra` / `Itens Elétrica` | Cadastro e estoque dos itens |
| `Setembro 2026`, `Outubro 2026`… | Movimentações de cada mês |
| `Funcionarios` | Equipe, função e tipo de contrato |
| `Pedidos` | Fila de pedidos |
| `Usuarios` | Contas de acesso e PINs |
| `Config` | E-mails, obras, assinatura obrigatória, modo teste |

---

## 👤 Autor

**Seu Nome**
[LinkedIn](https://www.linkedin.com/in/seu-perfil) · [GitHub](https://github.com/seu-usuario)
