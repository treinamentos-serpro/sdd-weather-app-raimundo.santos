# Weather App — Especificação de Produto

## Overview

Aplicação web de consulta meteorológica que permite pesquisar e selecionar uma cidade, consultar suas condições atuais e a previsão para cinco dias, e alternar a unidade de temperatura entre Celsius e Fahrenheit. A interface principal será em pt-BR e deve ser utilizável em dispositivos móveis e desktop.

**Objetivos da primeira versão**

- Ajudar o usuário a encontrar dados meteorológicos da cidade pretendida.
- Apresentar clima atual e uma previsão que cubra hoje e os quatro dias seguintes.
- Permitir interpretar temperaturas na unidade escolhida, com Celsius como padrão inicial.
- Comunicar estados de carregamento, ausência de resultados e falhas sem apresentar dados indisponíveis como atuais.

**Personas de referência (hipóteses a validar)**

- **Ana, que decide a rotina:** consulta o clima atual, principalmente pelo celular.
- **Caio, que planeja os próximos dias:** consulta a previsão para organizar atividades.
- **Lúcia, que prefere Fahrenheit:** precisa ler temperaturas na unidade com que está familiarizada.

**Fonte de dados definida:** Open-Meteo, sem API key. Cobertura, limites, atualização, licença e condições de uso ainda precisam ser confirmados.

## Functional Requirements

- **FR-01 — Buscar e selecionar uma cidade:** o usuário deve poder pesquisar uma cidade e selecionar o local desejado. Quando houver resultados que possam ser confundidos, eles devem fornecer contexto geográfico suficiente para apoiar a escolha correta. Critérios: AC-01 e AC-02.
- **FR-02 — Consultar o clima atual:** após a seleção de uma cidade, o sistema deve exibir as condições meteorológicas atuais disponíveis para esse local. Os campos exatos ainda dependem de decisão de produto. Critérios: AC-03 e AC-04.
- **FR-03 — Consultar previsão de cinco dias:** para a cidade selecionada, o sistema deve exibir a previsão para hoje e os quatro dias seguintes. A previsão diária ou horária e seus campos ainda dependem de decisão. Critérios: AC-03 e AC-05.
- **FR-04 — Alternar unidade de temperatura:** o usuário deve poder alternar entre Celsius e Fahrenheit; Celsius é a unidade inicial. A seleção deve ser aplicada consistentemente a todas as temperaturas exibidas. Critérios: AC-06 e AC-07.
- **FR-05 — Comunicar estados da consulta:** durante busca e carregamento meteorológico, o sistema deve indicar que a operação está em andamento. Se a busca não retornar cidades ou a consulta meteorológica falhar ou exceder o tempo limite, deve informar o estado sem apresentar a consulta como bem-sucedida. Critérios: AC-02, AC-04 e AC-08.

## User Stories

- **US-01 (FR-01):** Como Ana, que decide a rotina, quero pesquisar e selecionar uma cidade para consultar o clima do local correto.
- **US-02 (FR-02):** Como Ana, que decide a rotina, quero ver as condições atuais da cidade selecionada para decidir como me preparar para o dia.
- **US-03 (FR-03):** Como Caio, que planeja os próximos dias, quero ver a previsão de hoje e dos quatro dias seguintes para planejar atividades ou deslocamentos.
- **US-04 (FR-04):** Como Lúcia, que prefere Fahrenheit, quero alternar entre Celsius e Fahrenheit para entender as temperaturas sem conversão manual.
- **US-05 (FR-05):** Como Caio, que planeja os próximos dias, quero saber quando uma busca ou consulta está carregando, não encontrou dados ou falhou para entender o estado da consulta.

## Acceptance Criteria

- **AC-01 — Busca e seleção:** ao pesquisar uma cidade e escolher um resultado, o local escolhido fica identificado como a cidade consultada e é usado para carregar os dados meteorológicos.
- **AC-02 — Busca sem resultado ou ambígua:** uma busca sem correspondências apresenta um estado vazio compreensível; resultados com nomes potencialmente iguais apresentam contexto geográfico que permita distingui-los. Os campos exatos de contexto serão definidos em uma pergunta aberta.
- **AC-03 — Cidade consultada:** após selecionar um local, as informações meteorológicas exibidas são associadas a esse local, e não a outro resultado da busca.
- **AC-04 — Clima atual e carregamento:** enquanto os dados atuais estão sendo obtidos, há indicação de carregamento; quando a consulta conclui com sucesso, as condições atuais disponíveis são exibidas para a cidade selecionada. Se a consulta falhar ou exceder o tempo limite, uma mensagem de falha é exibida e dados indisponíveis não são apresentados como atuais.
- **AC-05 — Janela da previsão:** uma consulta bem-sucedida apresenta exatamente cinco datas locais consecutivas, começando em hoje e incluindo os quatro dias seguintes. A granularidade diária ou horária e o fuso horário a usar precisam ser definidos antes de detalhar a validação do conteúdo.
- **AC-06 — Unidade inicial:** na primeira consulta sem uma seleção anterior aplicável, as temperaturas são apresentadas em Celsius e identificadas como °C.
- **AC-07 — Alternância consistente:** ao selecionar Fahrenheit, todas as temperaturas visíveis passam a ser apresentadas em Fahrenheit e identificadas como °F; ao retornar para Celsius, todas passam a Celsius e °C. Nenhuma área de clima atual ou previsão permanece com a unidade anterior.
- **AC-08 — Estado de busca:** durante a busca, o sistema indica que está carregando; em falha ou timeout, informa que não foi possível concluir a busca e não trata a operação como resultado vazio bem-sucedido.
- **AC-09 — Idioma:** os textos da interface necessários para busca, estados e consulta meteorológica estão em pt-BR.

