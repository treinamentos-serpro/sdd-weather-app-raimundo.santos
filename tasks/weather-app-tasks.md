# Weather App — Backlog de Tarefas

Tarefas agrupadas por entrega e ordenadas pelas dependências. Os itens T-01 a T-04 são gates: registram decisões ainda pendentes no plano/spec e não autorizam a equipe a presumir uma resposta.

## Matriz de rastreabilidade funcional

| Requisito da spec | Tarefas de implementação | Tarefas de teste | Cobertura |
| --- | --- | --- | --- |
| FR-01 — Buscar e selecionar cidade | T-05, T-07, T-09, T-11, T-12, T-17, T-18 | T-19, T-22, T-24, T-25, T-29 | Coberto: busca, mapeamento, seleção, UI e fluxo E2E. |
| FR-02 — Consultar clima atual | T-05 a T-08, T-10, T-11, T-13, T-17, T-18 | T-19 a T-21, T-23, T-24, T-26, T-29 | Coberto: temperatura, condição/ícone, quatro métricas com unidades, estados e integração. |
| FR-03 — Consultar previsão de cinco dias | T-01 (gate), T-05, T-06, T-07, T-10, T-11, T-14, T-17, T-18 | T-19, T-20, T-23, T-24, T-27, T-29 | Tarefas previstas; T-01 bloqueia a definição de máxima/mínima/média antes de fechar o campo diário. |
| FR-04 — Alternar Celsius/Fahrenheit | T-05, T-08, T-11, T-15, T-17, T-18 | T-21, T-24, T-28, T-29 | Coberto: conversão pura, controle, derivação sem novo request e fluxo E2E. |
| FR-05 — Comunicar estados da consulta | T-09, T-10, T-11, T-12, T-13, T-14, T-17, T-18 | T-22, T-23, T-24, T-25, T-26, T-27, T-29 | Coberto: loading, vazio na busca, erro, timeout e retry manual. |

**Requisitos sem tarefa correspondente:** nenhum FR da spec está sem tarefa de implementação ou teste. FR-03 permanece bloqueado pela decisão registrada em T-01; isso é uma dependência pendente, não uma lacuna de rastreabilidade.

## Prioridade e tamanho

**Prioridade:** P0 compõe o caminho funcional do MVP; P1 verifica critérios e regressões; P2 cobre prontidão operacional/go-live, pode vir após a demonstração, mas não pode ficar pendente no lançamento. **Tamanho:** S = pequeno (uma mudança simples, geralmente um arquivo); M = médio (contrato, integração ou conjunto de cenários de um arquivo); G = grande (coordenação entre estados/camadas ou vários cenários E2E). Estimativas relativas, não duração.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | M |
| T-02 | P0 | M |
| T-03 | P0 | M |
| T-04 | P2 | M |
| T-05 | P0 | M |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | S |
| T-09 | P0 | M |
| T-10 | P0 | M |
| T-11 | P0 | G |
| T-12 | P0 | M |
| T-13 | P0 | S |
| T-14 | P0 | M |
| T-15 | P0 | S |
| T-16 | P0 | S |
| T-17 | P0 | M |
| T-18 | P0 | S |
| T-19 | P1 | M |
| T-20 | P1 | S |
| T-21 | P1 | S |
| T-22 | P1 | M |
| T-23 | P1 | M |
| T-24 | P1 | M |
| T-25 | P1 | M |
| T-26 | P1 | S |
| T-27 | P1 | M |
| T-28 | P1 | S |
| T-29 | P1 | G |
| T-30 | P2 | M |

## Sequência em fatias verticais

1. **Busca e seleção visíveis (P0):** T-03, T-05, T-06, T-07, T-09, T-11, T-12, T-16, T-17 e T-18; validar com T-19, T-22, T-24 e T-25. Entrega: pesquisar, distinguir e selecionar uma cidade com estados de loading/vazio/erro.
2. **Clima atual (P1):** T-02, T-10 e T-13; validar com T-20, T-23 e T-26. Entrega: exibir temperatura e condição do local selecionado, com estado parcial/falha.
3. **Previsão de cinco dias (P1):** T-01 e T-14; validar com T-27 e cenário integrado em T-29. Entrega: datas locais ordenadas e dados diários ou indisponibilidade explícita.
4. **Alternância de unidade (P1):** T-08 e T-15; validar com T-21, T-28 e T-29. Entrega: temperaturas em °C/°F derivadas sem nova chamada.
5. **Prontidão de lançamento (P2):** fechar T-04 e T-30 após as fatias funcionais e testes; qualquer gate pendente mantém o go-live bloqueado.

