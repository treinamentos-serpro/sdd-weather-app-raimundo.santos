# Weather App — Plano Técnico

## Architecture

Aplicação SPA estática em React, sem backend próprio. A UI coordena busca, seleção, consulta meteorológica e unidade; uma camada de serviço encapsula Open-Meteo e converte respostas externas para tipos de domínio. Um módulo puro converte temperaturas para apresentação.

```text
React UI
  └── estado da tela (busca, local selecionado, clima, unidade)
       ├── Geocoding Service ── Open-Meteo Geocoding API
       └── Weather Service ──── Open-Meteo Forecast API
```

Ao selecionar outra cidade, invalidar solicitações meteorológicas anteriores e limpar os dados exibidos até a resposta da nova seleção. Sem cache, persistência de usuário ou retry automático na primeira versão (AC-04, AC-05, AC-08, AC-13; NFR-05).

## Tech Stack

| Área | Decisão | Rastreabilidade |
| --- | --- | --- |
| UI | React 19 + TypeScript strict | Stack do projeto; FR-01 a FR-05 |
| Build/dev server | Vite | Configuração existente; execução estática e build para GitHub Pages |
| Estilo | Tailwind CSS | Stack e tema definidos nas instruções do projeto; NFR-01 |
| Estado | Hooks nativos React (`useState`, `useEffect`) | Cinco stories em uma SPA pequena; evita estado global e dependências adicionais |
| Testes | Vitest + Testing Library + Playwright | Configuração existente; AC-01 a AC-15 e NFR-01/02 |
| Lint/format | Biome | Scripts já definidos no `package.json` |
| Pacotes | pnpm | `packageManager` definido no projeto |

Não adicionar biblioteca de estado, cliente HTTP ou cache nesta etapa: `fetch`, hooks React e as dependências já instaladas cobrem o escopo.

## Project Structure

```text
src/
  components/
    CitySearch.tsx        # entrada, resultados, estados de busca
    CurrentWeather.tsx    # clima atual e estado da seção
    Forecast.tsx          # cinco dias e estado da seção
    UnitToggle.tsx        # Celsius/Fahrenheit
  hooks/
    useWeatherApp.ts      # estado e ações da tela
  services/
    openMeteoService.ts   # chamadas HTTP e validação de respostas
    weatherMapper.ts      # conversão de payload externo para domínio
  types/
    weather.ts            # contratos de cidade, clima, previsão e estado
  lib/
    temperature.ts        # conversão e arredondamento de temperatura
tests/
  unit/                   # Vitest e Testing Library
  e2e/                    # Playwright
```

Responsabilidades seguem a convenção do projeto: UI em `components/`, dados em `services/`, lógica reutilizável em `hooks/`, tipos compartilhados em `types/` e funções puras em `lib/`.

## Data Model

Contratos de domínio propostos; não são a estrutura bruta da API.

```ts
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface City {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timeZone?: string;
}

export interface WeatherCondition {
  code: number;
  labelPtBr: string;
}

export interface CurrentWeather {
  temperatureCelsius: number | null;
  condition: WeatherCondition | null;
}

export interface ForecastDay {
  localDate: string; // YYYY-MM-DD no fuso da cidade
  temperatureCelsius: number | null;
  condition: WeatherCondition | null;
}

export interface WeatherData {
  city: City;
  timeZone: string | null;
  current: CurrentWeather;
  days: ForecastDay[]; // cinco posições, mesmo quando algum campo está indisponível
}

export type RequestErrorKind = 'network' | 'http' | 'timeout' | 'invalid-response';

export interface RequestError {
  kind: RequestErrorKind;
  message: string; // mensagem de UI localizada em pt-BR
}

export type AsyncState<T> =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; error: RequestError };
```

`City.id` deve identificar unicamente o resultado selecionável; usar o identificador do provedor quando disponível e uma chave estável baseada na identidade geográfica quando não estiver. Campos opcionais não devem ser inventados. `WeatherData.days` contém as cinco datas locais esperadas; valores ausentes são `null` conforme AC-10. A decisão sobre qual estatística de temperatura diária usar (máxima, mínima ou média) está bloqueada pela spec e deve ser resolvida antes de fechar o contrato da API (AC-07, Open Question 2 e 6).

## Data Flow

1. A tela mantém o texto digitado. No envio, remove espaços externos; string vazia não chama serviço (AC-01/02).
2. `openMeteoService.searchCities(query)` consulta geocoding e `weatherMapper` normaliza os resultados para `City`. Lista vazia vira estado `empty`, distinto de `error` (AC-03/04).
3. Selecionar um resultado atualiza a cidade selecionada, limpa clima anterior e inicia a consulta usando latitude/longitude daquele `City` (AC-05).
4. `openMeteoService.getWeather(city)` solicita clima atual e previsão diária; o mapper normaliza unidades para Celsius, códigos meteorológicos e datas locais.
5. A resposta só atualiza a tela se ainda corresponder à seleção vigente. Solicitações de seleções substituídas são abortadas ou ignoradas (AC-05, NFR-04).
6. A UI apresenta temperaturas convertidas pela unidade em estado. A troca de unidade não refaz a consulta; a preferência dura até fechar ou recarregar a página (AC-11/12).
7. Mensagens e rótulos de condição são apresentados em pt-BR (AC-06/07/14).

## External APIs

Sem API key. Encapsular URLs e payloads exclusivamente em `openMeteoService.ts`.

