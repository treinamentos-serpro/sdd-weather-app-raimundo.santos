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

### T-06 — Implementar mapeadores e conversão puros

- **Descrição:** normalizar DTOs para o domínio, mapear códigos WMO e derivar valores de temperatura para a unidade selecionada.
- **Critérios de aceite:** dados são normalizados em Celsius; campos ausentes viram `null`; códigos desconhecidos usam o fallback aprovado; conversão e arredondamento atendem AC-11/12 sem mutar os dados de origem.
- **Rastreabilidade:** FR-02 a FR-04, AC-06, AC-07, AC-10 a AC-12, AC-15.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/lib/weatherMapper.ts`, `src/lib/weatherCode.ts`, `src/lib/temperature.ts`.
- **Tipo:** Data.

### T-07 — Implementar serviço de geocoding

- **Descrição:** encapsular a chamada de busca à Open-Meteo, validar a resposta e retornar `City[]` normalizado.
- **Critérios de aceite:** usa os parâmetros aprovados no plano; lista vazia válida é distinguível de erro; erro de rede, HTTP, API, timeout e payload inválido retornam categorias tipadas; timeout é 10 s e não há retry automático.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13.
- **Dependências:** T-03, T-05, T-06.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`, `src/types/openMeteo.ts`.
- **Tipo:** Data.

### T-08 — Implementar serviço de forecast

- **Descrição:** consultar clima atual e previsão diária de cinco dias para as coordenadas da cidade selecionada.
- **Critérios de aceite:** request usa Celsius, timezone local e o campo diário aprovado em T-01; resposta mapeia para `WeatherData`; campos parciais e erros seguem os contratos; resposta inválida não vira sucesso.
- **Rastreabilidade:** FR-02, FR-03, FR-05, AC-05 a AC-10, AC-13, AC-15.
- **Dependências:** T-01, T-02, T-03, T-05, T-06.
- **Arquivos prováveis:** `src/services/openMeteoService.ts`, `src/types/openMeteo.ts`.
- **Tipo:** Data.

## Entrega 3 — Aplicação e interface

### T-09 — Montar composição principal da aplicação

- **Descrição:** criar a composição da tela com o hook e os componentes, preservando a estrutura React/Vite e o tema do projeto.
- **Critérios de aceite:** a aplicação inicia pelo Vite; componentes recebem estado via props e callbacks; não há chamadas de serviço diretamente na UI.
- **Rastreabilidade:** NFR-01, NFR-02; arquitetura em camadas do plano.
- **Dependências:** T-05.
- **Arquivos prováveis:** `src/App.tsx`, `src/main.tsx`, `src/index.css`.
- **Tipo:** UI.

### T-10 — Orquestrar estado e ações no hook

- **Descrição:** implementar busca, seleção, consulta, retry e unidade em `useWeatherApp` com estados independentes de busca e clima.
- **Critérios de aceite:** estados `idle/loading/success/error` existem para operações; `empty` é exclusivo da busca; nova seleção limpa clima anterior e respostas obsoletas não sobrescrevem a cidade atual; alterar unidade não chama serviços.
- **Rastreabilidade:** FR-01 a FR-05, AC-01, AC-04, AC-05, AC-08, AC-11 a AC-13.
- **Dependências:** T-06, T-07, T-08.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`, `src/types/weather.ts`.
- **Tipo:** Data.

### T-11 — Criar interface de busca e seleção

- **Descrição:** implementar campo de busca, lista de cidades, seleção e estados vazio/erro/carregamento.
- **Critérios de aceite:** input vazio não envia request; resultados mostram os campos geográficos disponíveis; seleção dispara o callback do resultado correto; vazio, erro e loading são distinguíveis e acessíveis.
- **Rastreabilidade:** FR-01, FR-05, AC-01 a AC-04, AC-08, AC-09, AC-13, AC-14, NFR-01/02.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.
- **Tipo:** UI.

### T-12 — Criar painéis de clima atual e previsão

- **Descrição:** exibir cidade selecionada, condições atuais e cinco datas da previsão, incluindo estados parciais e indisponíveis.
- **Critérios de aceite:** valores exibidos pertencem à cidade selecionada; datas seguem o timezone retornado; campos `null` mostram indisponibilidade sem reaproveitar dados antigos.
- **Rastreabilidade:** FR-02, FR-03, AC-05 a AC-10, AC-14, AC-15, NFR-01/02/04.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/components/Forecast.tsx`.
- **Tipo:** UI.