**Ajuste para antecipar a primeira tela:** no grafo atual, T-11 depende de T-05 a T-10 (inclui forecast), e T-17 depende de T-12 a T-16 (inclui todos os painéis). Assim, a fatia de busca não pode ser concluída antes das fatias de clima/previsão. Para entregar algo visível mais cedo, decompor T-11 em busca e meteorologia e permitir que T-17 componha primeiro a busca, integrando os outros painéis nas fatias seguintes; caso contrário, considerar o conjunto T-01 a T-18 como a primeira entrega visual.

## Entrega 1 — Contratos e gates

### T-01 — Definir temperatura da previsão diária

- **Descrição:** decidir se a temperatura diária apresentada será máxima, mínima ou média e registrar o campo Open-Meteo correspondente.
- **Critérios de aceite:** spec e plano identificam uma única estatística (máxima, mínima ou média) e seu campo Open-Meteo; `daily_temperature_field` é substituído pelo nome exato; exemplo e AC-07 usam essa mesma estatística.
- **Rastreabilidade:** FR-03, AC-07.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Data.

### T-02 — Aprovar mapeamento de condições WMO

- **Descrição:** definir descrições pt-BR para os códigos WMO utilizados e o fallback para códigos desconhecidos.
- **Critérios de aceite:** tabela documenta os códigos WMO cobertos pela referência com rótulos pt-BR; um código não mapeado tem fallback explícito; spec e plano usam a mesma tabela e fallback.
- **Rastreabilidade:** FR-02, FR-03, AC-06, AC-07, Open Question 6.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Data.

### T-03 — Confirmar viabilidade da Open-Meteo

- **Descrição:** validar cobertura, CORS, limites, licença, atribuição e condições de uso para os ambientes previstos.
- **Critérios de aceite:** checklist registra evidência de cobertura, CORS nos ambientes alvo, limites, licença, atribuição e condições de uso; decisão go/no-go e restrições constam no plano antes da integração.
- **Rastreabilidade:** NFR-06, Risk de cobertura/limites/licença da Open-Meteo.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.

### T-04 — Aprovar estratégia de observabilidade

- **Descrição:** definir como falhas e disponibilidade serão monitoradas sem violar a restrição de privacidade/telemetria da spec.
- **Critérios de aceite:** mecanismo, eventos/campos, retenção, acesso e responsável estão documentados; cada campo tem finalidade aprovada; nenhum termo de busca ou dado pessoal é coletado sem finalidade, aviso e retenção aprovados.
- **Rastreabilidade:** NFR-05, NFR-06.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Infra.

## Entrega 2 — Tipos, funções puras e services

### T-05 — Criar tipos de domínio e DTOs

- **Descrição:** definir contratos TypeScript para `Unit`, `City`, `WeatherCondition`, `CurrentWeather` (incluindo umidade, vento, precipitação e pressão), `ForecastDay`, `WeatherData`, erros e payloads Open-Meteo.
- **Critérios de aceite:** `weather.ts` exporta os contratos de domínio com métricas em `%`, `km/h`, `mm` e `hPa`; `openMeteo.ts` modela os campos correspondentes dos endpoints; ausências aceitam `null`; TypeScript compila.
- **Rastreabilidade:** FR-01 a FR-04, AC-03, AC-05 a AC-07, AC-10 a AC-12, AC-15.
- **Dependências:** T-01, T-02, T-03.
- **Arquivos prováveis:** `src/types/weather.ts`, `src/types/openMeteo.ts`.
- **Tipo:** Data.

### T-06 — Mapear códigos WMO

- **Descrição:** implementar funções puras para mapear códigos WMO a rótulos e ícones climáticos.
- **Critérios de aceite:** códigos aprovados retornam os rótulos pt-BR de T-02 e o ícone esperado; códigos nulos/desconhecidos retornam o fallback aprovado sem exceção.
- **Rastreabilidade:** FR-02, FR-03, AC-06, AC-07.
- **Dependências:** T-02, T-05.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data.

### T-07 — Mapear payloads para o domínio