## Non-Functional Requirements

- **NFR-01 — Responsividade:** busca, seleção de cidade, informações meteorológicas e controle de unidade devem permanecer utilizáveis em telas móveis e desktop, sem conteúdo ou controles inacessíveis por causa do tamanho da tela. A matriz de viewports suportados ainda precisa ser definida.
- **NFR-02 — Acessibilidade:** funcionalidades essenciais devem ser operáveis por teclado, com foco perceptível e nomes/semântica acessíveis para controles e estados. O padrão e o nível de conformidade ainda precisam ser definidos.
- **NFR-03 — Consistência:** toda temperatura visível deve corresponder à unidade selecionada e ter indicação de unidade (AC-06 e AC-07).
- **NFR-04 — Clareza dos dados:** a interface deve identificar a cidade selecionada e não deve apresentar uma resposta ausente ou falha como dado meteorológico atual (AC-03 e AC-04).
- **NFR-05 — Desempenho e disponibilidade:** metas quantitativas para latência, atualização e disponibilidade não foram definidas e devem ser acordadas antes de serem usadas como critérios de liberação.
- **NFR-06 — Privacidade e minimização:** a primeira versão não requer conta nem persistência de dados no servidor. Qualquer coleta adicional, incluindo localização, histórico local ou métricas de uso, depende de decisão explícita sobre finalidade, consentimento e retenção.

## Edge Cases

- A busca não encontra nenhuma cidade correspondente.
- A busca retorna cidades homônimas ou locais geograficamente próximos com nomes semelhantes.
- A busca está vazia, contém apenas espaços ou não pode ser processada.
- O serviço de geocodificação ou meteorologia está indisponível, retorna erro ou excede o tempo limite.
- A fonte não retorna dados atuais ou não possui previsão para o local selecionado.
- Os dados retornados estão incompletos, atrasados ou não podem ser associados com segurança à cidade escolhida.
- A data da previsão muda conforme o fuso horário local, especialmente perto da meia-noite ou da mudança de data no dispositivo do usuário.
- O usuário alterna unidades durante o carregamento ou após uma atualização dos dados.
- A preferência de unidade não foi definida ou não pode ser restaurada; o comportamento persistente ainda é uma pergunta aberta.
- A viewport é estreita, a orientação muda ou o usuário amplia o conteúdo; controles e informações precisam continuar acessíveis conforme a matriz de suporte a definir.
- Uma resposta anterior permanece na tela enquanto uma nova cidade é consultada; deve ficar claro a qual local e estado ela pertence, sem ser apresentada como resultado novo.

## Assumptions

