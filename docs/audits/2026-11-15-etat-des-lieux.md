# État des lieux — landing (lumyx.dev) et docs (docs.lumyx.dev)

Date : 2026-11-15 · Base : `website@main` (100be9b), comparé au README de `sfu-core`.

## Stack

- Bun + Turborepo, deux apps Astro 7 statiques sur Vercel : `apps/landing` (port 3000), `apps/docs` (Starlight, port 3003).
- Design system `@lumyx/ui` épinglé sur un commit GitHub. Tailwind 4, Geist. Thème sombre par défaut, avec un toggle.
- Contrôles : lint, `astro check`, tests bun, `verify:ds`. Le build passe.

## Landing — ce qui existe

Une seule page (`src/pages/index.astro`, 482 lignes ; le contenu est dans `src/lib/home-data.ts`). Design « Home v3 ».
`/design-system` est publique. `_pricing`, `_changelog` et `_blog` sont désactivées.

| # | Section | Hauteur à 1440×900 |
|---|---|---|
| 1 | Hero : badge Alpha, H1 « Live video that tells you why it broke », 2 CTA, maquette d'incident | 1,23 écran |
| 2 | Bandeau stack (Rust, WebRTC…) | 0,08 |
| 3 | Phrase manifeste qui s'allume au scroll | 0,35 |
| 4 | Detect / Explain / Recover (les 3 marqués « Planned ») | 0,46 |
| 5 | Onglets produit (Rooms / Peers / Topology / Config) | 0,93 |
| 6 | Statut « What works today / What ships next » | 0,65 |
| 7 | Bande sombre : paquets + 4 faits | 0,78 |
| 8 | Quickstart avec terminal | 0,62 |
| 9 | FAQ (6 questions) | 0,83 |
| 10 | CTA final | 0,55 |
| 11 | Footer | 0,34 |

**Points forts :** un ton honnête (Alpha, « no customers yet », démo étiquetée) ; l'UI produit en HTML vivant tient lieu de visuel ;
un seul système de boutons et de bordures ; les rails de page sont propres ; les données structurées JSON-LD sont présentes ; le mode réduit des animations est géré.

**Faiblesses de design** (vues à travers la grille tasteskill) :
- Le rythme est trop fragmenté : 7 sections font moins d'un écran (stack 0,08, manifeste 0,35, piliers 0,46…). La page se lit comme une suite de bandeaux, pas comme des écrans.
- Le hero dépasse le premier écran (1,23) : la maquette d'incident est coupée à la ligne de flottaison.
- Un fondu au scroll (`data-reveal`, flou + translation) s'applique à presque chaque bloc. C'est le tic « landing générée » par excellence.
- Le H1 est répété tel quel dans le CTA final.
- L'accent indigo/violet et les halos flous `accent`/`accent2` derrière la maquette sont le cliché SaaS 2024.
- Les 3 piliers sont tous « Planned » : la section produit vend surtout ce qui n'existe pas.
- Une légende sous la maquette du hero et une autre sous les onglets. Leur intention est honnête, mais elles se lisent comme des excuses.
- Aucun vrai logo ni icône de la stack (le bandeau est en texte seul), aucune capture réelle du client de test.

## Docs — ce qui existe

15 pages, dont **3 rédigées** (Introduction, Quickstart, Self-hosting, entre 270 et 400 mots chacune) et 1 riche (Metrics reference, avec composants dédiés).
**11 pages sont des squelettes** : badge « Soon », `noindex`, ~60 mots, titres H2 vides (Rooms, Peers, Signaling, Forwarding, Alerting, Topology, Replay, Prometheus, API, Config, Errors).

Le design est soigné : le thème Starlight est mappé sur `@lumyx/ui`, avec une coloration Shiki maison, des cartes et un sommaire. La page Metrics reference est réussie visuellement.

## Écarts avec la réalité (`sfu-core` README) — le vrai problème

