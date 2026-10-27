# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicita uma aplicação de previsão do tempo para que usuários consultem informações meteorológicas de cidades. A experiência deve permitir a busca de cidades, a consulta do clima atual e da previsão para cinco dias, além da alternância entre Celsius e Fahrenheit. O uso em dispositivos móveis faz parte do escopo.

## Requisitos Funcionais

- **RF1 — Buscar cidades:** permitir que o usuário pesquise uma cidade e selecione o local desejado.
- **RF2 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF3 — Consultar previsão:** exibir a previsão do tempo para cinco dias da cidade selecionada.
- **RF4 — Alternar unidades:** permitir alternar entre Celsius e Fahrenheit e atualizar os valores de temperatura exibidos.

## Requisitos Não-Funcionais

- **RNF1 — Uso em dispositivos móveis:** a aplicação deve ser utilizável em dispositivos móveis, com conteúdo e controles adaptados a telas menores.
- **RNF2 — Consistência das unidades:** os valores de temperatura devem corresponder à unidade selecionada em todas as áreas da aplicação.
- **RNF3 — Clareza de uso:** busca, informações meteorológicas e controle de unidade devem ser compreensíveis e acessíveis durante o uso em diferentes tamanhos de tela.

## Riscos

| Risco | Impacto potencial |
| --- | --- |
| Cidades com nomes iguais ou semelhantes | O usuário pode consultar a previsão de um local diferente do pretendido. |
| Indisponibilidade ou atraso na fonte de dados meteorológicos | Informações podem não carregar ou estar desatualizadas. |
| Definição ambígua do período de cinco dias | Usuários podem interpretar de forma diferente quais datas estão incluídas. |
| Conversão ou apresentação incorreta de unidades | A temperatura exibida pode induzir o usuário a uma interpretação errada. |
| Layout ou controles inadequados em telas móveis | A consulta pode ficar difícil em dispositivos que fazem parte do escopo. |

## Perguntas em Aberto

1. Qual fonte de dados meteorológicos será utilizada e quais são seus limites de disponibilidade e atualização?
2. Como o usuário deve distinguir cidades homônimas (por exemplo, por estado, região ou país)?
3. Quais informações devem aparecer no clima atual e em cada dia da previsão?
4. Os cinco dias incluem o dia atual ou correspondem aos cinco dias seguintes?
5. Qual deve ser a unidade inicial: Celsius ou Fahrenheit? A escolha deve ser mantida entre visitas?
6. Quais idiomas, regiões e formatos de data devem ser suportados?
7. Há metas de desempenho, requisitos de acessibilidade ou navegadores e dispositivos mínimos a atender?
8. A aplicação deve oferecer recursos adicionais, como geolocalização, cidades favoritas ou consulta sem conexão?

## Suposições

- A busca e a consulta de previsão são iniciadas pelo usuário para uma cidade escolhida.
- A alternância entre Celsius e Fahrenheit afeta os valores de temperatura; demais unidades meteorológicas, se exibidas, ainda precisam ser definidas.
- O serviço depende de uma fonte de dados externa ou interna que será definida posteriormente.
- O requisito de uso em dispositivos móveis implica uma interface adaptável, mas não define por si só suporte offline, instalação como aplicativo ou versões específicas de sistemas operacionais.
