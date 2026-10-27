# Weather App — Backlog de Tarefas

Tarefas agrupadas por entrega e ordenadas pelas dependências. Os itens T-01 a T-04 são gates: registram decisões ainda pendentes no plano/spec e não autorizam a equipe a presumir uma resposta.

## Entrega 1 — Contratos e gates

### T-01 — Definir temperatura da previsão diária

- **Descrição:** decidir se a temperatura diária apresentada será máxima, mínima ou média e registrar o campo Open-Meteo correspondente.
- **Critérios de aceite:** a decisão está registrada na spec e no plano; `daily_temperature_field` foi substituído pelo campo escolhido; AC-07 e fixtures podem ser implementados sem ambiguidade.
- **Rastreabilidade:** FR-03, AC-07.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Data.

### T-02 — Aprovar mapeamento de condições WMO

- **Descrição:** definir descrições pt-BR para os códigos WMO utilizados e o fallback para códigos desconhecidos.
- **Critérios de aceite:** tabela e fallback estão documentados e revisados; códigos conhecidos têm rótulos esperados para clima atual e previsão.
- **Rastreabilidade:** FR-02, FR-03, AC-06, AC-07, Open Question 6.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Data.

### T-03 — Confirmar viabilidade da Open-Meteo

- **Descrição:** validar cobertura, CORS, limites, licença, atribuição e condições de uso para os ambientes previstos.
- **Critérios de aceite:** evidências e decisão de uso estão registradas; restrições relevantes viram critérios ou riscos explícitos antes de integrar a API.
- **Rastreabilidade:** NFR-06, Risk de cobertura/limites/licença da Open-Meteo.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.

### T-04 — Aprovar estratégia de observabilidade

- **Descrição:** definir como falhas e disponibilidade serão monitoradas sem violar a restrição de privacidade/telemetria da spec.
- **Critérios de aceite:** mecanismo, dados coletados, retenção e responsável operacional estão documentados; a solução não registra termos de busca ou dados pessoais sem aprovação.
- **Rastreabilidade:** NFR-05, NFR-06.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Tipo:** Infra.

## Entrega 2 — Domínio e acesso a dados

### T-05 — Criar tipos de domínio e DTOs

- **Descrição:** definir contratos TypeScript para `Unit`, `City`, `WeatherCondition`, `CurrentWeather`, `ForecastDay`, `WeatherData`, erros e payloads mínimos Open-Meteo.
- **Critérios de aceite:** os tipos refletem os campos aprovados em T-01/T-02; campos opcionais ou ausentes não são representados por valores inventados; TypeScript strict compila.
- **Rastreabilidade:** FR-01 a FR-04, AC-03, AC-05 a AC-07, AC-10 a AC-12, AC-15.
- **Dependências:** T-01, T-02, T-03.
- **Arquivos prováveis:** `src/types/weather.ts`, `src/types/openMeteo.ts`.
- **Tipo:** Data.

### T-06 — Mapear códigos WMO

- **Descrição:** implementar uma função pura para converter códigos de condição aprovados em rótulos pt-BR.
- **Critérios de aceite:** códigos aprovados retornam os rótulos definidos em T-02; código desconhecido usa o fallback aprovado sem lançar erro.
- **Rastreabilidade:** FR-02, FR-03, AC-06, AC-07.
- **Dependências:** T-02, T-05.
- **Arquivos prováveis:** `src/lib/weatherCode.ts`.
- **Tipo:** Data.

### T-07 — Mapear payloads para o domínio

- **Descrição:** mapear payloads válidos de geocoding e forecast para `City` e `WeatherData`, preservando coordenadas, datas locais e ausências.
- **Critérios de aceite:** cidade e dados meteorológicos correspondem ao payload; campos opcionais ausentes não são inventados; campos meteorológicos ausentes são `null`; payload malformado não é aceito como válido.
- **Rastreabilidade:** FR-01 a FR-03, AC-03, AC-05 a AC-10, AC-15.
- **Dependências:** T-05, T-06.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`.
- **Tipo:** Data.

### T-08 — Implementar conversão de temperatura

- **Descrição:** criar função pura para derivar valores de apresentação a partir de Celsius e da unidade selecionada.
- **Critérios de aceite:** `null` permanece indisponível; Fahrenheit aplica fórmula e arredondamento de AC-12; entrada em Celsius não é mutada.
- **Rastreabilidade:** FR-04, AC-11, AC-12.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data.

### T-09 — Implementar serviço de geocoding

- **Descrição:** encapsular a busca Open-Meteo e validar sua resposta antes de retornar cidades normalizadas.
- **Critérios de aceite:** usa os parâmetros aprovados; resposta válida sem resultados é distinta de erro; rede, HTTP, API, timeout e payload inválido retornam erros tipados; timeout é 10 s, sem retry automático.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13.
- **Dependências:** T-03, T-05, T-07.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data.

### T-10 — Implementar serviço de forecast

- **Descrição:** consultar clima atual e previsão diária de cinco dias para as coordenadas da cidade selecionada.
- **Critérios de aceite:** request usa Celsius, timezone local e o campo diário aprovado em T-01; resposta mapeia para `WeatherData`; campos parciais e erros seguem os contratos; resposta inválida não vira sucesso.
- **Rastreabilidade:** FR-02, FR-03, FR-05, AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-01 a T-07, T-09.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data.

## Entrega 3 — Interface e orquestração

### T-11 — Criar estilos globais e base responsiva

- **Descrição:** preparar estilos globais Tailwind alinhados ao tema dark glassmorphism e aos viewports definidos.
- **Critérios de aceite:** estilos globais podem ser importados pela aplicação; conteúdo não exige rolagem horizontal a 320 px; foco visível permanece legível no tema.
- **Rastreabilidade:** NFR-01, NFR-02.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/index.css`.
- **Tipo:** UI.