- **Descrição:** mapear payloads válidos de geocoding e forecast para `City` e `WeatherData`, preservando coordenadas, datas locais e ausências.
- **Critérios de aceite:** fixtures conhecidas produzem valores de domínio correspondentes; campos opcionais ausentes não são inventados; campos meteorológicos ausentes viram `null`; estrutura incompatível não retorna sucesso.
- **Rastreabilidade:** FR-01 a FR-03, AC-03, AC-05 a AC-10, AC-15.
- **Dependências:** T-05, T-06.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.
- **Tipo:** Data.

### T-08 — Implementar conversão de temperatura

- **Descrição:** criar função pura para derivar valores de apresentação a partir de Celsius e da unidade selecionada.
- **Critérios de aceite:** `null` retorna `null`; Celsius retorna o valor de entrada; 0 °C retorna 32 °F e 100 °C retorna 212 °F; empates arredondam para longe de zero; entrada não é mutada.
- **Rastreabilidade:** FR-04, AC-11, AC-12.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.

### T-09 — Implementar serviço de geocoding

- **Descrição:** encapsular a busca Open-Meteo e validar sua resposta antes de retornar cidades normalizadas.
- **Critérios de aceite:** request envia `name` com query trimada, `count=10`, `language=pt` e `format=json`; 2xx válido sem resultados retorna `empty`; rede, HTTP não-2xx, envelope de erro, timeout de 10 s e payload malformado retornam categorias distintas; não há retry automático.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13.
- **Dependências:** T-03, T-05, T-07.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data.

### T-10 — Implementar serviço de forecast

- **Descrição:** consultar clima atual e previsão diária de cinco dias para as coordenadas da cidade selecionada.
- **Critérios de aceite:** request usa coordenadas selecionadas, Celsius, umidade, vento em km/h, precipitação em mm, pressão em hPa, `timezone=auto`, `forecast_days=5` e variáveis `daily` aprovadas; fixture válida mapeia métricas e cinco datas; campos ausentes viram `null`; resposta inválida não retorna sucesso.
- **Rastreabilidade:** FR-02, FR-03, FR-05, AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-01 a T-07, T-09.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data.

## Entrega 3 — Orquestração

### T-11 — Orquestrar estado e ações no hook

- **Descrição:** implementar busca, seleção, consulta, retry e unidade em `useWeatherApp` com estados independentes de busca e clima.
- **Critérios de aceite:** busca e clima expõem `idle/loading/success/error`, e só busca expõe `empty`; busca vazia preserva seleção/clima; nova seleção limpa clima e resposta antiga não sobrescreve a atual; retry repete os mesmos parâmetros; unidade não invoca serviço.
- **Rastreabilidade:** FR-01 a FR-05, AC-01, AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-05 a T-10.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.
- **Tipo:** Data.

## Entrega 4 — Componentes

### T-12 — Criar componente de busca

- **Descrição:** implementar campo de busca, lista de cidades, seleção e estados vazio/erro/carregamento.
- **Critérios de aceite:** input vazio não chama `onSearch`; cada resultado mostra nome e campos geográficos disponíveis; selecionar chama `onSelect` com o item escolhido; loading, vazio e erro têm conteúdo/status acessíveis distintos.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-01/02.
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Tipo:** UI.

### T-13 — Criar componente de clima atual

