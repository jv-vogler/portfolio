---
title: "Como configurar o Claude Code para qualquer linguagem"
description: "Um guia curto para dar ao Claude Code o que ele precisa — LSPs, MCPs, language skills, auto mode — para que ele consiga se autocorrigir."
publishedDate: "2026-04-21"
status: "published"
tags: [claude-code, tooling, ai, lsp, developer-experience]
featured: true
---

Trabalho principalmente com TypeScript e GDScript, mas ultimamente o Claude Code tem me puxado para territórios novos — Elixir e Rust, linguagens que eu nunca tinha tocado. Esse post é sobre o que precisei adicionar para fazer funcionar de verdade.

## O caso fácil: TypeScript

Se você usa Claude Code num projeto TypeScript, provavelmente já teve essa experiência: pede pra implementar alguma coisa, ele escreve o código, roda `pnpm typecheck`, vê três erros, corrige, roda de novo e entrega algo verde. Você mal precisou prestar atenção.

Isso funciona porque TypeScript vem com um compilador que produz feedback rápido e estruturado, e todo projeto TS do mundo tem um script de typecheck. O Claude não precisa adivinhar se `foo` é uma `string` ou uma `Promise`; ele roda o check, lê o output e se autocorrige.

Tire isso e a história muda.

## Loops de feedback, ou: o que é um "harness" de verdade

Um harness é tudo ao redor do modelo que permite que ele veja se o próprio código está certo. O typecheck acima é um. Um linter é outro. Também é um compilador com mensagens de erro úteis, ou um browser que o Claude consegue abrir e ler o console.

Sem harness, sem autocorreção. O Claude escreve algo que parece plausível, você diz "legal", e três horas depois descobre que ele importou uma função que não existe. Com um bom harness? O Claude pega no mesmo turno, corrige, e segue em frente.

O jogo todo de configurar o Claude Code para uma linguagem desconhecida é: dar a ele um loop de feedback pelo menos tão bom quanto `pnpm typecheck`. De preferência melhor.