### T-12 — Orquestrar estado e ações no hook

- **Descrição:** implementar busca, seleção, consulta, retry e unidade em `useWeatherApp` com estados independentes de busca e clima.
- **Critérios de aceite:** estados `idle/loading/success/error` existem para operações; `empty` é exclusivo da busca; nova seleção limpa clima anterior e respostas obsoletas não sobrescrevem a cidade atual; alterar unidade não chama serviços.
- **Rastreabilidade:** FR-01 a FR-05, AC-01, AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-05 a T-10.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.
- **Tipo:** Data.

### T-13 — Criar componente de busca

- **Descrição:** implementar campo de busca, lista de cidades, seleção e estados vazio/erro/carregamento.
- **Critérios de aceite:** input vazio não envia request; resultados mostram os campos geográficos disponíveis; seleção dispara o callback do resultado correto; vazio, erro e loading são distinguíveis e acessíveis.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-01/02.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Tipo:** UI.

### T-14 — Criar componente de clima atual

- **Descrição:** apresentar local selecionado, temperatura e condição atuais.
- **Critérios de aceite:** exibe dados apenas do local selecionado; campos `null` aparecem como indisponíveis; unidade e textos seguem AC-06/10/14.
- **Rastreabilidade:** FR-02, AC-05, AC-06, AC-08, AC-10, AC-14, NFR-01/02/04.
- **Dependências:** T-08, T-12.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.

### T-15 — Criar componente de previsão

- **Descrição:** apresentar a previsão diária em grupos por data local.
- **Critérios de aceite:** renderiza as cinco datas em ordem; exibe temperatura/condição ou indisponibilidade por campo; não usa o timezone do dispositivo.
- **Rastreabilidade:** FR-03, AC-05, AC-07, AC-10, AC-14, AC-15, NFR-01/02/04.
- **Dependências:** T-08, T-12.
- **Arquivos prováveis:** `src/components/Forecast.tsx`.
- **Tipo:** UI.

### T-16 — Criar controle de unidade

- **Descrição:** criar controle acessível para selecionar Celsius ou Fahrenheit.
- **Critérios de aceite:** expõe unidade selecionada e emite mudança via callback; é operável por teclado e identifica as opções; não faz chamada de dados.
- **Rastreabilidade:** FR-04, AC-11, AC-12, NFR-01/02/04.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

### T-17 — Compor a tela principal

- **Descrição:** conectar hook e componentes por props/callbacks.
- **Critérios de aceite:** a tela exibe estados e dados providos pelo hook; nenhum componente chama serviços diretamente; compilação passa.
- **Rastreabilidade:** FR-01 a FR-05, AC-01 a AC-15.
- **Dependências:** T-12 a T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-18 — Conectar entrada React/Vite

- **Descrição:** montar a aplicação React no ponto de entrada do Vite e carregar os estilos globais.
- **Critérios de aceite:** `pnpm dev` carrega `App` e estilos; não há erro no console ao iniciar.
- **Rastreabilidade:** FR-01 a FR-05, NFR-01.
- **Dependências:** T-11, T-17.
- **Arquivos prováveis:** `src/main.tsx`.
- **Tipo:** UI.

## Entrega 4 — Testes e validação

### T-19 — Testar mapeamento de payloads

