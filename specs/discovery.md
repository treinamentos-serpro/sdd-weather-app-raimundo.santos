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

O briefing define capacidades gerais, mas não os critérios de conteúdo, operação e sucesso necessários para fechar o escopo. Para cada pergunta, o impacto abaixo descreve o risco de avançar sem uma decisão.

### Produto e público

1. **Quem são os usuários prioritários e em que situações consultarão o app?** Impacto: sem conhecer o público e suas tarefas, não é possível priorizar informações, fluxos ou critérios de sucesso.
2. **Qual resultado de negócio define o sucesso do produto e como será medido?** Impacto: a equipe pode entregar funcionalidades sem saber se resolvem a necessidade da empresa ou dos usuários.
3. **Alertas de tempo severo fazem parte do escopo ou o produto cobre apenas condições atuais e previsão regular?** Impacto: usuários podem esperar avisos críticos que não existem, e alertas exigem fontes, regras e responsabilidades adicionais.

### Busca e localização

4. **Quais países ou regiões devem ser cobertos pela busca?** Impacto: a cobertura geográfica e a qualidade dos resultados podem não atender ao público esperado.
5. **Como o usuário pesquisa e seleciona uma cidade: texto livre, sugestões enquanto digita ou outra interação?** Impacto: a equipe pode implementar um fluxo inadequado, especialmente em telas pequenas.
6. **Quais informações identificam uma cidade nos resultados, como estado, região ou país, e como tratar homônimos?** Impacto: o usuário pode selecionar um local incorreto e receber dados irrelevantes.
7. **O que deve ocorrer quando não há resultados, a busca falha ou o serviço está indisponível?** Impacto: não será possível definir estados vazios, mensagens ou recuperação, deixando o usuário sem orientação.
8. **A seleção de cidade é sempre manual ou são esperadas geolocalização, cidade padrão, histórico ou favoritos?** Impacto: decisões sobre permissões, persistência, privacidade e escopo podem surgir tarde e alterar a arquitetura.

### Informações meteorológicas

9. **Quais campos devem aparecer no clima atual e em cada dia da previsão?** Impacto: conteúdo, layout, fonte de dados e critérios de aceite permanecem indefinidos.
10. **O que significa “previsão de 5 dias”: inclui hoje ou os cinco dias completos seguintes?** Impacto: datas, quantidade de itens e expectativas do usuário podem divergir.
11. **A previsão deve ser diária ou incluir intervalos horários?** Impacto: muda substancialmente a quantidade de dados, a interface e possivelmente o custo de acesso à fonte.
12. **Qual fuso horário e limite de dia serão usados para apresentar datas e condições locais?** Impacto: dias da previsão podem aparecer deslocados, sobretudo para usuários em outro fuso.
13. **Com que frequência os dados devem ser atualizados e qual idade máxima ainda é aceitável?** Impacto: sem esse limite, dados desatualizados podem ser apresentados como atuais e não há critério para cache.
14. **A alternância Celsius/Fahrenheit se aplica somente à temperatura? Quais unidades serão usadas para vento, precipitação e outros campos, se exibidos?** Impacto: usuários podem ver unidades inconsistentes ou não compreender os valores.
15. **Qual unidade deve ser selecionada inicialmente e a preferência deve persistir entre visitas ou dispositivos?** Impacto: a experiência inicial e as regras de armazenamento ficam sujeitas a interpretações diferentes.

### Plataforma e qualidade

16. **“Usar em dispositivos móveis” significa um site responsivo, um app instalável (PWA), aplicativos nativos ou mais de uma opção?** Impacto: a decisão muda tecnologia, distribuição, custo e o que significa considerar a experiência mobile atendida.
17. **Quais tamanhos de tela, sistemas operacionais, navegadores e orientações devem ser suportados?** Impacto: não há uma matriz objetiva de compatibilidade para design e testes.
18. **Qual padrão ou nível de acessibilidade deve ser atendido?** Impacto: acessibilidade pode ser aplicada de modo inconsistente e ser descoberta tarde, quando corrigir controles e estrutura é mais caro.
19. **Quais são as metas de performance para busca e carregamento das informações?** Impacto: não há critério para avaliar lentidão nem para decidir sobre otimização ou cache.
20. **Qual disponibilidade é esperada e o que deve acontecer quando a fonte de dados falhar?** Impacto: não é possível definir metas de confiabilidade, degradação, mensagens ou contingência.
21. **O app deve funcionar sem conexão ou exibir dados armazenados anteriormente?** Impacto: suporte offline altera armazenamento, política de validade e como comunicar a idade dos dados.
22. **Quais idiomas, formatos de data/hora e convenções regionais serão necessários?** Impacto: textos, unidades, datas e formatos podem não corresponder à localização dos usuários.

### Dados, privacidade e operação

23. **Qual fonte de dados será usada e quais são seus limites de cobertura, atualização, licença, custo e requisições?** Impacto: a solução pode exceder limites, não cobrir regiões necessárias ou não ser viável para distribuição.
24. **A aplicação coletará localização, histórico de busca, preferências ou métricas de uso? Por quanto tempo e para qual finalidade?** Impacto: sem definição, privacidade, consentimento, retenção e requisitos legais ficam sem tratamento adequado.
25. **Existem requisitos de segurança, retenção de dados ou políticas corporativas que precisam ser atendidos?** Impacto: restrições descobertas tardiamente podem exigir mudanças no desenho e atrasar a entrega.
26. **Quem será responsável por monitorar falhas, limites da fonte e qualidade dos dados após o lançamento?** Impacto: problemas de produção podem ficar sem detecção ou sem responsável por resolvê-los.

## Suposições

- A busca e a consulta de previsão são iniciadas pelo usuário para uma cidade escolhida.
- A alternância entre Celsius e Fahrenheit afeta os valores de temperatura; demais unidades meteorológicas, se exibidas, ainda precisam ser definidas.
- O serviço depende de uma fonte de dados externa ou interna que será definida posteriormente.
- O requisito de uso em dispositivos móveis implica uma interface adaptável, mas não define por si só suporte offline, instalação como aplicativo ou versões específicas de sistemas operacionais.