Se quiser a explicação completa sobre essa ideia, o blog do Martin Fowler tem [um ótimo texto sobre harness engineering](https://martinfowler.com/articles/harness-engineering.html) que vai muito além do que vou cobrir aqui.

## O que é um LSP, e como dar um pro Claude

**Explicação chata:** O Language Server Protocol é uma spec (criada originalmente pelo VS Code) que define como editores conversam com o "cérebro" de uma linguagem de forma padronizada. O cérebro (o language server) é o que faz o parsing do código, resolve tipos, encontra referências e reporta erros. O LSP em si é só o protocolo que eles usam pra conversar. O editor pergunta, o servidor responde.

**Explicação real:** aquelas linhas vermelhas no VS Code? Seu editor perguntou pro language server "tem algum problema nesse arquivo?" via LSP, e o servidor devolveu uma lista de intervalos e mensagens. Tooltips de hover, ir para definição, autocomplete — mesma estrutura. O editor exibe; o servidor faz o trabalho.

**Explicação gamer:** é o Scan do FFIX. Você mira em algo específico e o jogo te mostra HP, fraquezas e o que o inimigo carrega. Não revela a batalha inteira (você precisa escolher quem scanear), mas quando scanneia, tem um readout de verdade em vez de ficar chutando o que funciona.

Por baixo dos panos, o language server é um programa real rodando na sua máquina: `rust-analyzer`, `elixir-ls`, `gopls`, o que for da linguagem. Seu editor o inicia como subprocesso e troca mensagens JSON-RPC com ele via stdin/stdout. (O protocolo também suporta TCP sockets pra setups remotos, mas stdio é o padrão — e o que o Claude Code usa.) Cada hover, cada sublinhado, cada "ir para definição" é um JSON de entrada, um JSON de saída.

Aponte o Claude para o mesmo language server que você usa e ele terá acesso às mesmas informações. Não é que ele esteja "vendo" sua tela — ele está fazendo as mesmas perguntas pro servidor que seu editor faz ("qual é o tipo desse argumento?", "essa função existe?", "onde isso está definido?"). Isso não é a mesma coisa que ter sua experiência de editor de graça: só ajuda se o servidor for preciso, a integração consultar nos momentos certos, e o modelo usar as respostas que recebe. Quando esses três se alinham, os erros de adivinhação caem muito.

O plugin cuida da parte de subprocesso, mas você ainda precisa ter o binário do servidor instalado na máquina (via `rustup`, `mix`, `brew`, ou o que empacotar isso pra sua linguagem).

Dependendo da ferramenta de LSP, talvez seja necessário adicionar:

```json
  "env": {
    "ENABLE_LSP_TOOL": true
  },
```

ao seu `~/.claude/settings.json`.

## Três stacks, mesmo padrão

### Godot

Conheço bem Godot e GDScript, mas infelizmente por ser uma linguagem dinâmica, não temos um equivalente ao `pnpm typecheck` pra entregar pro Claude. GDScript compila enquanto o jogo roda — o sinal de "isso funciona" vive basicamente dentro do editor.

A solução foram dois plugins. Um servidor MCP do Godot (pra que o Claude consulte a scene tree, inspecione tipos de nó, rode o jogo, leia stdout) mais um cliente LSP de GDScript (erros em tempo real, hovers, ir para definição). Estes são os plugins que usei:

```bash
claude plugin marketplace add minami110/claude-godot-tools
```

```bash
claude plugin install gdscript-toolkit@claude-godot-tools
claude plugin install gdscript-lsp@claude-godot-tools
claude plugin install vscode-gdscript-tools@claude-godot-tools
claude plugin install gdunit4-toolkit@claude-godot-tools
```

```bash
claude mcp add godot -- npx @coding-solo/godot-mcp
```

Referências:

- [https://github.com/minami110/claude-godot-tools/tree/main](https://github.com/minami110/claude-godot-tools/tree/main)
- [https://github.com/Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp)

Com os dois instalados (mais extras para VSCode e GDUnit, um framework de testes), o Claude parou de inventar nomes de nó. Ele lê a scene tree, vê que `Player` tem um filho `HealthBar` do tipo `ProgressBar`, e chama corretamente na primeira vez. Meus prompts foram de "aqui está a estrutura da cena, o player está em `/root/Main/Player`, ele tem um signal chamado…" para "adiciona um flash de dano quando a vida cair."

### Elixir

Entrei recentemente num codebase _secreto_ de Elixir no trabalho — minha primeira vez tocando na linguagem. "Isso compila" é uma barra perigosamente baixa em Elixir — código idiomático é uma habilidade à parte: quando usar `GenServer` vs `Task.async`, por que `:float` é uma bomba em colunas de dinheiro, se seu job do Oban é idempotente. Nada disso aparece como erro de compilação.

Duas coisas ajudaram:

1. **`elixir-ls-lsp@claude-plugins-official`** para o LSP. Mesma história do Godot: tipos reais, diagnósticos reais, respostas reais de "essa função realmente existe". Sem mais o Claude inventando módulos.
2. **`oliver-kriska/claude-elixir-phoenix`**, um conjunto de skills e agentes especialistas em Elixir/Phoenix. Ele codifica os bugs que devs Elixir encontram em produção: `assign_new` que pula silenciosamente na reconexão, queries N+1 no Ecto, jobs Oban não-idempotentes. O tipo de review que eu não consigo dar.

```bash
claude plugin marketplace add oliver-kriska/claude-elixir-phoenix
```

```bash
claude plugin install elixir-phoenix
```

```bash
claude plugin install elixir-ls-lsp@claude-plugins-official
```

Referências:

- [https://github.com/oliver-kriska/claude-elixir-phoenix](https://github.com/oliver-kriska/claude-elixir-phoenix)
- [https://github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

Juntos, o harness agora faz o que eu faria se soubesse Elixir.

### Rust

Rust é a outra linguagem que mal conheço. Eu queria uma CLI para alternar entre minhas contas do Claude Code que permitisse retomar as mesmas sessões entre contas diferentes sem precisar copiar arquivos JSON na mão, então construí uma: [`claude-account-switcher` ou `ccsw`](https://crates.io/crates/ccsw), agora no crates.io — dá uma olhada se isso te interessa. E aqui está o [repositório](https://github.com/jv-vogler/ccsw).

O harness teve o mesmo formato do Elixir:

- **`rust-analyzer-lsp`** para diagnósticos em tempo real, tipos e erros do borrow-checker. O Claude recebe os mesmos sublinhados que eu receberia no VS Code — exceto que ele realmente os lê.
- **`rust-skills@rust-skills`** para checagens de idioma e as armadilhas clássicas do Rust. Mesmo espírito do plugin do Elixir: opiniões que eu ainda não tenho.

```bash
claude plugin install rust-analyzer-lsp@claude-plugins-official
```

```bash
claude plugin marketplace add actionbook/rust-skills
```

```bash
claude plugin install rust-skills@rust-skills
```

Referências:

- [https://github.com/actionbook/rust-skills](https://github.com/actionbook/rust-skills)

O compilador do Rust já é famoso pelo bom feedback. O LSP por cima apertou o loop de "escreve → `cargo check` → lê erros → corrige" para "escreve → sabe que está errado antes de terminar de escrever". Menos voltas, e uma crate publicada que eu não teria conseguido revisar linha por linha.

## O browser também conta

Nem todo feedback vive no compilador — parte vive no browser. Se o botão é clicável, se o console está gritando, se o layout quebra quando dados reais chegam: `chrome-devtools-mcp@chrome-devtools-plugins` é o que deixo aberto em qualquer trabalho de frontend. O Claude consegue abrir uma página, clicar, ler o console, inspecionar elementos, rodar uma auditoria do Lighthouse. É como o harness alcança além do código e chega no app em execução. Se você está entregando UI, esse não é opcional.

## Auto mode: agora você pode ir tomar um café de verdade

Com um bom harness, o gargalo muda. O Claude consegue se autocorrigir, mas você ainda fica clicando em "aprovar" em cada escrita de arquivo e cada comando bash. Esse ritmo faz sentido quando o harness é fraco e você quer um humano no loop. É fricção desperdiçada quando o próprio harness está dizendo ao Claude "não, isso não compila" cem vezes por sessão.

O auto mode é o meio-termo do Claude Code entre aprovação manual e `--dangerously-skip-permissions`. Um classificador inspeciona cada ação antes de rodar, deixa as seguras passarem e bloqueia ou redireciona as arriscadas. Rode `claude --enable-auto-mode`, alterne com Shift+Tab, e vá buscar aquele café.

Não é uma bala de prata. O classificador pode deixar coisas arriscadas passarem quando seu ambiente dá sinais ambíguos, e você ainda não deve apontá-lo para servidores de produção. Mas combinado com um setup adequado de LSP + MCP + skills, é a primeira vez que consegui passar um ticket pro Claude e voltar vinte minutos depois pra revisar o diff — não as aprovações.

## Conclusão

Em TypeScript, você nunca precisou construir o harness — alguém já fez isso e chamou de `tsconfig.json` (embora também valha ter o `typescript-lsp` conectado). Em todo o resto, esse é o seu trabalho. Faça uma vez por repositório, e o Claude para de errar nas linguagens que você não domina.

Espero que isso deixe seu desenvolvimento muito mais tranquilo com engenharia agêntica. Até mais!

## Referências

- [https://github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [https://github.com/minami110/claude-godot-tools/tree/main](https://github.com/minami110/claude-godot-tools/tree/main)
- [https://github.com/Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp)
- [https://github.com/oliver-kriska/claude-elixir-phoenix](https://github.com/oliver-kriska/claude-elixir-phoenix)
- [https://github.com/actionbook/rust-skills](https://github.com/actionbook/rust-skills)
- [https://github.com/anthropics/claude-code/issues/18125#issuecomment-3843601648](https://github.com/anthropics/claude-code/issues/18125#issuecomment-3843601648)
- [https://martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html)
