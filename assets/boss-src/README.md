# Images des boss

Un dossier par boss. Déposez-y **une image** et remplissez **`credits.json`**.
Au push suivant, le déploiement GitHub Pages fait le reste.

## Ajouter une image depuis GitHub (sans rien installer)

1. Ouvrez le dossier du boss ci-dessous.
2. Cliquez sur **Add file → Upload files**, glissez l'image (`.png`, `.jpg` ou `.webp`), puis validez avec **Commit changes**.
3. Dans le même dossier, ouvrez `credits.json`, cliquez sur le crayon (**Edit**), remplissez les champs, puis faites **Commit changes** :

```json
{
  "source": "https://… (page d'où vient l'image)",
  "author": "Nom de l'auteur ou de l'ayant droit",
  "license": "Licence ou mention de droits",
  "alt": "Description courte de ce que montre l'image (facultatif)"
}
```

4. Attendez la fin du déploiement (onglet **Actions**, quelques minutes). L'image apparaît alors dans la fiche du boss, dans la liste des boss, sur l'accueil et dans le guide.

## Règles

- **Une seule image par dossier.** S'il y en a plusieurs, seule la première par ordre alphabétique est utilisée.
- **Format conseillé :** portrait, au moins 900 × 1200 px. L'image est recadrée automatiquement sur le sujet en trois versions : fiche 3:4, liste 16:10, miniature.
- **Crédits obligatoires :** tant que `source`, `author` et `license` ne sont pas remplis, l'image n'est pas publiée et l'emblème provisoire reste affiché.
- **Retirer une image :** supprimez le fichier du dossier ; ses versions publiées disparaissent au déploiement suivant.
- **Vérification locale (facultative) :** `npm run images:boss` puis `npm run data:validate`.

## Dossiers

| Boss | Nom anglais | Dossier |
| --- | --- | --- |
| Iudex Gundyr | Iudex Gundyr | [`iudex-gundyr/`](iudex-gundyr/) |
| Vordt de la vallée boréale | Vordt of the Boreal Valley | [`vordt/`](vordt/) |
| Grand Bois maudit pourrissant | Curse-rotted Greatwood | [`grand-bois-maudit/`](grand-bois-maudit/) |
| Le Sage cristallin | Crystal Sage | [`sage-cristallin/`](sage-cristallin/) |
| Les Diacres des profondeurs | Deacons of the Deep | [`diacres-des-profondeurs/`](diacres-des-profondeurs/) |
| Les Veilleurs des Abysses | Abyss Watchers | [`veilleurs-des-abysses/`](veilleurs-des-abysses/) |
| High Lord Wolnir | High Lord Wolnir | [`high-lord-wolnir/`](high-lord-wolnir/) |
| Le Vieux Roi démon | Old Demon King | [`vieux-roi-demon/`](vieux-roi-demon/) |
| Le Pontife Sulyvahn | Pontiff Sulyvahn | [`pontife-sulyvahn/`](pontife-sulyvahn/) |
| Yhorm le Géant | Yhorm the Giant | [`yhorm/`](yhorm/) |
| Aldrich, Dévoreur des dieux | Aldrich, Devourer of Gods | [`aldrich/`](aldrich/) |
| La Danseuse de la vallée boréale | Dancer of the Boreal Valley | [`danseuse-de-la-vallee-boreale/`](danseuse-de-la-vallee-boreale/) |
| L'Armure du tueur de dragons | Dragonslayer Armour | [`armure-du-tueur-de-dragons/`](armure-du-tueur-de-dragons/) |
| Oceiros, le Roi consumé | Oceiros, the Consumed King | [`oceiros/`](oceiros/) |
| Champion Gundyr | Champion Gundyr | [`champion-gundyr/`](champion-gundyr/) |
| La Wyverne antique | Ancient Wyvern | [`wyverne-antique/`](wyverne-antique/) |
| Le Roi sans nom | Nameless King | [`roi-sans-nom/`](roi-sans-nom/) |
| Lorian et Lothric, les Princes jumeaux | Lothric, Younger Prince & Lorian, Elder Prince | [`lorian-et-lothric/`](lorian-et-lothric/) |
| L'Âme des cendres | Soul of Cinder | [`ame-des-cendres/`](ame-des-cendres/) |
| Le Gardien des tombes du champion et le Grand loup | Champion's Gravetender & Gravetender Greatwolf | [`gardien-des-tombes-du-champion/`](gardien-des-tombes-du-champion/) |
| Sœur Friede et Père Ariandel | Sister Friede & Father Ariandel | [`soeur-friede/`](soeur-friede/) |
| Le Prince démon | Demon Prince | [`prince-demon/`](prince-demon/) |
| Halflight, Lance de l'Église | Halflight, Spear of the Church | [`halflight/`](halflight/) |
| Midir le Dévoreur des ténèbres | Darkeater Midir | [`midir/`](midir/) |
| Gael, le Chevalier esclave | Slave Knight Gael | [`slave-knight-gael/`](slave-knight-gael/) |
