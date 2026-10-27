# Weather App — Backlog de Tarefas

Tarefas agrupadas por entrega e ordenadas pelas dependências. Os itens T-01 a T-04 são gates: registram decisões ainda pendentes no plano/spec e não autorizam a equipe a presumir uma resposta.

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

## Entrega 2 — Domínio e acesso a dados

### T-05 — Criar tipos de domínio e DTOs

- **Descrição:** definir contratos TypeScript para `Unit`, `City`, `WeatherCondition`, `CurrentWeather`, `ForecastDay`, `WeatherData`, erros e payloads mínimos Open-Meteo.
- **Critérios de aceite:** `weather.ts` exporta os contratos de domínio e `openMeteo.ts` os DTOs usados pelos dois endpoints; campos opcionais e `null` seguem o plano; `pnpm build` termina sem erro de tipo.
- **Rastreabilidade:** FR-01 a FR-04, AC-03, AC-05 a AC-07, AC-10 a AC-12, AC-15.
- **Dependências:** T-01, T-02, T-03.
- **Arquivos prováveis:** `src/types/weather.ts`, `src/types/openMeteo.ts`.
- **Tipo:** Data.

### T-06 — Mapear códigos WMO

- **Descrição:** implementar uma função pura para converter códigos de condição aprovados em rótulos pt-BR.
- **Critérios de aceite:** cada código da tabela de T-02 retorna exatamente o rótulo pt-BR aprovado; código não mapeado retorna exatamente o fallback aprovado sem lançar exceção.
- **Rastreabilidade:** FR-02, FR-03, AC-06, AC-07.
- **Dependências:** T-02, T-05.
- **Arquivos prováveis:** `src/lib/weatherCode.ts`.
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
- **Critérios de aceite:** request usa coordenadas selecionadas, Celsius, `timezone=auto`, `forecast_days=5`, variáveis `current` e `daily` aprovadas; fixture válida mapeia para cinco datas; campos ausentes viram `null`; erro ou estrutura inválida não retorna sucesso.
- **Rastreabilidade:** FR-02, FR-03, FR-05, AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-01 a T-07, T-09.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`.
- **Tipo:** Data.

## Entrega 3 — Interface e orquestração

### T-11 — Criar estilos globais e base responsiva

- **Descrição:** preparar estilos globais Tailwind alinhados ao tema dark glassmorphism e aos viewports definidos.
- **Critérios de aceite:** `src/index.css` contém as diretivas Tailwind e regras globais do tema; regra de foco visível está definida; build Vite aceita o CSS importado.
- **Rastreabilidade:** NFR-01, NFR-02.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/index.css`.
- **Tipo:** UI.

### T-12 — Orquestrar estado e ações no hook

- **Descrição:** implementar busca, seleção, consulta, retry e unidade em `useWeatherApp` com estados independentes de busca e clima.
- **Critérios de aceite:** busca e clima expõem `idle/loading/success/error`, e só busca expõe `empty`; busca vazia preserva seleção/clima; nova seleção limpa clima e resposta antiga não sobrescreve a atual; retry repete os mesmos parâmetros; unidade não invoca serviço.
- **Rastreabilidade:** FR-01 a FR-05, AC-01, AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-05 a T-10.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.
- **Tipo:** Data.

### T-13 — Criar componente de busca

- **Descrição:** implementar campo de busca, lista de cidades, seleção e estados vazio/erro/carregamento.
- **Critérios de aceite:** input vazio não chama `onSearch`; cada resultado mostra nome e campos geográficos disponíveis; selecionar chama `onSelect` com o item escolhido; loading, vazio e erro têm conteúdo/status acessíveis distintos.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-01/02.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Tipo:** UI.

### T-14 — Criar componente de clima atual

- **Descrição:** apresentar local selecionado, temperatura e condição atuais.
- **Critérios de aceite:** sucesso exibe local, temperatura e condição das props; `null` exibe indisponibilidade; loading/erro não exibem dados anteriores; unidade e textos correspondem às props/AC-14.
- **Rastreabilidade:** FR-02, AC-05, AC-06, AC-08, AC-10, AC-14, NFR-01/02/04.
- **Dependências:** T-08, T-12.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI.

### T-15 — Criar componente de previsão

- **Descrição:** apresentar a previsão diária em grupos por data local.
- **Critérios de aceite:** com cinco dias válidos, renderiza exatamente cinco datas em ordem; `null` exibe indisponibilidade; timezone inválido mostra estado indisponível e não usa timezone do dispositivo.
- **Rastreabilidade:** FR-03, AC-05, AC-07, AC-10, AC-14, AC-15, NFR-01/02/04.
- **Dependências:** T-08, T-12.
- **Arquivos prováveis:** `src/components/Forecast.tsx`.
- **Tipo:** UI.

### T-16 — Criar controle de unidade

- **Descrição:** criar controle acessível para selecionar Celsius ou Fahrenheit.
- **Critérios de aceite:** identifica Celsius/Fahrenheit e opção selecionada; teclado altera opção e callback recebe `Unit` correto; interação não invoca serviço de dados.
- **Rastreabilidade:** FR-04, AC-11, AC-12, NFR-01/02/04.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.

### T-17 — Compor a tela principal

- **Descrição:** conectar hook e componentes por props/callbacks.
- **Critérios de aceite:** `App` conecta hook e componentes somente por props/callbacks; cada estado aparece no componente correspondente; `components/` não importa serviços; `pnpm build` termina com código 0.
- **Rastreabilidade:** FR-01 a FR-05, AC-01 a AC-15.
- **Dependências:** T-12 a T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI.

### T-18 — Conectar entrada React/Vite

- **Descrição:** montar a aplicação React no ponto de entrada do Vite e carregar os estilos globais.
- **Critérios de aceite:** `pnpm dev` inicia a rota principal e renderiza `App` com estilos globais; console do browser não apresenta erro de inicialização.
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