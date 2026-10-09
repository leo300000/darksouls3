# The Ashen Archive

> *Toutes les cendres ont une histoire.*

**🔗 Accéder au site : [leo300000.github.io/darksouls3](https://leo300000.github.io/darksouls3/)**

Encyclopédie interactive **non officielle** de *Dark Souls III* et de ses deux DLC (*Ashes of Ariandel*, *The Ringed City*), en français :
guide intégral zone par zone, boss, PNJ et quêtes, fins, lore, équipements, cartes schématiques et suivi de progression vers le 100 %.

## Lancer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production :

```bash
npm run build        # génère ~1 100 pages statiques
npm start
```

Autres commandes :

| Commande | Rôle |
| --- | --- |
| `npm run lint` | ESLint (config Next.js) |
| `npm run data:build` | Régénère `src/data/generated/catalog.json` depuis la source et les traductions |
| `npm run data:validate` | Vérifie que toutes les références croisées (zones, boss, PNJ, lore, objets) existent |
| `node tests/e2e.mjs <dossier>` | 19 tests de bout en bout Playwright (recherche, checklists, filtres, import/export, 404, mobile) ; nécessite `PW_PATH` vers le paquet playwright et le serveur lancé |

Variable optionnelle : `NEXT_PUBLIC_SITE_URL` (URL publique, utilisée pour le sitemap et les métadonnées Open Graph).

## Mise en ligne sur GitHub Pages

Le workflow `.github/workflows/pages.yml` construit une version 100 % statique du site et la publie à chaque push
sur `main` (ou sur la branche de travail), ou à la demande depuis l'onglet **Actions** (« Run workflow »).

Activation, une seule fois : dépôt GitHub → **Settings → Pages → Build and deployment → Source : GitHub Actions**.
Le site est ensuite servi à l'adresse https://leo300000.github.io/darksouls3/.

Pour reproduire l'export en local :

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/darksouls3 npm run build   # résultat dans out/
```

La progression reste stockée dans le navigateur du visiteur (`localStorage`) : aucun serveur n'est nécessaire.

## Fonctionnalités

- **Accueil** immersif : illustration originale, recherche, reprise de la progression, accès aux dix grandes salles de l'archive.
- **Guide de l'aventure** : graphe interactif des 22 zones (obligatoires, facultatives, secrètes, DLC, conditions d'accès) et une page par zone :
  ambiance, difficulté estimée, **983 étapes** traduites et cochables, feux, boss, ennemis, objets cités, PNJ, raccourcis, secrets, pièges, quêtes affectées,
  éléments manquables (avertissements), conseils, navigation précédente/suivante.
- **Boss** (25) : filtres (obligatoire, zone, DLC, faiblesse), tri, favoris, checklist ; fiches avec phases, signaux, stratégies mêlée/distance/magie, invocations, récompenses, transpositions, lore avec spoilers masqués.
- **PNJ** (38) et **quêtes** : étapes conditionnelles cochables, issues, points de non-retour, dépendances ; tableau de suivi par statut et graphe des incompatibilités.
- **Fins** : trois fins à succès + la variante de la Gardienne (présentée comme variante), planificateur de fin cible avec checklist adaptée.
- **Lore** : 23 articles classés, niveau de certitude par section, graphe narratif interactif, chronologie avec incertitudes.
- **Arsenal** : armes et boucliers (286, filtres avancés, comparateur 2–4), armures (360 pièces, 50 ensembles), anneaux (116), sorts (106), objets (195) avec localisations sourcées et « ce qu'il débloque ».
- **Cartes schématiques** interactives (zoom, déplacement, filtres, panneau latéral), chaque marqueur relié à une étape du guide.
- **Centre de complétion** : 15 catégories, distinction succès / collection, profils multiples, mode NG+, recherche des manquants, export/import JSON, remise à zéro confirmée.
- **Transverse** : recherche globale (Ctrl+K ou `/`, sans accents ni casse, navigation clavier, recherches récentes), favoris, historique, fil d'Ariane, tables des matières,
  retour en haut, thème sombre / parchemin, spoilers configurables, `prefers-reduced-motion`, page 404 personnalisée, sitemap et robots.

## Architecture

```
src/
  app/                    routes (App Router) — toutes générées depuis les données
  components/             composants d'interface (art, catalogue, guide, cartes, progression…)
  data/
    types.ts              modèles typés (Zone, Boss, Npc, Quest, Ending, LoreArticle…)
    zones.ts bosses.ts npcs.ts endings.ts lore.ts covenants.ts …   données éditoriales
    source/cheatsheet.json            source MIT structurée
    walkthrough/*.json  checklists/*.json   traductions françaises (id d'étape → texte)
    generated/catalog.json            catalogue dérivé (entités, étapes, mentions)
  lib/                    accès aux données (serveur), recherche, sauvegarde locale, complétion
scripts/
  parse-cheatsheet.py     HTML de la source → JSON
  build-catalog.ts        JSON + traductions + données éditoriales → catalogue
  validate-data.ts        contrôle des références
```

- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, Lucide. Polices auto-hébergées (@fontsource).
- Aucun backend : pages statiques, progression dans `localStorage` (clé versionnée `ashen-archive:v1`, données assainies à l'import).
  Les fonctions `readStore`/`writeStore` de `src/lib/store.ts` sont le seul point à remplacer pour une future synchronisation de comptes.
- Les identifiants (slugs) sont stables et servent à toutes les relations ; une future base relationnelle ou une API publique peuvent reprendre ces modèles tels quels.

## Données et fiabilité

Voir la page **Sources et fiabilité** (`/a-propos`). En résumé :

- **Parcours, localisations, listes de complétion** : adaptés de [Dark Souls 3 Cheat Sheet](https://github.com/ZKjellberg/dark-souls-3-cheat-sheet)
  (Zachary Kjellberg & contributeurs, licence MIT), structurés automatiquement puis traduits.
- **Fiches de boss, lore, descriptions** : rédaction éditoriale. Les wikis n'étaient pas accessibles pendant la session : les valeurs chiffrées issues
  de cette rédaction (âmes, faiblesses) portent le badge « À vérifier ».
- **Non renseigné volontairement** (affiché « à compléter », jamais inventé) : statistiques d'armes/armures/sorts, points de vie des boss, valeurs exactes des anneaux.
- Les noms d'objets sont en anglais officiel ; les noms français de zones et de boss sont des noms d'usage.

### Compléter les données

1. Statistiques d'armes : ajouter une entrée sourcée dans `src/data/weapon-notes.ts` (`weaponStats[slug]`). Elle apparaît sur la fiche et dans le comparateur.
2. Boss : renseigner `hp`, `souls`, `weaknesses` dans `src/data/bosses.ts` avec un niveau de fiabilité.
3. Parcours : modifier `src/data/walkthrough/<Section>.json` (conserver les marqueurs `[[Nom]]`), puis `npm run data:build`.
4. Toujours terminer par `npm run data:validate`.

### Images

Aucune ressource officielle n'est intégrée (droits non vérifiés). Chaque fiche affiche une **gravure générée** (SVG procédural, unique par entité,
marquée « Gravure générée »). Le type `ImageRef` (src, alt, crédit, licence) est prévu pour brancher de vraies illustrations dont l'usage est autorisé.

## Licence et mentions

Site de fan non officiel, sans affiliation avec FromSoftware ou Bandai Namco Entertainment. *Dark Souls* est une marque de ses détenteurs respectifs.
Les données dérivées de la Cheat Sheet restent soumises à sa licence MIT (copyright Zachary Kjellberg).
