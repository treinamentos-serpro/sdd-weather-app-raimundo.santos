# Weather App — Especificação de Produto

## Overview

Aplicação web em pt-BR para pesquisar uma cidade, consultar clima atual e previsão diária de hoje mais quatro dias e alternar temperaturas entre Celsius e Fahrenheit. A primeira versão é sem conta, com seleção manual de local e uso em dispositivos móveis e desktop.

Personas de referência, ainda a validar: Ana (consulta o clima atual na rotina), Caio (planeja os próximos dias) e Lúcia (prefere Fahrenheit). Fonte meteorológica escolhida: Open-Meteo, sem API key; sua cobertura e condições de uso precisam ser aprovadas antes do lançamento.

## Functional Requirements

- **FR-01 — Buscar e selecionar cidade:** aceitar uma busca manual enviada pelo usuário, apresentar resultados identificáveis e permitir selecionar um local. Critérios: AC-01 a AC-05.
- **FR-02 — Consultar clima atual:** para o local selecionado, exibir temperatura, condição meteorológica, umidade, velocidade do vento, precipitação e pressão, com local e unidades identificados. Critérios: AC-05, AC-06, AC-08 e AC-10.
- **FR-03 — Consultar previsão:** exibir uma previsão diária para hoje e os quatro dias seguintes, segundo as datas locais do local selecionado. Critérios: AC-05, AC-07, AC-08, AC-10 e AC-15.
- **FR-04 — Alternar unidade:** permitir alternar entre Celsius e Fahrenheit; usar Celsius como padrão e aplicar a seleção a todas as temperaturas visíveis. Critérios: AC-11 e AC-12.
- **FR-05 — Comunicar estados:** indicar carregamento, ausência de resultados, falha e timeout de forma distinta; permitir tentativa manual após falha. Critérios: AC-01, AC-04, AC-08, AC-09 e AC-13.

## User Stories

- **US-01 (FR-01):** Como Ana, que decide a rotina, quero pesquisar e selecionar uma cidade para consultar o clima do local correto.
- **US-02 (FR-02):** Como Ana, que decide a rotina, quero consultar as condições atuais para decidir como me preparar para o dia.
- **US-03 (FR-03):** Como Caio, que planeja os próximos dias, quero ver a previsão de hoje e dos quatro dias seguintes para planejar atividades.
- **US-04 (FR-04):** Como Lúcia, que prefere Fahrenheit, quero alternar a unidade de temperatura para entender os valores sem conversão manual.
- **US-05 (FR-05):** Como Caio, que planeja os próximos dias, quero distinguir carregamento, ausência de resultados e falha para saber se devo tentar novamente.

## Traceability Matrix

| User Story | Acceptance Criteria | Requisitos não funcionais relevantes |
| --- | --- | --- |
| US-01 — Pesquisar e selecionar cidade | AC-01 a AC-05, AC-08, AC-09, AC-13, AC-14 | NFR-01 responsividade; NFR-02 acessibilidade; NFR-03 desempenho; NFR-04 integridade/local selecionado; NFR-05 privacidade da busca; NFR-06 operação da API |
| US-02 — Consultar clima atual | AC-05, AC-06, AC-08 a AC-10, AC-13, AC-14 | NFR-01 responsividade; NFR-02 acessibilidade; NFR-03 desempenho; NFR-04 integridade e unidade; NFR-06 operação da API |
| US-03 — Consultar previsão de cinco dias | AC-05, AC-07 a AC-10, AC-13 a AC-15 | NFR-01 responsividade; NFR-02 acessibilidade; NFR-03 desempenho; NFR-04 integridade, unidade e local; NFR-06 operação da API |
| US-04 — Alternar Celsius/Fahrenheit | AC-11, AC-12, AC-14 | NFR-01 responsividade; NFR-02 acessibilidade; NFR-04 consistência de unidade |
| US-05 — Entender carregamento, vazio e falha | AC-01, AC-04, AC-08, AC-09, AC-13, AC-14 | NFR-01 responsividade; NFR-02 acessibilidade; NFR-03 desempenho/timeout; NFR-06 operação e monitoramento |

## Acceptance Criteria

- **AC-01 (FR-01, FR-05) — Busca vazia e envio:**
  - **Given** que o campo de busca está vazio ou contém somente espaços
  - **When** o usuário envia a busca
  - **Then** nenhuma solicitação de geocodificação é feita e a interface informa que uma cidade deve ser digitada
- **AC-02 (FR-01) — Caracteres e normalização:**
  - **Given** que o usuário informa um nome com acentos, espaços internos, hífen ou apóstrofo
  - **When** envia a busca, com ou sem espaços externos
  - **Then** os espaços externos são removidos, os caracteres internos são preservados e o nome retornado pela fonte é mostrado no resultado
