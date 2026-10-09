# Audit — The Ashen Archive

Audit réalisé avant toute modification, sur la version déployée (export statique servi sous `/darksouls3/`).

## Méthode

- Export statique construit avec `STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/darksouls3`, puis servi localement sous `/darksouls3/`.
- Analyse des 1 119 pages HTML générées : liens internes, préfixe `/darksouls3`, ancres, balises `<title>` et métadonnées.
- Passage navigateur (Playwright, Chromium) sur 29 routes représentatives, en bureau (1440 px) et en mobile (390 px). Contrôles : erreurs console, ressources en erreur, noms accessibles, champs sans étiquette, nombre de `h1`, débordements.
- Revue visuelle des captures et relecture du code des pages boss, guide, lore et cartes.
- Comparaison des données de boss (invocations, récompenses) avec la source sourcée du parcours (Dark Souls 3 Cheat Sheet, licence MIT).

## Ce qui fonctionne et reste intact

- **Liens et ressources** : 0 lien interne cassé, 0 lien sans préfixe `/darksouls3`, 0 ancre manquante. Aucune erreur console, aucune ressource en erreur 4xx.
- **Fonctionnalités** :
  - recherche globale ;
  - checklists persistées par zone ;
  - profils, mode NG+, export et import JSON ;
  - favoris, historique, spoilers masqués ;
  - comparateur, filtres, cartes (zoom, déplacement, filtres) ;
  - 19 tests de bout en bout.
- **Données de boss** : invocations, récompenses et caractère obligatoire ou facultatif concordent avec la source.
- **Avertissements** : les étapes manquables sont déjà signalées avant d'être cochées.

## Défauts constatés

| # | Priorité | Défaut | Fichiers |
| --- | --- | --- | --- |
| 1 | Haute | Débordement horizontal sur mobile : `/recherche` (+78 px) et `/pnj` (+5 px). Des éléments de grille n'ont pas `min-w-0`. | `src/components/search/SearchPage.tsx`, `src/app/pnj/page.tsx` |
| 2 | Haute | Fiches de boss : la section Lore porte globalement le badge « Fait établi dans le jeu », y compris sur « Symbolisme » et « Interprétation ». Cela mélange faits et interprétations. | `src/app/boss/[slug]/page.tsx` |
| 3 | Haute | Fiches de boss : la liste « Particularités » répète la liste « Invocations » sur 15 boss. | `src/data/bosses.ts` |
| 4 | Moyenne | Donnée imprécise sur Aldrich : « Anri peut être aidée en l'invoquant ». En réalité, son signe vous fait rejoindre son monde. | `src/data/bosses.ts` |
| 5 | Moyenne | Sous-titre en double quand les noms français et anglais sont identiques (« Iudex Gundyr / Iudex Gundyr »). | `src/components/ui/PageHeader.tsx` |
| 6 | Moyenne | Illustration de boss générique : le même sceau procédural, quel que soit le boss. | `src/components/art/Engraving.tsx`, page boss |
| 7 | Moyenne | Aucun circuit pour intégrer de vraies illustrations locales : le champ `image?: ImageRef` n'est jamais rendu. | `src/data/types.ts`, composants d'art |
| 8 | Moyenne | Pas de renvois vers les articles de lore depuis les fiches de boss, de PNJ et de zone. Le lien n'existe que dans un sens. | `src/lib/data.ts`, pages de détail |
| 9 | Moyenne | Cartes : les filtres de marqueurs ne sont pas mémorisés, et la carte ne se déplace pas au clavier. | `src/components/maps/SchematicMap.tsx`, `src/lib/store.ts` |
| 10 | Basse | Fiche de boss : l'encadré « Fiche » répète les âmes sans indiquer leur fiabilité. Il manque les conditions d'accès et les faiblesses. | `src/app/boss/[slug]/page.tsx` |
| 11 | Basse | Widget « Checklist de la zone » : le libellé et le compteur passent sur deux lignes. | `src/components/progress/Check.tsx` |
| 12 | Basse | Libellé de recherche tronqué dans la barre latérale (« Rechercher dan… »). | `src/components/search/SearchTrigger.tsx` |
| 13 | Basse | La page 404 utilise le titre par défaut du site. | `src/app/not-found.tsx` |
| 14 | Basse | Carte Twitter `summary_large_image` déclarée sans image Open Graph. | `src/app/layout.tsx` |
| 15 | Basse | Graphe de lore : étiquettes des nœuds peu contrastées. | `src/components/lore/LoreGraph.tsx` |

## Limites connues, hors correction

- Les wikis (Fextralife, Fandom) restent inaccessibles depuis l'environnement de travail. Les statistiques chiffrées (PV, statistiques d'armes) ne peuvent pas être recoupées : elles restent marquées « à compléter », jamais inventées.
- Les illustrations finales doivent être produites séparément. Un circuit d'intégration est préparé (point 7).

## Suite donnée (état après corrections)

| # | Statut | Correction |
| --- | --- | --- |
| 1 | Corrigé | `min-w-0` sur les éléments de grille. Aucun débordement sur les 156 pages contrôlées à 360 px. |
| 2 | Corrigé | Symbolisme et interprétation sont regroupés sous le badge « Déduction étayée ». |
| 3 | Corrigé | 13 particularités en double supprimées. Les conditions d'invocation sont précisées d'après la source (Saber, Eygon, Anri, Horace, Sirris, Siegward). |
| 4 | Corrigé | La note d'Aldrich suit le texte de la source. |
| 5 | Corrigé | Le sous-titre est masqué quand les noms sont identiques (en-tête et cartes de boss). |
| 6 | Amélioré | Emblèmes héraldiques originaux pour les 25 boss et les 4 fins. |
| 7 | Préparé | Registre `src/data/illustrations.ts`, composant `<Illustration>`, dossier `public/illustrations/` et contrôle de présence des fichiers. Aucune image n'est encore déclarée. |
| 8 | Corrigé | Les fiches de boss et de PNJ listent les articles de lore qui les citent, et les articles indiquent « Cité dans ». |
| 9 | Corrigé | Les filtres sont mémorisés dans les préférences (champ facultatif, compatible avec les anciennes sauvegardes). La carte se déplace au clavier. |
| 10 | Corrigé | L'encadré « Fiche » indique les faiblesses, la mention « à vérifier » et l'accès à la zone. |
| 11–15 | Corrigés | Compteur sur une ligne, libellé de recherche, titre de la page 404, image Open Graph, contraste du graphe. |

Défauts découverts en cours de route :

- La classe `.btn`, définie hors des couches Tailwind, écrasait les utilitaires. Résultat : flèche « retour en haut » et boutons de zoom réduits à quelques pixels, état actif des favoris invisible. Les styles des boutons sont maintenant dans `@layer components`.
- Les serments cités en récompense (Spears of the Church) apparaissaient comme objets sans fiche. Ils renvoient maintenant vers `/serments`.
