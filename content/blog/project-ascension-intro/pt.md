---
title: "Final Fantasy Tactics encontra Slay the Spire: construindo um roguelite deckbuilder tático"
description: "Uma introdução ao jogo que estou construindo, um roguelite deckbuilder tático em hexágonos. Cobrindo o design, a arquitetura e alguns sistemas-chave."
publishedDate: "2026-04-18"
status: "draft"
tags: [project-ascension, series-intro, design, arch, ai]
featured: true
series: "project-ascension"
series_number: 0
---

Ei, galera! Feliz em estar aqui compartilhando o meu primeiro post sobre o primeiro jogo de verdade que estou construindo. O meu objetivo é escrever sobre game dev, design e arquitetura, porque a maior parte do que encontro sobre código de jogo de verdade é raso. Tutoriais sempre criam sistemas isolados e nunca chegam nos problemas reais de uma codebase complexa. Enfim, ainda não escolhi um nome para o jogo, então tenho chamado de "Project Ascension" (pelo menos em 19 de abril de 2026).

O jogo é um roguelite deckbuilder tático em hexágonos. Final Fantasy Tactics encontra Slay the Spire: você posiciona unidades em uma grade hexagonal, cada unidade contribui cartas para o deck compartilhado do seu lado, e você gasta pontos de ação (pense em mana) para jogar essas cartas contra o inimigo. Unidades e cartas ficam acopladas. Perde uma unidade, perde as cartas dela pelo resto do combate. A única coisa com que estou realmente satisfeito é o sistema de "mana". Está ficando muito bom.

Três pilares de design filtram cada decisão de feature:

- **Unidades importam** — unidades mortas param de comprar suas cartas no meio do combate; ressuscite-as e as cartas voltam.
- **Estratégia compensa** — posicionamento, sequenciamento de cartas e combos de sinergia vencem a força bruta.
- **Jogadas criativas são recompensadoras** — efeitos condicionais, magias com múltiplos alvos, terreno e deslocamento abrem espaço para expressividade.

## Por que Godot

Estou usando Godot 4. Já me sinto confortável com ela, e GDScript é simples o suficiente para aprender. O editor torna o conteúdo data-driven rápido de iterar: efeitos de cartas, templates de unidades e definições de status vivem todos como arquivos `.tres`, configuráveis no Inspector sem tocar em uma linha de código.

Também tenho experimentado com desenvolvimento assistido por IA. O servidor MCP do Godot dá ao Claude Code poder de interagir com o editor em execução, e o language server alimenta ele com informação de tipagem real ao invés de chutes. Esse fluxo merece um post próprio sobre ferramentas de IA.

## Como funciona uma partida

**Unidades** são a entidade central. Cada uma carrega HP (morre quando zerado), MP (pontos de movimento por turno), AP (pontos de ação, gastos para jogar cartas), Block (um buffer de dano que persiste entre turnos, limitado a dez), mais valores base de Ataque e Defesa que alimentam efeitos de escalonamento. Unidades também têm **Passivos** (efeitos permanentes aplicados uma vez no deployment e mantidos por toda a batalha) e acumulam **Status** (condições temporárias como dano ao longo do tempo, controle de grupo, buffs ou reações acionadas).

Você adquire unidades como **Packs**: uma unidade junto com suas cartas. O que um pack traz reflete a identidade da unidade. Seu **Time** são as unidades que você pode deployar mas ainda não posicionou no tabuleiro.

O tabuleiro é uma grade hexagonal com ocupação estrita de uma unidade por hex e unidades se movem gastando MP. **Deslocamento** (empurrar, puxar, trocar) é uma mecânica separada; ignora MP e se acumula em cima do movimento. Hexs de terreno aplicam efeitos ao entrar ou os ticam ao longo do tempo.

As cartas vêm de um **deck compartilhado**: um por lado, não um por unidade. Cada carta tem requisitos opcionais: uma unidade específica, uma raça ou uma classe. Quando uma unidade morre, qualquer carta que a requeria evapora de todas as pilhas (compra, mão, descarte) e para de ser comprada pelo resto do combate. Ressurreição reverte isso: se uma unidade qualificada voltar viva, suas cartas ficam elegíveis para compra novamente. Cartas sem requisitos nunca evaporam. O objetivo é evitar compras mortas: o problema ao estilo MTG de puxar uma carta que nada no tabuleiro consegue jogar.

AP funciona em um pool de dois níveis: cada unidade tem seu próprio AP (consumido primeiro), depois um pool compartilhado. Cartas nunca custam MP; movimento nunca custa AP. A cada turno, você descarta e compra sua mão completa; nada passa. **Sinergias** ativam quando múltiplas unidades deployadas compartilham raça ou classe, e ambos os lados podem observar e raciocinar sobre elas.

## Como eu dividi