### T-13 — Integrar alternância de temperatura

- **Descrição:** conectar o controle de unidade à apresentação derivada de Celsius/Fahrenheit.
- **Critérios de aceite:** Celsius é inicial; a troca atualiza todas as temperaturas visíveis sem nova chamada à API; rótulos °C/°F e arredondamento atendem AC-11/12; unidade dura somente até fechar ou recarregar a página.
- **Rastreabilidade:** FR-04, AC-11, AC-12, NFR-04.
- **Dependências:** T-06, T-10, T-12.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`, `src/components/CurrentWeather.tsx`, `src/components/Forecast.tsx`.
- **Tipo:** UI.

## Entrega 4 — Testes e validação

### T-14 — Testar funções puras

- **Descrição:** cobrir mapeamento, códigos WMO, datas, campos ausentes e conversão de temperatura com fixtures determinísticas.
- **Critérios de aceite:** testes incluem `0`, `100`, negativos, `null` e limites de arredondamento; cobrem códigos conhecidos/desconhecidos e datas locais; não dependem de rede ou React.
- **Rastreabilidade:** AC-02/03/06/07/10/11/12/15.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/lib/weatherMapper.test.ts`, `tests/unit/lib/weatherCode.test.ts`, `tests/unit/lib/temperature.test.ts`.
- **Tipo:** Test.

### T-15 — Testar serviços com fetch mockado

- **Descrição:** testar geocoding e forecast usando respostas controladas, sem chamar a API real.
- **Critérios de aceite:** cobrir URL/parâmetros, sucesso, lista vazia, parcial, erro de rede, HTTP/API, payload inválido, timeout e cancelamento; estados retornados correspondem ao contrato.
- **Rastreabilidade:** AC-04/08/09/10/13/15.
- **Dependências:** T-07, T-08.
- **Arquivos prováveis:** `tests/unit/services/openMeteoService.test.ts`.
- **Tipo:** Test.

### T-16 — Testar transições do hook

- **Descrição:** testar orquestração com serviços mockados e respostas concorrentes controladas.
- **Critérios de aceite:** cobrir loading/success/empty/error, seleção, retry com parâmetros preservados, descarte de resposta obsoleta e troca de unidade sem request novo.
- **Rastreabilidade:** AC-04/05/08/11/12/13.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`.
- **Tipo:** Test.

### T-17 — Testar componentes e acessibilidade

- **Descrição:** validar estados visuais e interação dos componentes com props e callbacks controlados.
- **Critérios de aceite:** busca cobre idle/loading/success/empty/error; clima cobre idle/loading/success/error, inclusive parcial; controles funcionam por teclado, têm foco visível e mensagens acessíveis.
- **Rastreabilidade:** AC-01/04/06/07/10/13/14, NFR-02.
- **Dependências:** T-11, T-12, T-13.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`, `tests/unit/components/CurrentWeather.test.tsx`, `tests/unit/components/Forecast.test.tsx`, `tests/unit/components/UnitToggle.test.tsx`.
- **Tipo:** Test.

### T-18 — Validar fluxos E2E e viewport mobile

- **Descrição:** cobrir o fluxo completo com Playwright e APIs interceptadas, incluindo apresentação em telas pequenas.
- **Critérios de aceite:** busca → seleção → clima/previsão e alternância de unidade passam; vazio, erro, retry, timeout e resposta obsoleta são testados; fluxo principal funciona a 320 px sem rolagem horizontal e também em 768/1280 px e retrato/paisagem.
- **Rastreabilidade:** US-01 a US-05, AC-01 a AC-15, NFR-01/02.
- **Dependências:** T-11, T-12, T-13, T-15, T-17.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.

### T-19 — Executar gates de entrega

- **Descrição:** verificar qualidade técnica e aprovações necessárias antes do go-live.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passam; decisões de T-03/T-04 e metas NFR-01/03/06 estão registradas como aprovadas ou como bloqueios de lançamento; nenhum teste depende da Open-Meteo real.
- **Rastreabilidade:** NFR-01, NFR-02, NFR-03, NFR-05, NFR-06.
- **Dependências:** T-03, T-04, T-14, T-15, T-16, T-17, T-18.
- **Arquivos prováveis:** `package.json`, `plans/weather-app-plan.md`, documentação operacional aprovada.
- **Tipo:** Infra.