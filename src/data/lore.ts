import type { LoreArticle, LoreCategory, LoreEdge, LoreNode, TimelineEvent } from "./types";

export const loreCategories: { id: LoreCategory; label: string; description: string }[] = [
  { id: "seigneurs-des-cendres", label: "Les Seigneurs des cendres", description: "Ceux qui ont lié la flamme et que les cloches rappellent." },
  { id: "dieux-et-lignees", label: "Dieux et lignées royales", description: "Gwyn, ses enfants et les royautés humaines." },
  { id: "royaumes", label: "Les royaumes", description: "Lothric, Irithyll, Londor et leurs voisins." },
  { id: "civilisations", label: "Civilisations disparues", description: "Carthus, Izalith, les Pygmées de la Cité annelée." },
  { id: "serments-et-factions", label: "Serments et factions", description: "Les alliances que le Sans-Braise peut rejoindre." },
  { id: "cultes", label: "Cultes", description: "Aldrich, Rosaria, les Mound-makers." },
  { id: "chevaliers", label: "Chevaliers et ordres", description: "Légion de Farron, Outriders, chevaliers d'argent." },
  { id: "creatures", label: "Créatures et entités", description: "Dragons, démons, Ghrus et autres." },
  { id: "personnages", label: "Personnages secondaires", description: "Destins croisés du voyage." },
  { id: "evenements", label: "Événements historiques", description: "Les grands tournants du monde." },
  { id: "cycles-du-feu", label: "Les cycles du Feu", description: "Lier la flamme, ou la laisser mourir." },
  { id: "abysses", label: "Les Abysses", description: "L'obscurité qui ronge les gardiens." },
  { id: "peintures", label: "Les peintures", description: "Les mondes peints et leur pourriture." },
  { id: "liens-trilogie", label: "Liens entre DS I, II et III", description: "Échos, retours et fins de cycle." },
];