| Serviço | Endpoint e parâmetros | Contrato usado |
| --- | --- | --- |
| Geocoding | `https://geocoding-api.open-meteo.com/v1/search`; `name=<query>&count=10&language=pt&format=json` | Mapear identificador, `name`, `latitude`, `longitude`, `admin1`, `country`, `country_code` e `timezone` quando presentes. Campos geográficos opcionais continuam opcionais no domínio (AC-02/03). |
| Forecast | `https://api.open-meteo.com/v1/forecast`; `latitude`, `longitude`, `current=temperature_2m,weather_code`, `daily=weather_code,<daily_temperature_field>`, `temperature_unit=celsius`, `timezone=auto`, `forecast_days=5` | `current` alimenta `CurrentWeather`; `daily` alimenta cinco `ForecastDay`; `timezone` fornece o fuso local (AC-06/07/15). |

`<daily_temperature_field>` é intencionalmente um marcador, não um parâmetro a enviar: substituir pelo campo de temperatura diária aprovado (máxima, mínima ou média) antes de implementar. Validar formato e códigos de clima no mapper; payload malformado vira `invalid-response`, e campo ausente vira `null` (AC-08/10). Confirmar cobertura, limites, atribuição e termos da Open-Meteo antes do go-live (Risks & Trade-offs).

## State Management

Manter estado local no hook `useWeatherApp`; sem Redux, Context global ou cache.

| Estado | Tipo proposto | Regra |
| --- | --- | --- |
| Texto de busca | `string` | Controlado pela UI; trim somente no envio |
| Busca | `AsyncState<City[]>` | `empty` representa resposta bem-sucedida sem resultados |
| Cidade selecionada | `City | null` | Só muda após seleção explícita |
| Clima | `AsyncState<WeatherData>` | Limpar ao selecionar cidade diferente |
| Unidade | `TemperatureUnit` | Inicial `celsius`; permanece na página atual |

Busca e clima têm estados independentes. Retry é ação explícita e repete os mesmos parâmetros. Não guardar termo, cidade ou unidade em localStorage/servidor (AC-04, AC-11, AC-13; NFR-05).

## Error Handling

- Input vazio: validação local, sem request e mensagem orientadora (AC-01).
- Geocoding bem-sucedido sem resultados: `empty`; preservar cidade/dados já selecionados e não iniciar forecast (AC-04).
- Rede, HTTP ou payload inválido: `error` com tipo distinguível para telemetria operacional; UI em pt-BR com ação de retry (AC-08).
- Timeout: 10 s por solicitação, sem retry automático; encerrar loading e oferecer retry manual (AC-09/13).
- Falha de weather para cidade recém-selecionada: manter a identidade da nova cidade, não restaurar dados da seleção anterior e apresentar erro (AC-05/08).
- Payload parcial: mapear campo ausente para `null`; mostrar “indisponível” no lugar do valor, mantendo os demais valores válidos (AC-10).
- Fuso ausente/inválido: não usar fuso do dispositivo; previsão em estado indisponível (AC-15).
- Respostas de seleção anterior: abortar quando possível e sempre impedir que sobrescrevam a seleção mais recente (AC-05).

## Testing Strategy

- **Vitest — unitários:** testar trim de busca e vazio (AC-01/02), mapeamento de geocoding e identidade de cidade (AC-03/05), mapping de códigos para pt-BR, payloads completos/parciais/inválidos (AC-06/08/10), cinco datas locais/fuso ausente (AC-07/15) e conversão/arredondamento nos valores de referência (AC-11/12).
- **Testing Library — componentes:** testar estados idle/loading/success/empty/error, mensagens acessíveis e retry sem chamadas automáticas; testar teclado/foco para controles (AC-01, AC-04, AC-08/09, AC-13; NFR-02).
- **Playwright — E2E:** cobrir busca → seleção → clima e previsão, alternância de unidade, busca vazia/sem resultados, falha e timeout com APIs interceptadas e fixtures determinísticas (US-01 a US-05; AC-01 a AC-15).
- **Viewports:** validar os fluxos essenciais em 320, 768 e 1280 px e retrato/paisagem (NFR-01); manter Chromium desktop e projeto mobile já configurados como base.
- **Rede:** nenhum teste automatizado depende de disponibilidade real da Open-Meteo. Manter fixtures de contrato derivadas de respostas documentadas e um smoke check externo separado apenas se o pipeline permitir acesso à rede.
- **Metas:** lint, build e `pnpm test`; E2E com `pnpm test:e2e`. A medição de Core Web Vitals p75 exige ambiente de coleta e amostra real; não é comprovada por teste unitário (NFR-03).

## Risks & Trade-offs

| Risco/decisão | Efeito | Mitigação ou trade-off |
| --- | --- | --- |
| Provedor externo sem SLA da aplicação | Busca ou clima podem ficar indisponíveis | Timeout, erro distinguível, retry manual e monitoramento; sem fallback/cache na primeira versão (AC-08/09; NFR-06). |
| Campo diário de temperatura ainda não aprovado | Contrato e fixture do forecast não podem ser fechados | Bloqueia a implementação do endpoint de forecast até decidir máxima, mínima ou média (AC-07; Open Questions 2 e 6). |
| Código de condição sem mapeamento validado | Rótulo pt-BR pode ficar incorreto ou incompleto | Validar tabela de códigos, idioma e fallback antes dos testes de contrato (AC-06/07; Open Question 6). |
| Chamadas diretas do browser à Open-Meteo | Simplicidade e sem custo de backend, mas dependência de rede/termos do provedor | Confirmar CORS, limites, cobertura, licença e atribuição antes do lançamento; não há segredo de API a proteger. |
| Sem cache nem persistência | Dados podem ser solicitados novamente após reload; preferência reinicia em Celsius | Evita dados expirados e armazenamento não especificado; alinhado a AC-11 e NFR-05. |
| Baselines de performance e suporte ainda sujeitos a aprovação | Não há gate de lançamento final | Tratar timeout, WCAG, viewports, Core Web Vitals e SLA como baselines até aprovação (NFR-01/03/06; Open Questions 3/4). |