| Affirmation sur le site | Réalité dans sfu-core | Où |
|---|---|---|
| « MIT licensed », « Free and MIT » | **AGPL-3.0-only** | landing (FAQ, faits, CTA, footer), docs Intro, quickstart |
| Version `v0.4.1` | `0.1.0`, aucun tag | `site-data.ts`, docs |
| `docker run -p 3000:3000 …` puis `http://localhost:3000` | HTTPS par défaut (mkcert), pas de port UDP publié, pas de STUN | landing hero + terminal, docs quickstart et self-hosting |
| Un dashboard sur :3000 avec 6 métriques live | Dashboard à l'état de squelette ; collecteur de métriques planifié | docs Intro, Quickstart, Self-hosting |
| `room.on("quality")`, `connect()` (API client) | Aucun SDK ; JSON brut sur WS (la landing dit d'ailleurs « no SDK ») | docs quickstart |
| `cargo add lumyx-sfu`, Rust 1.79+ | Crate non publiée | docs self-hosting |
| `lumyx.toml`, alertes Slack/PagerDuty, `auto_audio_only` | Configuration par variables `SFU_*` seulement ; alerting planifié | docs self-hosting |
| `/metrics` au format Prometheus | `/metrics` renvoie des compteurs **JSON** | docs self-hosting, page Prometheus |
| « Nothing held back… dashboard all there » | Faux aujourd'hui | docs Intro |
| Postgres / object storage | Postgres existe (`SFU_DATABASE_URL`, télémétrie) ; object storage n'existe pas | docs |

Ce qui existe et **n'est documenté nulle part sur le site** : les 15 variables `SFU_*`, `/health`, les compteurs `/metrics` (y compris `packet_drops`),
le client de test sur `/`, le protocole de signalisation (renvoyé au README), la limite NAT/STUN, la persistance Postgres de la télémétrie.

## Restes et incohérences

- `base.astro` : l'alt OG dit « know before your users complain. Real-time WebRTC monitoring. », un ancien positionnement.
- `site-data.ts` : un objet `START` mort qui contient encore « Use Lumyx Cloud », retiré des docs le 27bba0a.
- Des commentaires de code en français sans accents (« entierement », « Lu au build ») sont mêlés à du code en anglais.
- La FAQ de la landing renvoie vers Discussions ; il n'est pas vérifié que Discussions soit activé sur `sfu-core`.

## Priorités suggérées

1. **Corriger les affirmations fausses** : licence, version, commande docker, dashboard, API client, toml, Prometheus. C'est un risque de crédibilité immédiat pour un projet dont l'argument est « tells you why ».
2. **Docs, rédiger ce qui existe** : Configuration (variables `SFU_*`), Signaling (depuis le README), Endpoints (`/health`, `/metrics`), Self-hosting réel (TLS, ports UDP, `SFU_ICE_HOST`, limite NAT).
3. **Landing, refonte du rythme** : moins de bandeaux, des sections d'un écran, un hero qui tient dans un écran, la fin du fondu systématique, plus de surface sur ce qui marche aujourd'hui (forwarding, ~3 µs/paquet, 148 tests, compteurs).
4. Trancher la question de la couleur d'accent (indigo actuel contre une identité moins générique).

Captures (1440 et 390) : `/private/tmp/claude-501/-Users-mathieuchambaud-Documents-Perso-Projects-lumyx/18e63e51-b6ec-42ec-a532-78dfffad7126/scratchpad/shots/`

## Design — analyse détaillée

Checker tasteskill (`consistency.mjs --quick`, 1440 + 390) sur la landing : **101 FAIL, 24 WARN**.
Regroupés par règle (hors scroll-reveal) : no-visual 14, text-contrast 11, off-grid 9, container-edges 9,
section-height 8, spill 7, row-lines 5, heading-scale 4, split-pair 4, button-styles 3, one-section 3, cut-text 2, hole 2.
À 390 : 22 WARN tap-size.

### Ce qui tient
- La maquette d'incident du hero : du vrai produit en HTML, crédible, dense, la meilleure pièce de la page.
- La phrase manifeste, une vraie « moment » typographique.
- La rigueur du système : rails, hairlines, une échelle de rayons, Geist bien réglée, un thème clair/sombre géré.
- La section statut : une checklist sobre, qui inspire confiance.
- Les docs : Starlight bien habillé ; la page Metrics reference (cartes, panneaux JSON, « What to do ») est au niveau Stripe/Linear.

### Ce qui ne tient pas
1. **Pas d'identité.** Fond gris-noir, accent indigo, halos flous, H1 en dégradé gris : c'est le gabarit « dev tool sombre » de 2024 (Vercel/Linear/Resend). Rien ne dit « vidéo temps réel » ni « Rust ».
2. **Un rythme en bandeaux.** 11 blocs, dont 7 sous un écran ; le bandeau stack fait 0,08 écran. Pas de respiration ni de hiérarchie entre sections majeures et mineures (section-height, one-section, section-gaps).
3. **Le hero déborde** (1,23 écran) : la maquette est coupée net en bas du premier écran, sans fondu ni cadrage voulu.
4. **Fondu au scroll partout** (`data-reveal` : opacité + 64px + flou 12px) : 30+ éléments. C'est le tic n°1 des landings générées, qui ralentit en plus la lecture.
5. **La section produit vend du vide.** Detect / Explain / Recover sont trois cartes identiques, toutes « Planned », avec des mini-UI de 3 lignes perdues dans des boîtes de 200px (beaucoup de vide, hole).
6. **Des visuels absents sur 7 sections** (no-visual) : manifeste, statut, Rust, quickstart, FAQ, CTA, du texte seul. La seule image forte est le hero.
7. **Le contraste est trop faible.** Le lead du hero, les sous-lignes de la maquette, le `$` du terminal et le texte de la bande sombre sont sous le seuil (11 FAIL text-contrast). Les gris `muted/faint` sont trop bas.
8. **Des incohérences de système** : deux styles de boutons qui se mêlent (button-styles) ; le H2 du CTA final a la taille du H1 (heading-scale) ; des blocs centrés (statut, CTA) au milieu d'une page alignée à gauche (container-edges) ; la commande docker coupée sur 2 lignes dans le hero et tronquée dans le terminal (cut-text).
9. **Des légendes d'excuse** sous la maquette et sous les onglets (« Demo data… draft shape ») : honnêtes, mais elles affaiblissent les deux meilleurs visuels.
10. **Mobile** : 22 cibles tactiles sous 44px (liens footer, onglets, FAQ) ; les cartes Detect/Explain prennent chacune un écran pour 3 lignes.

### Docs, design
- Bon socle. Défauts : 11 entrées « Soon » sur 15 dans la sidebar (l'impression d'un chantier) ; l'accent violet partout (liens, sélection, badges) ; le corps de texte à ~14px est un peu petit pour de la doc longue ; la page d'accueil des docs n'a pas de hero ni de parcours clair (3 cartes en bas).
- Docs et landing ne se ressemblent pas totalement : header différent (search contre ancres), badge de version différent.

### Pistes
- Trouver une identité propre au sujet : signal, paquets, timeline réseau. La bande de paquets est la meilleure idée graphique de la page : en faire le fil visuel (hero, transitions, docs) plutôt qu'un ornement.
- Garder une seule couleur d'accent non violette (ex. un vert « signal », un ambre « alerte »), et le rouge pour la perte.
- Ramener la page à ~6 écrans pleins : hero (≤1 écran) → ce qui marche aujourd'hui (forwarding, 3 µs/paquet, 148 tests, compteurs `/metrics` réels) → ce qui arrive (Detect/Explain/Recover fusionnés en une timeline) → quickstart réel → FAQ → CTA.
- Supprimer le reveal générique ; garder l'entrée du hero et le manifeste.
- Remonter les gris de texte d'un cran.

## Références Inspo (dev tools sombres)

Étude : 1 `recommend`, 1 `search_screens` (developer-tools, landing), 3 `get_screen`.
Les mesures portent sur 24 sites de la catégorie : display grotesk-sans 67 % (Geist est donc dans la norme), accent froid 42 %.
Les premiers résultats de `recommend` (Smashing, Forest Admin, Superlist) étaient hors sujet ; je ne les ai pas retenus.

| Réf | Ce qu'on en tire |
|---|---|
| **Sourcegraph** (sourcegraph.com) | Hero centré : le titre occupe les ~60 % du haut, la capture produit cale le bas du premier écran, le tout tient dans le premier écran. Fond #0a0a0a, **un seul accent** (#e8483a), réservé au CTA. Pas de halo, pas de dégradé dans le titre. |
| **Lithic** (lithic.com) | Une **signature graphique tirée du métier** : ellipses en filets fins + cartes qui les traversent. Accent orange uniquement sur le CTA principal. → L'équivalent Lumyx, ce sont des trajets de paquets en filets fins ou la bande de paquets. |
| **Novu** (novu.co) | OSS dev infra : un token en **monospace dans le titre** (`<Inbox />`), la visual UI en bas du hero, GitHub stars dans la nav. → par ex. `RTCP` ou `packet_loss_ratio` en mono dans le H1. |

Points communs qui contredisent la landing actuelle : aucun halo flou ; un accent unique et rare ; un hero complet dans 1280×800 ;
une seule cadence verticale de 80 à 160px entre les sections ; une seule idée visuelle propre au produit, répétée.
Choix d'accent pour Lumyx : le rouge et l'orange (Sourcegraph, Lithic) sont exclus, car le rouge signifie déjà « perte ». Il reste un **cyan/teal « signal »** (Novu, Builder) ou un ambre, avec le rouge réservé aux paquets perdus.