Agora para a arquitetura. Vou me aprofundar em sistemas específicos em posts futuros porque há alguns dos quais estou muito orgulhoso, mas aqui está a visão geral. O codebase se divide em camadas com responsabilidades distintas:

- **Managers** possuem estado autoritativo: `DeckManager`, `APManager`, `HexBoardManager`, `StatusManager`, `TurnManager`.
- **Resolvers** lidam com lógica sem possuir estado: `EffectResolver`, `TargetResolver`, `StepResolver`.
- **Orchestrators** sequenciam operações: `ActionRunner`, `ActionFactory`, `CombatOrchestrator`.
- **Trackers** agregam informações derivadas: `SynergyTracker`, `StatusTracker`.
- **Entities** são scene nodes: `Unit`, `Projectile`, componentes visuais.
- **Data** vive em subclasses de Resource: arquivos `.tres` criados no Inspector e injetados em runtime.

Uma distinção que me importa: **módulos puros** versus **glue code**. Alguns sistemas são deliberadamente ignorantes do jogo; não sabem o que é uma unidade, o que é uma carta, o que é evaporação, e poderiam ser publicados como uma biblioteca standalone. O glue code conecta esses módulos a conceitos específicos do jogo, e é onde todo o coupling vive. Um lugar, ao invés de espalhado pelo codebase.

Os três sistemas abaixo estão todos no lado dos módulos puros.

## Stats, máquinas de estado e efeitos

### Stats

`Stat` é um value object: um valor base mais uma lista de modificadores aplicados. Modificadores vêm em quatro tipos:

```gdscript
# godot_modules/stats/stat_modifier.gd
enum Type { FLAT, PERCENT_ADD, PERCENT_MULT, OVERRIDE }
```

Ao recalcular, eles se aplicam em ordem: adições flat primeiro, depois bônus percentuais aditivos, depois bônus percentuais multiplicativos, depois qualquer override (maior prioridade vence).

```gdscript
# godot_modules/stats/stat.gd (abbreviated)
func _calculate_modified_value() -> void:
    var flat_total: int = 0
    var percent_add_total: float = 0.0
    var percent_mult_total: float = 1.0
    var override_value: Variant = null

    for modifier in _modifiers:
        match modifier.type:
            StatModifier.Type.FLAT:
                flat_total += modifier.value
            StatModifier.Type.PERCENT_ADD:
                percent_add_total += modifier.value / 100.0
            StatModifier.Type.PERCENT_MULT:
                percent_mult_total *= (1.0 + modifier.value / 100.0)
            StatModifier.Type.OVERRIDE:
                if modifier.priority > highest_override_priority:
                    override_value = int(modifier.value)
    # ...
```

`ResourceStat` estende `Stat` com um `current_value` que rastreia consumo separadamente do cap. HP, MP, AP e Block são instâncias de `ResourceStat`: cada uma tem um máximo e um valor restante, e emite `depleted` quando o atual chega a zero.

Nenhuma das classes sabe o que é uma unidade. `UnitCombatState` possui as instâncias de stat e as conecta à lógica do jogo. Esse é o trabalho da camada de glue.

### Máquina de estado

O contrato é simples: um `State` retorna um novo `State` de `input()`, `process()` ou `physics_process()` para acionar uma transição. Retorne `null` e nada muda.

```gdscript
# godot_modules/state_machine/state.gd
func enter() -> void: pass
func exit() -> void: pass
func input(_event: InputEvent) -> State: return null
func process(_delta: float) -> State: return null
func physics_process(_delta: float) -> State: return null
```

`StateMediator` lida com injeção de dependência: mantém um dicionário `injections` e empurra referências para cada estado filho antes de rodar. Estados não buscam o que precisam. Chega por conta própria.

Isso alimenta o `InputManager`, que roteia toda a entrada do jogador para a fase ativa (neutro, unidade selecionada, carta selecionada, targeting, deploying). A história por trás de substituir um monolito de input de 380 linhas feito na mão por isso é um post por si só.

### Efeitos

Esse aqui são duas linhas:

```gdscript
# godot_modules/effects/effect.gd
@abstract class_name Effect extends Resource

# godot_modules/effects/effect_handler.gd
@abstract class_name EffectHandler extends Node
```

Esse é o módulo. `Effect` é uma subclasse de `Resource`: dados puros, criável no Inspector, sem dependências de runtime. O jogo define subtipos concretos: dano, cura, mudanças de AP, deslocamento, aplicação de status e alguns outros.

Como os efeitos são realmente aplicados fica tudo no lado do jogo: o roteamento, o contexto compartilhado que percorre os steps de uma carta, o resolver que despacha cada subtipo. Esse é o glue. O módulo fica ignorante, o coupling fica em um lugar.

## O que vem a seguir

Tem muito ainda por cobrir. Tem bastante a dizer sobre o sistema de cards-as-data. O pipeline de IA passou por algumas gerações e tem histórias a contar. E unidades e suas nuances merecem seu próprio post também.

Até mais!