- **AC-03 (FR-01) — Identificação do resultado:**
  - **Given** que a geocodificação retorna resultados homônimos
  - **When** os resultados são exibidos
  - **Then** cada resultado mostra cidade, região administrativa e país quando fornecidos pela fonte; campos indisponíveis não são inventados
- **AC-04 (FR-01, FR-05) — Nenhum resultado:**
  - **Given** que a geocodificação termina com sucesso e retorna uma lista vazia
  - **When** a interface apresenta a resposta
  - **Then** informa que nenhum resultado foi encontrado, não inicia consulta meteorológica e mantém a cidade e os dados previamente selecionados inalterados
- **AC-05 (FR-01, FR-02, FR-03) — Seleção e identidade do local:**
  - **Given** que resultados de busca estão disponíveis
  - **When** o usuário seleciona um resultado
  - **Then** a identidade exibida do local corresponde ao resultado escolhido, dados meteorológicos anteriores são removidos durante o novo carregamento e as consultas usam as coordenadas desse resultado
- **AC-06 (FR-02) — Clima atual:**
  - **Given** que a consulta do local selecionado retorna temperatura, código/condição, umidade, velocidade do vento, precipitação e pressão válidos
  - **When** o carregamento termina
  - **Then** temperatura, condição traduzida para pt-BR, umidade, velocidade do vento, precipitação e pressão são exibidas junto ao local selecionado, cada medida com sua unidade
- **AC-07 (FR-03) — Previsão diária:**
  - **Given** que há previsão válida e fuso horário para o local selecionado
  - **When** a previsão é exibida
  - **Then** há cinco datas locais consecutivas em ordem cronológica, começando hoje, cada uma com temperatura e condição traduzida para pt-BR
- **AC-08 (FR-05) — Falha de serviço:**
  - **Given** que geocodificação ou meteorologia retorna erro de rede, resposta HTTP de erro ou conteúdo inválido
  - **When** a operação termina
  - **Then** o carregamento termina, um estado de falha distinto de “nenhum resultado” é exibido e há uma ação para tentar novamente; consulta meteorológica malsucedida não mostra dados da seleção anterior
- **AC-09 (FR-05) — Timeout:**
  - **Given** que uma solicitação de busca ou meteorologia permanece pendente
  - **When** 10 segundos se passam sem resposta
  - **Then** a solicitação termina, o carregamento é encerrado e a interface mostra falha com ação para tentar novamente, sem classificá-la como ausência de resultados
- **AC-10 (FR-02, FR-03) — Resposta parcial:**
  - **Given** que uma resposta meteorológica válida omite temperatura ou condição em um período
  - **When** clima atual ou previsão é exibido
  - **Then** o campo recebido é mostrado, o campo ausente é identificado como indisponível e nenhum valor é inferido; uma data sem dados permanece identificada e marcada como indisponível
- **AC-11 (FR-04) — Unidade inicial e escopo:**
  - **Given** que a página é carregada ou recarregada completamente
  - **When** temperaturas são exibidas
  - **Then** todas estão em Celsius, identificadas por °C; após uma troca de unidade, a escolha permanece consistente durante a página aberta, inclusive ao consultar outra cidade, e volta a Celsius após recarga completa
- **AC-12 (FR-04) — Conversão:**
  - **Given** que as temperaturas visíveis estão em Celsius
  - **When** o usuário seleciona Fahrenheit
  - **Then** todas as temperaturas atuais e da previsão passam para °F usando $F = C \times 9/5 + 32$, arredondadas ao inteiro mais próximo, com metade arredondada para longe de zero; 0 °C resulta em 32 °F e 100 °C em 212 °F
  - **When** o usuário seleciona Celsius
  - **Then** todas as temperaturas retornam aos valores Celsius correspondentes e são identificadas por °C
- **AC-13 (FR-05) — Carregamento e retry:**
  - **Given** que uma busca ou consulta meteorológica foi enviada
  - **When** não há resposta terminal
  - **Then** há indicação visível de carregamento associada à operação; após falha, retry repete a mesma operação e mantém o termo/local associado
- **AC-14 — Idioma:**
  - **Given** que a interface está carregada
  - **When** textos de busca, estados, datas e condições são apresentados
  - **Then** os textos estão em pt-BR e as datas da previsão seguem o fuso do local selecionado
- **AC-15 (FR-03) — Fuso ausente:**
  - **Given** que a fonte não fornece um fuso horário válido para o local
  - **When** a previsão é solicitada
  - **Then** a previsão não usa o fuso do dispositivo nem é exibida como se fosse local; é mostrado um estado de indisponibilidade da previsão

## Non-Functional Requirements

