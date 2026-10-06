# MAFRA.ON — Contexto do Projeto

ERP condominial proprietário da **Mafra Gestão Integrada** (síndico profissional — **nunca** "administradora"). Ribeirão Preto/SP.

> **Posicionamento de marca:** a empresa e o produto são *síndico profissional*. Nunca descrever, associar ou comparar a "administradora".

---

## Arquitetura

- **PWA single-file**: o `index.html` na raiz é a fonte da verdade. Todo o app vive nele.
- **Backend**: Supabase (ref `iqwmkbwgtmainkopmrqs`).
- **Deploy**: Netlify (drag-and-drop de zip). Produção em `mafraon.netlify.app` e `metodomafra5p.netlify.app`.
- **IA embarcada**: LivIA (assistente Claude-powered) via Supabase Edge Functions.

### Módulos
Início, Tickets, Meus Tickets, Minhas Vistorias, Aprovações, Manutenções, Reformas, Portaria, Cronograma, Documentos, Comunicação, Enquete, Auditoria, Malote Digital, Relatórios, Cadastros, Ecossistema, LivIA.

---

## Regras de build (OBRIGATÓRIAS)

1. **Sempre** incrementar juntos: o número de build no rodapé **e** a string de cache do service worker. Nunca um sem o outro.
2. Validar JS com `node --check` **antes** de empacotar.
3. Verificar o conteúdo do zip com `unzip -p <zip> | grep <trecho>` **antes** de entregar.
4. Encadear o ciclo com `&&`: `edit → node --check → zip → unzip|grep`.
5. O `index.html` em disco é a fonte da verdade — **extrair e grep antes de editar**, nunca editar às cegas.
6. Verificação de integridade do zip via MD5.

### Ciclo de trabalho
`preview → aprovar → implementar → verificar`, com rollback rápido se algo quebrar.
Builds pequenos e focados, com aprovação do preview antes de implementar. Em requisito ambíguo, perguntar antes de implementar.

---

## Padrões Supabase

- Bucket privado `anexos` exige **`createSignedUrl`** (validade 7 dias). **`getPublicUrl` retorna 403** — nunca usar.
- **Proibido** `try{}catch(e){}` silencioso. Toda falha precisa de mensagem visível (anti-pattern recorrente já identificado).

---

## Marca (INVIOLÁVEL)

- **Proibido verde em qualquer lugar**, em qualquer asset — UI, PDF, apresentação, marketing. Sem exceção.
- **Navy `#16243D`** — cor primária.
- **Creme `#F6F4EF`** — fundo.
- **Azul `#34608F`** (`--okbg`) — positivo / aprovado.
- **Dourado `#C9A24B` / `#C98A2A`** — pendente.
- **Vermelho `#CF5249`** — vencido / perigo.
- Tipografia: **Montserrat** (variable font) para UI e web; **Arial + Cambria** para documentos Office/A4 (Montserrat não vem no Windows).

---

## Decisões de arquitetura — Manutenções

- Pacotes/planos prontos foram **abandonados**: cada condomínio escolhe item a item do catálogo completo. Básico/Intermediário/Avançado viram apenas modelos opcionais de pré-marcação.
- **Subcondomínios** são cadastro do próprio condomínio (ex.: Le Monde, Trio). Quando existem, cada manutenção escolhida exige marcar em quais subcondomínios vale — e só o escolhido aparece em *Minhas Vistorias*.
- O módulo **Manutenções** é um **dashboard** (o que foi feito, principais erros, índice por mês e total), não lugar de seleção/execução.
- Execução de vistoria liberada a **todos os cargos** com acesso ao módulo; autoria fica registrada pelo login de quem fez.

---

## Toolchain

- **Frontend build**: builders Python (`build.py`, `build_site.py`, `build_products.py`) gerando HTML; `node --check` para JS.
- **PDF**: WeasyPrint 69.0, `@font-face` com paths `file://` absolutos, layouts em flexbox (**sem CSS grid**), SVG inline para gráficos/gauges/QR. QA com `pdftoppm`, `pdfinfo`, `pypdf`.
- **PPTX**: `pptxgenjs` (Node.js).
- **Vídeo/áudio**: ffmpeg; PIL/numpy para frames.
- **Design/QA visual**: Playwright para screenshots.
- **E-commerce** (Mafra School): Hotmart — preservar sempre as URLs de checkout embutidas.

---

## Bugs conhecidos / pendências

- **Título verde no gerador de Termo de Autorização** (`#479B6E`) — viola a regra de marca. Corrigido nos assets de apresentação, **mas ainda não na fonte do app**. ⚠️ Resolver.
- Implantação de planos de manutenção nos condomínios ativos requer rodar `ZERAR_TUDO.sql` e escolher o catálogo por condomínio.

---

## Pessoas

- **Márcia Mafra** — Sócia-Diretora de Operações.
- **André Salgado** — diretor técnico, `super_admin` da plataforma. Não-técnico, Windows/Chrome, deploy por drag-and-drop no Netlify. Comunica por voz-para-texto (mensagens podem vir truncadas). Prefere builds pequenos com aprovação de preview; reverte na hora se quebra.

---

## Estado atual

Em desenvolvimento ativo, último build rastreado **v223**. Adições recentes: boleto multi-add, abas de vistoria por subcondomínio, agendamento de manutenção por janela, URLs de foto assinadas, fluxo NF/remessa, push notifications.