- **Descrição:** apresentar hero do clima atual com temperatura, ícone WMO, condição e métricas de umidade, vento, precipitação e pressão.
- **Critérios de aceite:** temperatura usa `toDisplayTemperature` na unidade recebida; condição usa `getWeatherIcon`; as quatro métricas exibem valor e unidade ou indisponibilidade para `null`; local e textos correspondem às props.
- **Rastreabilidade:** FR-02, AC-05, AC-06, AC-10, AC-14, NFR-01/02/04.
- **Dependências:** T-08, T-10, T-11.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/lib/temperature.ts`, `src/lib/weatherCodes.ts`.
- **Tipo:** UI.

### T-14 — Criar componente de previsão

- **Descrição:** apresentar a previsão diária em grupos por data local.
- **Critérios de aceite:** com cinco dias válidos, renderiza exatamente cinco datas em ordem; `null` exibe indisponibilidade; timezone inválido mostra estado indisponível e não usa timezone do dispositivo.
- **Rastreabilidade:** FR-03, AC-05, AC-07, AC-10, AC-14, AC-15, NFR-01/02/04.
- **Dependências:** T-08, T-10, T-11.
- **Arquivos prováveis:** `src/components/Forecast.tsx`.
- **Tipo:** UI.

### T-15 — Criar controle de unidade

- **Descrição:** criar controle acessível para selecionar Celsius ou Fahrenheit.
- **Critérios de aceite:** identifica Celsius/Fahrenheit e opção selecionada; teclado altera opção e callback recebe `Unit` correto; interação não invoca serviço de dados.
- **Rastreabilidade:** FR-04, AC-11, AC-12, NFR-01/02/04.
- **Dependências:** T-08, T-11.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

## Entrega 5 — Integração

### T-16 — Criar estilos globais e base responsiva

- **Descrição:** preparar estilos globais Tailwind alinhados ao tema dark glassmorphism e aos viewports definidos.
- **Critérios de aceite:** `src/index.css` contém as diretivas Tailwind e regras globais do tema; regra de foco visível está definida; build Vite aceita o CSS importado.
- **Rastreabilidade:** NFR-01, NFR-02.
- **Dependências:** T-12 a T-15.
- **Arquivos prováveis:** `src/index.css`.
- **Tipo:** UI.

### T-17 — Compor a tela principal

- **Descrição:** conectar hook e componentes por props/callbacks.
- **Critérios de aceite:** `App` conecta hook e componentes somente por props/callbacks; cada estado aparece no componente correspondente; `components/` não importa serviços; `pnpm build` termina com código 0.
- **Rastreabilidade:** FR-01 a FR-05, AC-01 a AC-15.
- **Dependências:** T-11 a T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-18 — Conectar entrada React/Vite

- **Descrição:** montar a aplicação React no ponto de entrada do Vite e carregar os estilos globais.
- **Critérios de aceite:** `pnpm dev` inicia a rota principal e renderiza `App` com estilos globais; console do browser não apresenta erro de inicialização.
- **Rastreabilidade:** FR-01 a FR-05, NFR-01.
- **Dependências:** T-16, T-17.
- **Arquivos prováveis:** `src/main.tsx`.
- **Tipo:** UI.

## Entrega 6 — Testes

### T-19 — Testar mapeamento de payloads

- **Descrição:** testar conversão de respostas geocoding/forecast para contratos de domínio.
- **Critérios de aceite:** fixture de cada endpoint verifica campos completos e valores mapeados; fixtures sem campos opcionais ou meteorológicos verificam omissão/`null`; estrutura incompatível é rejeitada; coordenadas e datas de saída são iguais às da entrada.
- **Rastreabilidade:** AC-03, AC-05 a AC-10, AC-15.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/lib/weatherMapper.test.ts`.
- **Tipo:** Test.

### T-20 — Testar mapeamento de códigos WMO

- **Descrição:** verificar ícones e fallback de códigos meteorológicos.
- **Critérios de aceite:** teste parametrizado verifica ícones de códigos conhecidos, `null` e código desconhecido; nenhuma chamada de rede é feita.
- **Rastreabilidade:** AC-06, AC-07.
- **Dependências:** T-02, T-06.
- **Arquivos prováveis:** `tests/unit/lib/weatherCodes.test.ts`.
- **Tipo:** Test.

### T-21 — Testar conversão de temperatura

- **Descrição:** validar conversão pura e arredondamento da temperatura exibida.
- **Critérios de aceite:** asserts verificam `0 °C → 32 °F`, `100 °C → 212 °F`, valor negativo, `null`, empate positivo e negativo arredondados para longe de zero; a entrada permanece inalterada; o teste não instancia nem chama services.
- **Rastreabilidade:** AC-11, AC-12.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test.

### T-22 — Testar serviço de geocoding

- **Descrição:** testar geocoding com `fetch` mockado.
- **Critérios de aceite:** `fetch` é mockado nesta tarefa; asserts verificam URL/parâmetros exatos e sucesso, lista vazia, rede, HTTP não-2xx, envelope API, timeout aos 10 s, cancelamento e JSON/schema inválido; nenhuma chamada de rede real ocorre.
- **Rastreabilidade:** AC-01 a AC-04, AC-08, AC-09, AC-13.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/services/geocoding.test.ts`.
- **Tipo:** Test.

### T-23 — Testar serviço de forecast

- **Descrição:** testar forecast com `fetch` mockado.
- **Critérios de aceite:** `fetch` é mockado nesta tarefa; asserts verificam coordenadas e parâmetros `current`/`daily`, resposta completa de cinco dias, campos ausentes como `null`, erros HTTP/API/rede, timeout aos 10 s, cancelamento e timezone ausente; nenhuma chamada de rede real ocorre.
- **Rastreabilidade:** AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/services/forecast.test.ts`.
- **Tipo:** Test.