export const loreArticles: LoreArticle[] = [
  {
    slug: "seigneurs-des-cendres",
    title: "Les Seigneurs des cendres",
    category: "seigneurs-des-cendres",
    summary: "Ceux qui ont autrefois lié la flamme, et qui ont fui leur trône quand les cloches ont sonné.",
    sections: [
      {
        heading: "Le retour des Seigneurs",
        confidence: "game",
        paragraphs: [
          "Lorsque la flamme faiblit, les cloches sonnent pour rappeler les Seigneurs des cendres, héros qui ont jadis lié leur âme à la Première Flamme. Mais les Seigneurs refusent de revenir : seuls leurs trônes vides attendent au Sanctuaire de Lige-Feu.",
          "Les Sans-Braise sont réveillés pour ramener ces Seigneurs, de gré ou de force, en rapportant leurs cendres sur leurs trônes.",
        ],
      },
      {
        heading: "Les quatre fugitifs",
        confidence: "game",
        paragraphs: [
          "Les Veilleurs des Abysses, qui ont lié la flamme ensemble par le sang du loup ; Yhorm le Géant, roi de la Capitale profanée ; Aldrich, saint de la Cathédrale devenu dévoreur ; et le prince Lothric, élevé pour lier la flamme et qui l'a refusée.",
          "Ludleth de Courland, le cinquième, est le seul à être revenu de lui-même s'asseoir sur son trône.",
        ],
      },
      {
        heading: "Pourquoi fuient-ils ?",
        confidence: "deduction",
        paragraphs: [
          "Chacun a ses raisons : les Veilleurs ont été rongés par l'Abysse qu'ils combattaient, Yhorm se sait condamné, Aldrich rêve d'un âge des profondeurs, Lothric juge la flamme indigne d'un nouveau sacrifice. Ensemble, ils dessinent un monde où le devoir n'a plus de sens.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "veilleurs-des-abysses" },
      { kind: "boss", slug: "yhorm" },
      { kind: "boss", slug: "aldrich" },
      { kind: "boss", slug: "lorian-et-lothric" },
      { kind: "pnj", slug: "ludleth" },
      { kind: "lore", slug: "cycles-du-feu" },
    ],
    items: ["Cinders of a Lord"],
    art: { palette: "ember", motif: "shrine" },
  },
  {
    slug: "cycles-du-feu",
    title: "Les cycles du Feu",
    category: "cycles-du-feu",
    summary: "Lier la flamme pour prolonger l'Âge du Feu, ou la laisser s'éteindre : le dilemme qui traverse la trilogie.",
    sections: [
      {
        heading: "L'Âge du Feu",
        confidence: "game",
        paragraphs: [
          "Selon le mythe, la Première Flamme a apporté la disparité — chaleur et froid, vie et mort, lumière et ténèbres. Les seigneurs qui trouvèrent les âmes de seigneur en tirèrent leur puissance et fondèrent l'Âge du Feu.",
          "Quand la flamme faiblit, un seigneur se sacrifie pour la raviver. Gwyn fut le premier ; d'autres ont suivi, cycle après cycle.",
        ],
      },
      {
        heading: "Une flamme de plus en plus pâle",
        confidence: "deduction",
        paragraphs: [
          "Dark Souls III montre un monde où les cycles se sont accumulés jusqu'à l'épuisement : royaumes empilés, géographie qui converge, braise presque morte. La fin « Raviver la Première Flamme » laisse voir une flamme minuscule.",
          "Le prince Lothric, Friede et la Gardienne du feu incarnent chacun une forme de refus de ce cycle.",
        ],
      },
      {
        heading: "Les issues possibles",
        confidence: "game",
        paragraphs: [
          "Le joueur peut lier la flamme, la laisser s'éteindre avec la Gardienne du feu, ou l'usurper avec Londor. Aucune n'est présentée comme la « vraie » fin par le jeu.",
        ],
      },
    ],
    timeline: [
      { when: "Âge des Anciens", event: "Le monde est gris, dominé par les dragons éternels.", certainty: "certain" },
      { when: "Découverte de la flamme", event: "Gwyn, Nito, la Sorcière d'Izalith et le Pygmée furtif trouvent les âmes de seigneur.", certainty: "certain" },
      { when: "Âge du Feu", event: "Gwyn lie la flamme ; les cycles commencent.", certainty: "certain" },
      { when: "Dark Souls III", event: "Les Seigneurs fuient ; les Sans-Braise sont réveillés.", certainty: "certain" },
    ],
    related: [
      { kind: "lore", slug: "seigneurs-des-cendres" },
      { kind: "lore", slug: "gwyn" },
      { kind: "lore", slug: "londor" },
      { kind: "boss", slug: "ame-des-cendres" },
    ],
    items: ["Soul of the Lords", "Coiled Sword"],
    art: { palette: "ember", motif: "kiln" },
  },
  {
    slug: "gwyn",
    title: "Gwyn et sa lignée",
    category: "dieux-et-lignees",
    summary: "Le Seigneur de la Lumière du soleil, premier à lier la flamme, et ses enfants dispersés.",
    sections: [
      {
        heading: "Le premier sacrifice",
        confidence: "game",
        paragraphs: [
          "Gwyn, détenteur d'une âme de seigneur, vainquit les dragons et fonda Anor Londo. Quand la flamme déclina, il se sacrifia pour la lier, devenant le premier Seigneur des cendres de l'histoire.",
          "Dans Dark Souls III, l'Âme des cendres reprend ses gestes en seconde phase, accompagnée de la musique de son combat dans le premier jeu.",
        ],
      },
      {
        heading: "Les enfants",
        confidence: "deduction",
        paragraphs: [
          "Le premier-né, effacé de l'histoire pour s'être allié aux dragons, est très vraisemblablement le Roi sans nom. Gwynevere, princesse de la Lumière, a quitté Anor Londo ; sa chambre contient le Sun Princess Ring. Gwyndolin, le dieu de la Lune noire, a été dévoré par Aldrich. Filianore, la plus jeune, dort dans la Cité annelée.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "roi-sans-nom" },
      { kind: "lore", slug: "gwyndolin" },
      { kind: "lore", slug: "filianore" },
      { kind: "boss", slug: "ame-des-cendres" },
      { kind: "zone", slug: "anor-londo" },
    ],
    items: ["Sun Princess Ring", "Soul of the Nameless King"],
    art: { palette: "gold", motif: "cathedral" },
  },
  {
    slug: "gwyndolin",
    title: "Gwyndolin et la Lune noire",
    category: "dieux-et-lignees",
    summary: "Le dieu de la Lune noire, qui régna sur Anor Londo, avant d'être dévoré par Aldrich.",
    sections: [
      {
        heading: "Le gardien d'Anor Londo",
        confidence: "game",
        paragraphs: [
          "Gwyndolin, fils de Gwyn, a longtemps veillé sur Anor Londo et sur l'Église de la Lune noire, chargée de punir ceux qui trahissent les dieux.",
          "Dans Dark Souls III, son héritage est fragmenté : l'Église est passée sous la coupe du Pontife Sulyvahn, et Gwyndolin lui-même a été dévoré par Aldrich.",
        ],
      },
      {
        heading: "La Lune noire aujourd'hui",
        confidence: "game",
        paragraphs: ["Yorshka maintient le serment des Blades of the Darkmoon depuis sa tour d'Anor Londo, et Sirris en est une fidèle chevalière."],
      },
    ],
    related: [
      { kind: "boss", slug: "aldrich" },
      { kind: "boss", slug: "pontife-sulyvahn" },
      { kind: "pnj", slug: "yorshka" },
      { kind: "pnj", slug: "sirris" },
    ],
    items: ["Darkmoon Longbow", "Darkmoon Ring"],
    art: { palette: "frost", motif: "city" },
  },
  {
    slug: "filianore",
    title: "Filianore et la Cité annelée",
    category: "dieux-et-lignees",
    summary: "La plus jeune enfant de Gwyn, endormie, dont le rêve maintient l'illusion de la Cité annelée.",
    sections: [
      {
        heading: "La princesse endormie",
        confidence: "game",
        paragraphs: [
          "Filianore a été envoyée dans la Cité annelée, la ville des Pygmées, comme garante d'un pacte avec les dieux. Elle y dort, gardée par l'Église et par la Lance de l'Église.",
          "En brisant l'œuf qu'elle tient, le joueur se retrouve dans un désert de cendres : la Cité n'était qu'un fragment préservé par son sommeil.",
        ],
      },
    ],
    related: [
      { kind: "zone", slug: "cite-annelee" },
      { kind: "pnj", slug: "shira" },
      { kind: "boss", slug: "halflight" },
      { kind: "lore", slug: "cite-annelee-pygmees" },
    ],
    items: ["Filianore's Spear Ornament", "Sacred Chime of Filianore"],
    art: { palette: "gold", motif: "ruin" },
  },
  {
    slug: "lothric-royaume",
    title: "Le royaume de Lothric",
    category: "royaumes",
    summary: "Le royaume qui a élevé un prince pour lier la flamme — et qui a vu ce prince refuser.",
    sections: [
      {
        heading: "Un royaume tourné vers la flamme",
        confidence: "game",
        paragraphs: [
          "Lothric est bâti autour d'un objectif : produire un héritier capable de lier la flamme. Le château, les Grandes Archives et le Haut mur témoignent de cette obsession.",
          "Le roi Oceiros, rendu fou par sa quête des dragons, s'est retiré dans son jardin. Le prince Lothric, malade et frêle, a été porté par son frère Lorian.",
        ],
      },
      {
        heading: "La chute",
        confidence: "deduction",
        paragraphs: [
          "Le refus de Lothric a laissé le royaume se désagréger : chevaliers évidés, chapelle d'Emma, Danseuse surgie à la mort de la prêtresse. Les Archives, rongées par le savoir, achèvent le portrait d'un royaume figé.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "lorian-et-lothric" },
      { kind: "boss", slug: "oceiros" },
      { kind: "pnj", slug: "emma" },
      { kind: "zone", slug: "chateau-de-lothric" },
      { kind: "zone", slug: "grandes-archives" },
    ],
    items: ["Soul of the Twin Princes"],
    art: { palette: "gold", motif: "castle" },
  },
  {
    slug: "irithyll",
    title: "Irithyll de la vallée boréale",
    category: "royaumes",
    summary: "La cité lunaire de Gwyndolin, tombée sous la coupe du Pontife Sulyvahn.",
    sections: [
      {
        heading: "Une cité sous la neige",
        confidence: "game",
        paragraphs: [
          "Irithyll est une cité de la vallée boréale, liée à Anor Londo et à l'Église de la Lune noire. Sulyvahn en a pris le contrôle et ses chevaliers patrouillent encore.",
          "Ses Outriders ont été envoyés à Lothric : Vordt garde le Haut mur et la Danseuse y apparaît.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "pontife-sulyvahn" },
      { kind: "boss", slug: "vordt" },
      { kind: "boss", slug: "danseuse-de-la-vallee-boreale" },
      { kind: "zone", slug: "irithyll-de-la-vallee-boreale" },
      { kind: "lore", slug: "gwyndolin" },
    ],
    items: ["Soul of Pontiff Sulyvahn", "Soul of Boreal Valley Vordt"],
    art: { palette: "frost", motif: "city" },
  },
  {
    slug: "londor",
    title: "Londor et les Évidés",
    category: "royaumes",
    summary: "Le royaume des Évidés, qui veut faire du Sans-Braise leur Seigneur.",
    sections: [
      {
        heading: "Le royaume des Évidés",
        confidence: "game",
        paragraphs: [
          "Londor accueille les morts-vivants évidés. Ses Mains noires — Yuria, Gotthard, Kamui — et ses Pale Shades œuvrent à un dessein : faire d'un Sans-Braise le Seigneur des Évidés.",
          "Le Dark Sigil, offert par Yoel sous couvert de « révéler votre véritable force », est la marque de cette voie.",
        ],
      },
      {
        heading: "L'Âge des Hommes",
        confidence: "deduction",
        paragraphs: [
          "L'usurpation de la flamme est présentée comme l'avènement d'un âge où les humains, et non les dieux, détiendraient la flamme. Les fidèles de Londor y voient une libération ; d'autres une manipulation.",
        ],
      },
    ],
    related: [
      { kind: "pnj", slug: "yoel" },
      { kind: "pnj", slug: "yuria" },
      { kind: "pnj", slug: "pale-shade-de-londor" },
      { kind: "lore", slug: "evidement" },
    ],
    items: ["Dark Sigil", "Londor Braille Divine Tome", "Sword of Avowal"],
    art: { palette: "abyss", motif: "village" },
  },
  {
    slug: "evidement",
    title: "L'Évidement et la Marque sombre",
    category: "cycles-du-feu",
    summary: "Ce qui arrive aux morts-vivants qui perdent tout but, et ce que le Dark Sigil change.",
    sections: [
      {
        heading: "L'Évidement",
        confidence: "game",
        paragraphs: [
          "Les morts-vivants qui perdent leur raison d'être deviennent évidés. Dans Dark Souls III, le Dark Sigil fait augmenter l'Évidement à chaque mort, changeant progressivement l'apparence du personnage.",
          "La Fire Keeper Soul permet de guérir ce sigil, au prix de la voie de Londor.",
        ],
      },
    ],
    related: [
      { kind: "lore", slug: "londor" },
      { kind: "pnj", slug: "gardienne-du-feu" },
    ],
    items: ["Dark Sigil", "Fire Keeper Soul"],
    art: { palette: "abyss", motif: "cemetery" },
  },
  {
    slug: "carthus",
    title: "Carthus, royaume des sables",
    category: "civilisations",
    summary: "Les guerriers du désert dont les catacombes gardent encore les ossements.",
    sections: [
      {
        heading: "Les guerriers des sables",
        confidence: "game",
        paragraphs: [
          "Carthus fut un royaume conquérant, dont l'art du combat se transmet par les Carthus Curved Swords et Shotels. Son seigneur, Wolnir, conquit trois rois.",
          "Craignant la mort, Wolnir se tourna vers l'Abysse ; les catacombes sont devenues son tombeau.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "high-lord-wolnir" },
      { kind: "zone", slug: "catacombes-de-carthus" },
      { kind: "lore", slug: "abysses" },
    ],
    items: ["Carthus Rouge", "Carthus Milkring", "Carthus Bloodring", "Wolnir's Holy Sword"],
    art: { palette: "ash", motif: "catacomb" },
  },
  {
    slug: "izalith",
    title: "Izalith et la Flamme du Chaos",
    category: "civilisations",
    summary: "La tentative de la Sorcière d'Izalith de recréer la flamme, et les démons qui en naquirent.",
    sections: [
      {
        heading: "Les démons",
        confidence: "game",
        paragraphs: [
          "Dans Dark Souls I, la Sorcière d'Izalith tenta de créer une flamme semblable à la Première, donnant naissance au Lit du Chaos et aux démons.",
          "Dans Dark Souls III, les Ruines démoniaques sous le Lac ardent abritent les derniers démons, dont le Vieux Roi démon ; le Prince démon du DLC en est l'ultime héritier.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "vieux-roi-demon" },
      { kind: "boss", slug: "prince-demon" },
      { kind: "zone", slug: "lac-ardent" },
      { kind: "lore", slug: "liens-trilogie" },
    ],
    items: ["Izalith Pyromancy Tome", "Quelana Pyromancy Tome", "Chaos Bed Vestiges"],
    art: { palette: "ember", motif: "lava" },
  },
  {
    slug: "abysses",
    title: "Les Abysses",
    category: "abysses",
    summary: "L'obscurité née de l'humanité, qui ronge les gardiens censés la combattre.",
    sections: [
      {
        heading: "Une menace ancienne",
        confidence: "game",
        paragraphs: [
          "Dans Dark Souls I, l'Abysse engloutit Oolacile ; Artorias s'y perdit. Dans Dark Souls III, l'Abysse est partout : dans les Veilleurs, dans Wolnir, dans Gundyr, dans les Deep Accursed.",
          "Les Veilleurs des Abysses, inspirés par Artorias, ont été corrompus par l'objet même de leur chasse ; Midir, dragon chargé de dévorer les ténèbres, l'a été aussi.",
        ],
      },
      {
        heading: "Une symbolique récurrente",
        confidence: "deduction",
        paragraphs: ["L'Abysse sert de miroir : ceux qui la gardent finissent par lui ressembler. C'est l'un des fils conducteurs de Dark Souls III."],
      },
    ],
    related: [
      { kind: "boss", slug: "veilleurs-des-abysses" },
      { kind: "boss", slug: "midir" },
      { kind: "boss", slug: "high-lord-wolnir" },
      { kind: "lore", slug: "artorias" },
    ],
    items: ["Soul of the Blood of the Wolf", "Soul of Darkeater Midir", "Deep Gem"],
    art: { palette: "abyss", motif: "swamp" },
  },
  {
    slug: "artorias",
    title: "Artorias l'Arpenteur des Abysses",
    category: "liens-trilogie",
    summary: "Le chevalier de Gwyn dont la légende a inspiré la Légion de Farron.",
    sections: [
      {
        heading: "Un héritage",
        confidence: "game",
        paragraphs: [
          "Artorias, l'un des Quatre Chevaliers de Gwyn, est le héros que les Veilleurs des Abysses ont voulu imiter. Leur équipement et leur serment portent sa marque.",
        ],
      },
      {
        heading: "Le loup",
        confidence: "theory",
        paragraphs: ["Le Vieux loup de Farron est souvent rapproché de Sif, le grand loup d'Artorias ; le jeu ne le confirme pas explicitement."],
      },
    ],
    related: [
      { kind: "boss", slug: "veilleurs-des-abysses" },
      { kind: "pnj", slug: "vieux-loup-de-farron" },
      { kind: "lore", slug: "abysses" },
    ],
    items: ["Wolf Knight's Greatsword", "Farron Greatsword"],
    art: { palette: "moss", motif: "swamp" },
  },
  {
    slug: "legion-de-farron",
    title: "La Légion de Farron",
    category: "chevaliers",
    summary: "Les Veilleurs des Abysses et leurs chiens de garde.",
    sections: [
      {
        heading: "Le serment",
        confidence: "game",
        paragraphs: [
          "La Légion de Farron réunit les Veilleurs des Abysses, unis par le sang du loup. Le serment des Watchdogs of Farron, accordé par le Vieux loup, perpétue la garde de la forêt.",
          "Hawkwood est un déserteur de cette Légion.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "veilleurs-des-abysses" },
      { kind: "pnj", slug: "hawkwood" },
      { kind: "pnj", slug: "vieux-loup-de-farron" },
    ],
    items: ["Farron Ring", "Wolf Ring"],
    art: { palette: "moss", motif: "swamp" },
  },
  {
    slug: "eglise-aldrich",
    title: "Aldrich et la Cathédrale des profondeurs",
    category: "cultes",
    summary: "Le saint qui dévorait les hommes, et l'Église qui le vénère encore.",
    sections: [
      {
        heading: "Un saint cannibale",
        confidence: "game",
        paragraphs: [
          "Aldrich, saint de la Cathédrale, s'est mis à dévorer des hommes. Devenu Seigneur des cendres, il est allé jusqu'à dévorer un dieu, Gwyndolin.",
          "Ses diacres veillent sur son cercueil ; McDonnell dirige les Aldrich Faithful depuis Irithyll.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "aldrich" },
      { kind: "boss", slug: "diacres-des-profondeurs" },
      { kind: "pnj", slug: "mcdonnell" },
    ],
    items: ["Soul of Aldrich", "Aldrich's Ruby", "Aldrich's Sapphire"],
    art: { palette: "abyss", motif: "cathedral" },
  },
  {
    slug: "dragons",
    title: "Les dragons et le culte draconique",
    category: "creatures",
    summary: "Des dragons éternels aux pèlerins qui rêvent de le devenir.",
    sections: [
      {
        heading: "Les héritiers des dragons",
        confidence: "game",
        paragraphs: [
          "Le Pic de l'Archidragon abrite un culte qui aspire à la forme draconique, par le geste « Voie du Dragon » et les pierres de dragon.",
          "Oceiros a sombré dans la folie en cherchant le pouvoir des dragons ; le Roi sans nom s'est allié à eux au point d'être effacé de l'histoire.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "roi-sans-nom" },
      { kind: "boss", slug: "oceiros" },
      { kind: "boss", slug: "midir" },
      { kind: "zone", slug: "pic-de-l-archidragon" },
    ],
    items: ["Dragon Head Stone", "Twinkling Dragon Torso Stone", "Twinkling Dragon Head Stone"],
    art: { palette: "storm", motif: "peak" },
  },
  {
    slug: "peintures",
    title: "Les mondes peints",
    category: "peintures",
    summary: "Ariandel, peinture qui pourrit, et la promesse d'un nouveau monde.",
    sections: [
      {
        heading: "Ariandel",
        confidence: "game",
        paragraphs: [
          "Le Monde peint d'Ariandel est une peinture vivante, refuge des rejetés. Elle pourrit lentement ; le Père Ariandel la nourrit de son sang tandis que Sœur Friede refuse qu'on la brûle pour la repeindre.",
          "Une jeune peintre attend un pigment pour peindre un monde nouveau ; Gael lui promet de le trouver.",
        ],
      },
      {
        heading: "Le sang du Seigneur des Ténèbres",
        confidence: "deduction",
        paragraphs: ["À la fin de The Ringed City, le Blood of the Dark Soul remis à la peintre suggère un monde peint d'un genre nouveau, ni lié au feu ni aux dieux."],
      },
    ],
    related: [
      { kind: "zone", slug: "monde-peint-d-ariandel" },
      { kind: "boss", slug: "soeur-friede" },
      { kind: "pnj", slug: "peintre" },
      { kind: "boss", slug: "slave-knight-gael" },
    ],
    items: ["Blood of the Dark Soul", "Soul of Sister Friede"],
    art: { palette: "frost", motif: "snow" },
  },
  {
    slug: "cite-annelee-pygmees",
    title: "Les Pygmées et la Cité annelée",
    category: "civilisations",
    summary: "La cité des descendants du Pygmée furtif, enfermée par les dieux au bout du monde.",
    sections: [
      {
        heading: "Une cité scellée",
        confidence: "game",
        paragraphs: [
          "Le Pygmée furtif, détenteur de l'Âme sombre, est l'ancêtre des humains selon le mythe. La Cité annelée abriterait ses descendants, les Pygmées, enfermés par les dieux.",
          "Les inscriptions murales, lisibles sous forme d'Humanité, et le Purging Monument éclairent ce passé.",
        ],
      },
      {
        heading: "Le sang sombre",
        confidence: "deduction",
        paragraphs: ["Gael traverse la Cité pour trouver ce qui reste de l'Âme sombre. Le combat final se déroule là où les Pygmées ont fini de se consumer."],
      },
    ],
    related: [
      { kind: "zone", slug: "cite-annelee" },
      { kind: "lore", slug: "filianore" },
      { kind: "boss", slug: "slave-knight-gael" },
    ],
    items: ["Purging Monument", "Blood of the Dark Soul", "Ritual Spear Fragment"],
    art: { palette: "blood", motif: "ruin" },
  },
  {
    slug: "sans-braise",
    title: "Les Sans-Braise",
    category: "personnages",
    summary: "Les héros ratés, jugés indignes, qui se relèvent pour ramener les Seigneurs.",
    sections: [
      {
        heading: "Des cendres sans flamme",
        confidence: "game",
        paragraphs: [
          "Les Sans-Braise sont d'anciens prétendants à la flamme qui ont échoué à la lier. Les cloches les réveillent pour qu'ils accomplissent ce que les Seigneurs refusent.",
          "Anri, Horace, Hawkwood et d'autres sont eux aussi des Sans-Braise, chacun poursuivant sa propre fin.",
        ],
      },
    ],
    related: [
      { kind: "pnj", slug: "anri" },
      { kind: "pnj", slug: "hawkwood" },
      { kind: "lore", slug: "seigneurs-des-cendres" },
    ],
    items: ["Coiled Sword"],
    art: { palette: "ash", motif: "cemetery" },
  },
  {
    slug: "serments",
    title: "Les serments",
    category: "serments-et-factions",
    summary: "Neuf serments du jeu de base et un du DLC, chacun lié à une faction.",
    sections: [
      {
        heading: "Allégeances",
        confidence: "game",
        paragraphs: [
          "Warriors of Sunlight, Way of Blue, Blue Sentinels, Blades of the Darkmoon, Rosaria's Fingers, Mound-makers, Watchdogs of Farron et Aldrich Faithful composent les serments du jeu de base ; Spears of the Church s'ajoute avec The Ringed City.",
          "Le succès de chaque serment s'obtient en le « découvrant », c'est-à-dire en le rejoignant une première fois.",
        ],
      },
    ],
    related: [
      { kind: "pnj", slug: "rosaria" },
      { kind: "pnj", slug: "yorshka" },
      { kind: "pnj", slug: "mcdonnell" },
    ],
    items: ["Sunlight Medal", "Proof of a Concord Kept"],
    art: { palette: "gold", motif: "shrine" },
  },
  {
    slug: "royaumes-humains",
    title: "Astora, Carim, Catarina, Vinheim",
    category: "royaumes",
    summary: "Les royaumes humains dont viennent plusieurs PNJ.",
    sections: [
      {
        heading: "Des noms familiers",
        confidence: "game",
        paragraphs: [
          "Anri vient d'Astora, comme le chevalier Oscar du premier jeu. Irina et Eygon viennent de Carim, Siegward de Catarina, Orbeck de Vinheim, l'école de sorcellerie déjà évoquée dans Dark Souls I.",
        ],
      },
    ],
    related: [
      { kind: "pnj", slug: "anri" },
      { kind: "pnj", slug: "irina" },
      { kind: "pnj", slug: "siegward" },
      { kind: "pnj", slug: "orbeck" },
    ],
    items: ["Astora Straight Sword", "Catarina Armor Set"],
    art: { palette: "ash", motif: "village" },
  },
  {
    slug: "liens-trilogie",
    title: "Dark Souls I, II et III",
    category: "liens-trilogie",
    summary: "Les échos d'une trilogie qui se referme sur elle-même.",
    sections: [
      {
        heading: "Retours",
        confidence: "game",
        paragraphs: [
          "Anor Londo, le Sanctuaire de Lige-Feu, Andre, Patches, les ruines d'Izalith, les objets de Havel, de Smough ou de Gwyn : Dark Souls III multiplie les retours au premier jeu.",
          "Des objets de Dark Souls II (Drang, Alva, Lucatiel, Faraam) apparaissent aussi.",
        ],
      },
      {
        heading: "Une convergence",
        confidence: "deduction",
        paragraphs: [
          "La géographie de Dark Souls III semble s'effondrer sur elle-même : royaumes accumulés, Fournaise remplie de structures d'autres époques, Monceau où se superposent les terres. Le DLC final montre le bout du monde.",
        ],
      },
    ],
    related: [
      { kind: "zone", slug: "anor-londo" },
      { kind: "zone", slug: "monceau-des-residus" },
      { kind: "lore", slug: "izalith" },
    ],
    items: ["Smough's Great Hammer", "Havel's Ring", "Drang Hammers"],
    art: { palette: "ash", motif: "dreg" },
  },
  {
    slug: "outriders",
    title: "Les Chevaliers d'Outrider",
    category: "chevaliers",
    summary: "Les chevaliers d'Irithyll envoyés vers Lothric.",
    sections: [
      {
        heading: "Gardiens venus du froid",
        confidence: "game",
        paragraphs: [
          "Vordt garde le Haut mur ; les Boreal Outrider Knights apparaissent dans la Colonie, au Château et aux Archives. Leur présence matérialise le lien entre Irithyll et Lothric.",
        ],
      },
    ],
    related: [
      { kind: "boss", slug: "vordt" },
      { kind: "boss", slug: "danseuse-de-la-vallee-boreale" },
      { kind: "lore", slug: "irithyll" },
    ],
    items: ["Outrider Knight Set", "Irithyll Straight Sword"],
    art: { palette: "frost", motif: "castle" },
  },
];

export const loreBySlug = new Map(loreArticles.map((a) => [a.slug, a]));

/* ───────────── Graphe narratif ───────────── */

export const loreNodes: LoreNode[] = [
  { id: "gwyn", label: "Gwyn", group: "dieu", href: "/lore/gwyn" },
  { id: "roi-sans-nom", label: "Roi sans nom", group: "dieu", href: "/boss/roi-sans-nom" },
  { id: "gwyndolin", label: "Gwyndolin", group: "dieu", href: "/lore/gwyndolin" },
  { id: "filianore", label: "Filianore", group: "dieu", href: "/lore/filianore" },
  { id: "aldrich", label: "Aldrich", group: "seigneur", href: "/boss/aldrich" },
  { id: "veilleurs", label: "Veilleurs des Abysses", group: "seigneur", href: "/boss/veilleurs-des-abysses" },
  { id: "yhorm", label: "Yhorm", group: "seigneur", href: "/boss/yhorm" },
  { id: "lothric", label: "Lothric & Lorian", group: "seigneur", href: "/boss/lorian-et-lothric" },
  { id: "ludleth", label: "Ludleth", group: "seigneur", href: "/pnj/ludleth" },
  { id: "oceiros", label: "Oceiros", group: "royaute", href: "/boss/oceiros" },
  { id: "danseuse", label: "Danseuse", group: "royaute", href: "/boss/danseuse-de-la-vallee-boreale" },
  { id: "emma", label: "Emma", group: "pnj", href: "/pnj/emma" },
  { id: "sulyvahn", label: "Sulyvahn", group: "royaute", href: "/boss/pontife-sulyvahn" },
  { id: "vordt", label: "Vordt", group: "chevalier", href: "/boss/vordt" },
  { id: "friede", label: "Friede", group: "entite", href: "/boss/soeur-friede" },
  { id: "gael", label: "Gael", group: "chevalier", href: "/pnj/gael" },
  { id: "peintre", label: "La peintre", group: "pnj", href: "/pnj/peintre" },
  { id: "siegward", label: "Siegward", group: "chevalier", href: "/pnj/siegward" },
  { id: "anri", label: "Anri", group: "pnj", href: "/pnj/anri" },
  { id: "horace", label: "Horace", group: "pnj", href: "/pnj/horace" },
  { id: "yuria", label: "Yuria", group: "pnj", href: "/pnj/yuria" },
  { id: "yoel", label: "Yoel", group: "pnj", href: "/pnj/yoel" },
  { id: "londor", label: "Londor", group: "faction", href: "/lore/londor" },
  { id: "sirris", label: "Sirris", group: "chevalier", href: "/pnj/sirris" },
  { id: "hodrick", label: "Hodrick", group: "pnj", href: "/pnj/hodrick" },
  { id: "creighton", label: "Creighton", group: "pnj", href: "/pnj/creighton" },
  { id: "lune-noire", label: "Lune noire", group: "faction", href: "/lore/gwyndolin" },
  { id: "yorshka", label: "Yorshka", group: "pnj", href: "/pnj/yorshka" },
  { id: "irina", label: "Irina", group: "pnj", href: "/pnj/irina" },
  { id: "eygon", label: "Eygon", group: "chevalier", href: "/pnj/eygon" },
  { id: "rosaria", label: "Rosaria", group: "entite", href: "/pnj/rosaria" },
  { id: "leonhard", label: "Leonhard", group: "pnj", href: "/pnj/leonhard" },
  { id: "artorias", label: "Artorias", group: "chevalier", href: "/lore/artorias" },
  { id: "abysses", label: "Abysses", group: "evenement", href: "/lore/abysses" },
  { id: "midir", label: "Midir", group: "entite", href: "/boss/midir" },
  { id: "shira", label: "Shira", group: "chevalier", href: "/pnj/shira" },
  { id: "wolnir", label: "Wolnir", group: "royaute", href: "/boss/high-lord-wolnir" },
  { id: "hawkwood", label: "Hawkwood", group: "chevalier", href: "/pnj/hawkwood" },
  { id: "premiere-flamme", label: "Première Flamme", group: "evenement", href: "/lore/cycles-du-feu" },
  { id: "storm-ruler", label: "Storm Ruler", group: "objet", href: "/armes/storm-ruler" },
  { id: "dark-sigil", label: "Dark Sigil", group: "objet", href: "/objets/dark-sigil" },
  { id: "eyes", label: "Eyes of a Fire Keeper", group: "objet", href: "/objets/eyes-of-a-fire-keeper" },
  { id: "gardienne", label: "Gardienne du feu", group: "pnj", href: "/pnj/gardienne-du-feu" },
];

export const loreEdges: LoreEdge[] = [
  { from: "gwyn", to: "roi-sans-nom", kind: "famille", label: "Premier-né présumé", confidence: "deduction" },
  { from: "gwyn", to: "gwyndolin", kind: "famille", label: "Fils", confidence: "game" },
  { from: "gwyn", to: "filianore", kind: "famille", label: "Fille", confidence: "game" },
  { from: "gwyn", to: "premiere-flamme", kind: "evenement", label: "Premier à lier la flamme", confidence: "game" },
  { from: "aldrich", to: "gwyndolin", kind: "ennemi", label: "L'a dévoré", confidence: "game" },
  { from: "sulyvahn", to: "aldrich", kind: "allie", label: "Lui a livré Gwyndolin", confidence: "game" },
  { from: "sulyvahn", to: "vordt", kind: "affiliation", label: "Outrider d'Irithyll", confidence: "game" },
  { from: "sulyvahn", to: "danseuse", kind: "affiliation", label: "Outrider d'Irithyll", confidence: "game" },
  { from: "sulyvahn", to: "friede", kind: "affiliation", label: "Origine commune : Ariandel", confidence: "theory" },
  { from: "oceiros", to: "lothric", kind: "famille", label: "Père présumé", confidence: "deduction" },
  { from: "danseuse", to: "lothric", kind: "famille", label: "Parenté suggérée", confidence: "theory" },
  { from: "emma", to: "lothric", kind: "allie", label: "A élevé les princes", confidence: "game" },
  { from: "emma", to: "danseuse", kind: "evenement", label: "Sa mort la libère", confidence: "game" },
  { from: "siegward", to: "yhorm", kind: "allie", label: "Vieil ami", confidence: "game" },
  { from: "siegward", to: "storm-ruler", kind: "objet", label: "Porteur", confidence: "game" },
  { from: "yhorm", to: "storm-ruler", kind: "objet", label: "Sa faiblesse", confidence: "game" },
  { from: "anri", to: "horace", kind: "allie", label: "Compagnon", confidence: "game" },
  { from: "anri", to: "aldrich", kind: "ennemi", label: "Veut l'abattre", confidence: "game" },
  { from: "yuria", to: "anri", kind: "evenement", label: "Rite de l'Engagement", confidence: "game" },
  { from: "yoel", to: "yuria", kind: "affiliation", label: "La sert", confidence: "game" },
  { from: "yuria", to: "londor", kind: "affiliation", label: "Main noire", confidence: "game" },
  { from: "yoel", to: "dark-sigil", kind: "objet", label: "Le confère", confidence: "game" },
  { from: "sirris", to: "creighton", kind: "ennemi", label: "Vengeance", confidence: "game" },
  { from: "sirris", to: "hodrick", kind: "famille", label: "Grand-père", confidence: "game" },
  { from: "sirris", to: "lune-noire", kind: "affiliation", label: "Lame de la Lune noire", confidence: "game" },
  { from: "yorshka", to: "lune-noire", kind: "affiliation", label: "Capitaine", confidence: "game" },
  { from: "gwyndolin", to: "lune-noire", kind: "affiliation", label: "Dieu de la Lune noire", confidence: "game" },
  { from: "irina", to: "eygon", kind: "allie", label: "Protégée", confidence: "game" },
  { from: "rosaria", to: "leonhard", kind: "ennemi", label: "Trahie par lui", confidence: "game" },
  { from: "veilleurs", to: "artorias", kind: "affiliation", label: "Inspirés par lui", confidence: "game" },
  { from: "veilleurs", to: "abysses", kind: "ennemi", label: "Chassent puis corrompus", confidence: "game" },
  { from: "hawkwood", to: "veilleurs", kind: "affiliation", label: "Déserteur", confidence: "game" },
  { from: "midir", to: "abysses", kind: "ennemi", label: "Chargé de les dévorer", confidence: "game" },
  { from: "shira", to: "filianore", kind: "affiliation", label: "Chevalier", confidence: "game" },
  { from: "shira", to: "midir", kind: "evenement", label: "Lui offrir le repos", confidence: "game" },
  { from: "wolnir", to: "abysses", kind: "affiliation", label: "Asservi", confidence: "game" },
  { from: "gael", to: "peintre", kind: "allie", label: "Promesse", confidence: "game" },
  { from: "friede", to: "peintre", kind: "allie", label: "Protectrice", confidence: "deduction" },
  { from: "ludleth", to: "premiere-flamme", kind: "evenement", label: "Seigneur des cendres", confidence: "game" },
  { from: "aldrich", to: "premiere-flamme", kind: "evenement", label: "Seigneur des cendres", confidence: "game" },
  { from: "veilleurs", to: "premiere-flamme", kind: "evenement", label: "Seigneurs des cendres", confidence: "game" },
  { from: "yhorm", to: "premiere-flamme", kind: "evenement", label: "Seigneur des cendres", confidence: "game" },
  { from: "lothric", to: "premiere-flamme", kind: "ennemi", label: "Refuse de la lier", confidence: "game" },
  { from: "gardienne", to: "eyes", kind: "objet", label: "Fin du Feu", confidence: "game" },
  { from: "gardienne", to: "premiere-flamme", kind: "evenement", label: "Veille sur le foyer", confidence: "game" },
];

/* ───────────── Chronologie ───────────── */

export const timeline: TimelineEvent[] = [
  { id: "t1", era: "Âge des Anciens", title: "Le monde gris des dragons", description: "Avant le feu, le monde est gris, dominé par des dragons éternels.", certainty: "certain", refs: [{ kind: "lore", slug: "cycles-du-feu" }] },
  { id: "t2", era: "Aube du Feu", title: "La découverte des âmes de seigneur", description: "Gwyn, Nito, la Sorcière d'Izalith et le Pygmée furtif trouvent les âmes de seigneur ; le Pygmée détient l'Âme sombre.", certainty: "certain", refs: [{ kind: "lore", slug: "gwyn" }, { kind: "lore", slug: "cite-annelee-pygmees" }] },
  { id: "t3", era: "Aube du Feu", title: "La guerre contre les dragons", description: "Les seigneurs vainquent les dragons. Le premier-né de Gwyn s'allie ensuite à eux et sera effacé de l'histoire (déduction).", certainty: "probable", refs: [{ kind: "boss", slug: "roi-sans-nom" }] },
  { id: "t4", era: "Âge du Feu", title: "La Cité annelée scellée", description: "Les dieux enferment les Pygmées dans la Cité annelée, sous la garde de Filianore. Le moment exact par rapport aux autres événements reste incertain.", certainty: "incertain", refs: [{ kind: "zone", slug: "cite-annelee" }, { kind: "lore", slug: "filianore" }] },
  { id: "t5", era: "Âge du Feu", title: "Izalith et la Flamme du Chaos", description: "La tentative de recréer la flamme donne naissance aux démons.", certainty: "certain", refs: [{ kind: "lore", slug: "izalith" }] },
  { id: "t6", era: "Âge du Feu", title: "Gwyn lie la flamme", description: "Premier sacrifice : Gwyn devient le premier Seigneur des cendres.", certainty: "certain", refs: [{ kind: "lore", slug: "gwyn" }] },
  { id: "t7", era: "Dark Souls I", title: "Artorias et l'Abysse d'Oolacile", description: "Artorias se perd dans l'Abysse ; sa légende inspirera la Légion de Farron.", certainty: "certain", refs: [{ kind: "lore", slug: "artorias" }] },
  { id: "t8", era: "Entre les jeux", title: "Les cycles se succèdent", description: "D'autres seigneurs lient la flamme ; le nombre et l'ordre exact des cycles ne sont pas établis.", certainty: "incertain", refs: [{ kind: "lore", slug: "cycles-du-feu" }] },
  { id: "t9", era: "Avant DS III", title: "La Légion de Farron lie la flamme", description: "Les Veilleurs, unis par le sang du loup, deviennent Seigneurs des cendres.", certainty: "probable", refs: [{ kind: "boss", slug: "veilleurs-des-abysses" }] },
  { id: "t10", era: "Avant DS III", title: "Yhorm et Aldrich deviennent Seigneurs", description: "Leur ordre relatif n'est pas établi.", certainty: "incertain", refs: [{ kind: "boss", slug: "yhorm" }, { kind: "boss", slug: "aldrich" }] },
  { id: "t11", era: "Avant DS III", title: "Sulyvahn prend Irithyll", description: "Le Pontife s'empare de l'Église ; Gwyndolin est livré à Aldrich.", certainty: "probable", refs: [{ kind: "boss", slug: "pontife-sulyvahn" }, { kind: "lore", slug: "gwyndolin" }] },
  { id: "t12", era: "Avant DS III", title: "Lothric refuse la flamme", description: "Le prince, élevé pour lier la flamme, s'y refuse avec son frère Lorian.", certainty: "certain", refs: [{ kind: "boss", slug: "lorian-et-lothric" }] },
  { id: "t13", era: "Dark Souls III", title: "Les cloches sonnent", description: "Les Seigneurs fuient leurs trônes ; les Sans-Braise se relèvent.", certainty: "certain", refs: [{ kind: "lore", slug: "seigneurs-des-cendres" }] },
  { id: "t14", era: "Dark Souls III", title: "Le choix final", description: "Lier, éteindre ou usurper la flamme.", certainty: "certain", refs: [{ kind: "lore", slug: "cycles-du-feu" }] },
  { id: "t15", era: "Fin des temps", title: "Le Monceau et la Cité annelée", description: "Les terres s'amoncellent au bout du monde ; Gael trouve le sang du Seigneur des Ténèbres. Ce DLC se situe à une époque très tardive, sans date précise.", certainty: "probable", refs: [{ kind: "zone", slug: "monceau-des-residus" }, { kind: "boss", slug: "slave-knight-gael" }] },
  { id: "t16", era: "Fin des temps", title: "Le pigment d'un nouveau monde", description: "Le Blood of the Dark Soul est remis à la peintre d'Ariandel.", certainty: "probable", refs: [{ kind: "pnj", slug: "peintre" }, { kind: "lore", slug: "peintures" }] },
];