- **NFR-01 — Responsividade:** os fluxos essenciais devem funcionar sem rolagem horizontal nas larguras de 320, 768 e 1280 px, em orientação retrato e paisagem.
- **NFR-02 — Acessibilidade:** atender WCAG 2.2 nível AA; todos os controles devem ser operáveis por teclado, ter foco visível, nome acessível e estado de carregamento/erro anunciado por tecnologia assistiva.
- **NFR-03 — Desempenho do cliente:** como metas iniciais, Core Web Vitals no percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1. Solicitações de dados obedecem ao timeout de 10 s de AC-09.
- **NFR-04 — Consistência e integridade:** cada medida tem unidade explícita; dados meteorológicos devem permanecer associados ao local selecionado e a uma resposta válida.
- **NFR-05 — Privacidade:** sem conta, geolocalização automática ou persistência de dados no servidor. Não coletar telemetria nem armazenar termos de busca além da sessão sem aprovação de finalidade, retenção e aviso ao usuário.
- **NFR-06 — Operação:** a Open-Meteo é dependência externa sem disponibilidade garantida pela aplicação; erros e timeouts devem ser distinguíveis de resultados vazios e monitoráveis. SLA, canal de suporte e responsável operacional precisam ser definidos antes do lançamento.

## Edge Cases

- **Cidade inexistente / geocoding vazio:** tratar como ausência de correspondência; não afirmar que a cidade inexiste. Não iniciar consulta meteorológica nem alterar a seleção anterior (AC-04).
- **Input vazio ou espaços externos:** impedir chamada quando vazio; remover somente espaços externos antes de pesquisar (AC-01 e AC-02).
- **Caracteres especiais:** preservar caracteres internos do nome, inclusive acentos, hífen e apóstrofo (AC-02).
- **Falha de API ou payload inválido:** encerrar carregamento, preservar termo/local associado, mostrar erro e permitir retry; não mostrar dados antigos como novos (AC-08 e AC-13).
- **Timeout:** após 10 s, finalizar o estado pendente e oferecer retry (AC-09).
- **Resposta parcial:** mostrar campos disponíveis, sinalizar os ausentes e manter a data identificada sem criar valores (AC-10).
- **Fuso ausente:** não substituir pelo fuso do dispositivo; não apresentar datas possivelmente incorretas (AC-15).
- **Troca de cidade durante carregamento:** uma nova seleção invalida a resposta pendente anterior; somente dados da seleção mais recente podem substituir o estado de carregamento (AC-05).

## Assumptions

- A busca é manual e enviada pelo usuário; não há busca automática enquanto digita.
- “Cinco dias” significa hoje e os quatro dias locais seguintes; a previsão é diária, não horária.
- Celsius é padrão; a unidade escolhida só dura enquanto a página atual estiver aberta.
- A condição meteorológica da fonte pode ser mapeada para um rótulo em pt-BR.
- O timeout de 10 s, viewports de referência, WCAG 2.2 AA e metas de Core Web Vitals são baselines propostos e exigem aprovação antes do lançamento.
- Personas são hipóteses, não resultados de pesquisa com usuários.

## Risks

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Cobertura, limites, licença ou disponibilidade da Open-Meteo incompatíveis com o uso | Dados indisponíveis ou lançamento não autorizado | Confirmar termos, cobertura e volume previstos antes do lançamento; monitorar falhas e definir contingência. |
| Dados desatualizados ou incompletos | Informação meteorológica enganosa | Definir SLA de atualização com base na fonte; sinalizar indisponibilidade e nunca completar dados ausentes por inferência. |
| Resultado geográfico ambíguo | Consulta para cidade errada | Mostrar contexto retornado e manter seleção explícita; validar cidades homônimas. |
| Metas operacionais não aprovadas | Não há critério objetivo de prontidão | Aprovar metas, responsável de operação e canal de suporte antes do go-live. |

## Out of Scope

- Contas, autenticação e persistência de servidor.
- Geolocalização automática, cidade padrão, favoritos e histórico.
- Alertas, notificações e funcionamento offline.
- Aplicativos nativos e instalação PWA.
- Previsão horária e campos meteorológicos além de temperatura, condição, umidade, velocidade do vento, precipitação e pressão.
- Telemetria ou coleta de dados pessoais sem aprovação específica.

## Open Questions

Itens bloqueadores ou que precisam de aprovação antes do lançamento:

1. A Open-Meteo cobre os países/regiões desejados e permite o uso, tráfego e atribuição pretendidos? Quais limites e termos aplicam-se?
2. Qual é a frequência de atualização e idade máxima aceitável dos dados? A interface deve mostrar horário da última atualização?
3. Qual matriz de navegadores, sistemas operacionais e dispositivos, além dos viewports de referência, será suportada?
4. As metas propostas de timeout, WCAG e Core Web Vitals são aprovadas? Qual disponibilidade e canal de suporte serão prometidos?
5. Quais requisitos corporativos de segurança, privacidade, retenção ou aviso legal se aplicam?
6. Quem valida o mapeamento dos códigos meteorológicos da fonte para descrições em pt-BR?
7. Há métricas de negócio ou sucesso para avaliar a primeira versão e quem é responsável por acompanhá-las?