### T-24 — Testar hook de estado

- **Descrição:** testar orquestração com serviços mockados e respostas concorrentes controladas.
- **Critérios de aceite:** cada transição é provocada por ação/resposta controlada; `empty` ocorre somente na busca; seleção limpa clima anterior; retry reutiliza os mesmos argumentos; resposta tardia não altera cidade/estado atual; mudar unidade não chama serviço.
- **Rastreabilidade:** AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`.
- **Tipo:** Test.

### T-25 — Testar componente de busca

- **Descrição:** validar estados, submissão e seleção por interação do usuário.
- **Critérios de aceite:** testes renderizam separadamente `idle`, `loading`, `success`, `empty` e `error`; cada estado tem conteúdo/role esperado; input vazio não chama callback; seleção e retry chamam callback correto; teclado, foco visível e nome acessível são verificados. `empty` é exclusivo da busca.
- **Rastreabilidade:** AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-02.
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`.
- **Tipo:** Test.

### T-26 — Testar componente de clima atual

- **Descrição:** validar conteúdo, unidade e dados parciais no painel atual.
- **Critérios de aceite:** teste verifica local, condição/ícone, temperatura convertida e unidades de umidade/vento/precipitação/pressão; métricas `null` indicam indisponibilidade; Fahrenheit altera o valor exibido; estados `loading`/`error` têm role acessível.
- **Rastreabilidade:** AC-05, AC-06, AC-08, AC-10, AC-14, NFR-02/04.
- **Dependências:** T-13.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.
- **Tipo:** Test.

### T-27 — Testar componente de previsão

- **Descrição:** validar datas, valores e estados indisponíveis no painel de previsão.
- **Critérios de aceite:** testes renderizam separadamente `loading`, `success` e `error`; fixture de sucesso verifica cinco datas ordenadas no timezone fornecido; `null` mostra indisponibilidade; unidade corresponde à prop; loading/erro têm role acessível e timezone inválido mostra estado indisponível. Não existe estado `empty` para clima.
- **Rastreabilidade:** AC-05, AC-07, AC-10, AC-14, AC-15, NFR-02.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/components/Forecast.test.tsx`.
- **Tipo:** Test.

### T-28 — Testar controle de unidade

- **Descrição:** verificar seleção e acessibilidade do controle Celsius/Fahrenheit.
- **Critérios de aceite:** seleção inicial e opção ativa são verificadas; callbacks recebem `celsius`/`fahrenheit` conforme interação; teclado altera opção e foco visível é detectável.
- **Rastreabilidade:** AC-11, AC-12, NFR-02.
- **Dependências:** T-15.
- **Arquivos prováveis:** `tests/unit/components/UnitToggle.test.tsx`.
- **Tipo:** Test.

### T-29 — Validar E2E e viewport mobile

- **Descrição:** testar o fluxo integrado com Playwright e APIs interceptadas.
- **Critérios de aceite:** com APIs interceptadas, um teste E2E percorre busca → seleção → clima atual → previsão de cinco dias → troca de unidade e confirma que a troca não gera novo request; testes adicionais cobrem vazio, erro/retry, timeout e resposta obsoleta; o fluxo principal passa no projeto mobile do Playwright e em 320, 768 e 1280 px, retrato/paisagem, com `scrollWidth <= clientWidth`.
- **Rastreabilidade:** US-01 a US-05, AC-01 a AC-15, NFR-01/02.
- **Dependências:** T-17, T-18, T-22 a T-28.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.

## Entrega 7 — Hardening

### T-30 — Executar gates de entrega

- **Descrição:** verificar qualidade técnica e aprovações necessárias antes do go-live.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com código 0; nenhuma suite chama a Open-Meteo real; T-01 a T-04 e aprovações NFR-01/02/03/05/06 estão concluídas para marcar go-live. Gate pendente exige status `bloqueado`, responsável e decisão pendente registrados; não pode ser marcado aprovado.
- **Rastreabilidade:** NFR-01, NFR-02, NFR-03, NFR-05, NFR-06.
- **Dependências:** T-01 a T-04, T-19 a T-29.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.