- A consulta é iniciada pelo usuário, que pesquisa e seleciona uma cidade manualmente.
- “Cinco dias” significa hoje mais os quatro dias seguintes.
- Celsius é a unidade padrão inicial; alternar para Fahrenheit deve atualizar as temperaturas mostradas.
- A experiência é uma aplicação web utilizável em dispositivos móveis. PWA e aplicativos nativos não estão definidos.
- A Open-Meteo é a fonte de dados escolhida para a primeira versão, sem API key; sua adequação operacional e suas condições de uso ainda serão verificadas.
- Não haverá autenticação nem persistência de dados no servidor na primeira versão.
- O idioma da interface é pt-BR; formatos regionais de data e hora ainda precisam ser definidos.
- As personas e suas métricas são hipóteses de discovery, não resultados de pesquisa com usuários.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Indisponibilidade, limite de requisições ou mudança na Open-Meteo | Média | Alto: clima atual e previsão podem não carregar. | Confirmar cobertura, limites, licença e condições de uso; tratar erro e timeout; monitorar falhas e decidir contingência. |
| Dados incompletos, atrasados ou inconsistentes | Média | Alto: decisões podem se basear em informação incorreta ou apresentada como atual. | Definir requisitos de cobertura e atualização; validar os dados e indicar sua atualização quando esse requisito for definido. |
| Seleção de cidade homônima ou imprecisa | Alta | Médio: o usuário pode consultar outro local. | Apresentar contexto geográfico suficiente e permitir seleção explícita; definir os campos de identificação. |
| Granularidade, campos e fuso da previsão indefinidos | Alta | Alto: conteúdo, interface e testes podem exigir retrabalho. | Decidir previsão diária ou horária, campos e regra de data local antes do plano técnico. |
| Conversão ou rótulo incorreto de unidade | Média | Alto: temperaturas podem ser interpretadas incorretamente. | Validar conversão, rótulos e consistência em clima atual e previsão com valores de referência. |
| Suporte inadequado a dispositivos ou tecnologias assistivas | Média | Alto: alguns usuários podem não conseguir consultar ou operar o app. | Definir matriz de suporte e critérios de acessibilidade; validar teclado, leitor de tela e viewports acordados. |
| Metas de qualidade e sucesso não definidas | Alta | Alto: não há critério objetivo para avaliar o produto ou priorizar melhorias. | Definir público, métricas de sucesso, metas de performance e disponibilidade com stakeholders. |
| Expectativa de recursos não confirmados | Média | Médio: usuários podem esperar alertas, geolocalização ou uso offline. | Comunicar o escopo da primeira versão e confirmar as expectativas nas perguntas abertas. |
| Coleta de localização, preferências ou métricas sem regras de privacidade | Baixa a média | Alto: risco de perda de confiança ou incompatibilidade com políticas aplicáveis. | Minimizar coleta e definir finalidade, consentimento, retenção e controles antes de introduzir esses recursos. |

## Out of Scope

Não fazem parte da primeira versão conforme as decisões disponíveis; qualquer inclusão depende de confirmação de produto:

- Cadastro, autenticação ou conta de usuário.
- Persistência de dados no servidor.
- Alertas de tempo severo ou notificações.
- Geolocalização automática ou solicitação de permissão de localização.
- Favoritos, histórico de cidades ou sincronização entre dispositivos.
- Funcionamento offline ou apresentação de dados em cache como se fossem atuais.
- Aplicativos nativos ou instalação como PWA.
- Métricas de uso ou coleta de dados pessoais não aprovadas.

## Open Questions

1. Quem são os usuários prioritários e quais situações de uso devem orientar as prioridades? Quais métricas de negócio ou sucesso serão usadas?
2. Alertas de tempo severo fazem parte do produto futuro ou a aplicação se limita a condições atuais e previsão regular?
3. Quais países e regiões a busca deve cobrir? Como será a interação de busca (texto livre, sugestões enquanto digita ou outra) e quais campos geográficos identificam cada resultado?
4. Qual deve ser o comportamento após busca sem resultado, falha ou timeout, além da mensagem de estado? Deve haver ação de tentar novamente?
5. A seleção será exclusivamente manual ou haverá cidade padrão, geolocalização, histórico ou favoritos?
6. Quais campos meteorológicos devem aparecer no clima atual e em cada dia da previsão? A previsão será diária ou horária?
7. Qual fuso horário define as datas da previsão e o limite de cada dia? Como datas e horários devem ser formatados em pt-BR?
8. Com que frequência os dados devem ser atualizados e qual idade máxima é aceitável? A interface deve mostrar horário da última atualização?
9. A troca de unidade afeta apenas temperatura? Quais unidades e convenções serão usadas para vento, precipitação e outros campos, se exibidos?
10. A unidade escolhida deve persistir entre visitas ou dispositivos? Se sim, onde e por quanto tempo?
11. “Usável em dispositivos móveis” significa site responsivo, PWA, aplicativo nativo ou combinação? Quais tamanhos de tela, sistemas, navegadores e orientações precisam de suporte?
12. Qual padrão e nível de acessibilidade devem ser atendidos? Quais tecnologias assistivas e critérios de teste serão considerados?
13. Quais são as metas de performance para busca e carregamento e a disponibilidade esperada? Qual resposta degradada é aceitável quando a fonte falha?
14. É necessário funcionar sem conexão ou exibir dados armazenados anteriormente? Se sim, qual validade e como sua idade será comunicada?
15. A Open-Meteo atende à cobertura, atualização, licença, custo e volume de requisições esperados? Quais limites e condições operacionais se aplicam?
16. Além de conta e persistência de servidor, haverá armazenamento local, telemetria ou coleta de localização? Para qual finalidade, por quanto tempo e sob quais controles de privacidade e segurança?
17. Quem será responsável após o lançamento por monitorar falhas, limites da fonte e qualidade dos dados?