- **Descrição:** testar conversão de respostas geocoding/forecast para contratos de domínio.
- **Critérios de aceite:** fixtures cobrem campos completos, ausentes e estrutura inválida; datas, coordenadas e associação ao local são preservadas.
- **Rastreabilidade:** AC-03, AC-05 a AC-10, AC-15.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/lib/weatherMapper.test.ts`.
- **Tipo:** Test.

### T-20 — Testar mapeamento de códigos WMO

- **Descrição:** verificar os rótulos e fallback de condições meteorológicas.
- **Critérios de aceite:** cada código aprovado e pelo menos um código desconhecido têm resultado esperado; teste não usa rede.
- **Rastreabilidade:** AC-06, AC-07.
- **Dependências:** T-02, T-06.
- **Arquivos prováveis:** `tests/unit/lib/weatherCode.test.ts`.
- **Tipo:** Test.

### T-21 — Testar conversão de temperatura

- **Descrição:** validar conversão pura e arredondamento da temperatura exibida.
- **Critérios de aceite:** cobre `0`, `100`, negativos, `null` e empates de arredondamento conforme AC-12.
- **Rastreabilidade:** AC-11, AC-12.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test.

### T-22 — Testar serviço de geocoding

- **Descrição:** testar geocoding com `fetch` mockado.
- **Critérios de aceite:** cobre URL/parâmetros, sucesso, lista vazia, rede, HTTP/API, timeout, cancelamento e payload inválido; não chama API externa.
- **Rastreabilidade:** AC-01 a AC-04, AC-08, AC-09, AC-13.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/services/geocoding.test.ts`.
- **Tipo:** Test.

### T-23 — Testar serviço de forecast

- **Descrição:** testar forecast com `fetch` mockado.
- **Critérios de aceite:** cobre parâmetros, resposta completa/parcial, erro HTTP/API/rede, timeout, cancelamento e timezone ausente; não chama API externa.
- **Rastreabilidade:** AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/services/forecast.test.ts`.
- **Tipo:** Test.

### T-24 — Testar hook de estado

- **Descrição:** testar orquestração com serviços mockados e respostas concorrentes controladas.
- **Critérios de aceite:** cobre idle/loading/success/empty/error, seleção, retry, descarte de resposta obsoleta e troca de unidade sem request novo.
- **Rastreabilidade:** AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`.
- **Tipo:** Test.

### T-25 — Testar componente de busca

- **Descrição:** validar estados, submissão e seleção por interação do usuário.
- **Critérios de aceite:** cobre input vazio, loading, success, empty e error; seleção e retry funcionam; teclado, foco e nomes acessíveis passam.
- **Rastreabilidade:** AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-02.
- **Dependências:** T-13.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`.
- **Tipo:** Test.

### T-26 — Testar componente de clima atual

- **Descrição:** validar conteúdo, unidade e dados parciais no painel atual.
- **Critérios de aceite:** exibe sucesso, loading/erro e campo indisponível; unidade e local correspondem às props; mensagens têm semântica acessível.
- **Rastreabilidade:** AC-05, AC-06, AC-08, AC-10, AC-14, NFR-02.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.
- **Tipo:** Test.

### T-27 — Testar componente de previsão

- **Descrição:** validar datas, valores e estados indisponíveis no painel de previsão.
- **Critérios de aceite:** verifica cinco datas ordenadas, campos parciais, fuso e unidade recebidos; erro e loading são acessíveis.
- **Rastreabilidade:** AC-05, AC-07, AC-10, AC-14, AC-15, NFR-02.
- **Dependências:** T-15.
- **Arquivos prováveis:** `tests/unit/components/Forecast.test.tsx`.
- **Tipo:** Test.

### T-28 — Testar controle de unidade

- **Descrição:** verificar seleção e acessibilidade do controle Celsius/Fahrenheit.
- **Critérios de aceite:** unidade ativa é indicada; callback recebe cada seleção; teclado e foco visível funcionam.
- **Rastreabilidade:** AC-11, AC-12, NFR-02.
- **Dependências:** T-16.
- **Arquivos prováveis:** `tests/unit/components/UnitToggle.test.tsx`.
- **Tipo:** Test.

### T-29 — Validar E2E e viewport mobile

- **Descrição:** testar o fluxo integrado com Playwright e APIs interceptadas.
- **Critérios de aceite:** busca → seleção → clima/previsão e troca de unidade passam; vazio, erro, retry, timeout e resposta obsoleta são testados; o fluxo principal funciona a 320 px sem rolagem horizontal e também em 768/1280 px e retrato/paisagem.
- **Rastreabilidade:** US-01 a US-05, AC-01 a AC-15, NFR-01/02.
- **Dependências:** T-17, T-18, T-22 a T-28.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.

### T-30 — Executar gates de entrega

- **Descrição:** verificar qualidade técnica e aprovações necessárias antes do go-live.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passam; T-03/T-04 e metas NFR-01/03/06 estão aprovadas ou registradas como bloqueios; testes não dependem da Open-Meteo real.
- **Rastreabilidade:** NFR-01, NFR-02, NFR-03, NFR-05, NFR-06.
- **Dependências:** T-03, T-04, T-19 a T-29.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Tipo:** Infra.