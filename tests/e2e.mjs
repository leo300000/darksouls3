// Tests de bout en bout (Playwright). Usage : serveur lancé sur :3000, puis
// PW_PATH=$(npm root -g)/playwright node tests/e2e.mjs <dossier-de-sortie>
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH);
const OUT = process.argv[2];
const B = process.env.E2E_BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const results = [];
const errors = [];
const ok = (name, cond, extra = "") => results.push(`${cond ? "✓" : "✗"} ${name} ${extra}`);
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`${page.url()}: PAGEERROR ${e.message}`));

// 1. Recherche clavier
await page.goto(B + "/", { waitUntil: "networkidle" });
await page.keyboard.press("Control+k");
await page.fill('input[aria-label="Terme recherché"]', "gundyr");
await page.waitForSelector('[role="option"]');
const opts = await page.locator('[role="option"]').allInnerTexts();
ok("recherche : résultats pour « gundyr »", opts.length >= 2, opts.slice(0, 3).join(" | "));
await page.keyboard.press("Enter");
await page.waitForURL(/\/boss\//);
ok("recherche : Entrée ouvre la fiche", /\/boss\//.test(page.url()), page.url());
// accents
await page.keyboard.press("Control+k");
await page.fill('input[aria-label="Terme recherché"]', "cathedrale");
await page.waitForSelector('[role="option"]');
ok("recherche insensible aux accents", (await page.locator('[role="option"]').first().innerText()).includes("Cathédrale"));
await page.keyboard.press("Escape");
await page.keyboard.press("Control+k");
await page.fill('input[aria-label="Terme recherché"]', "zzzzqqq");
await page.waitForTimeout(300);
ok("recherche : message aucun résultat", await page.getByText("Aucune archive ne correspond").isVisible());
await page.keyboard.press("Escape");

// 2. Persistance checklist
await page.goto(B + "/guide/cimetiere-des-cendres", { waitUntil: "networkidle" });
const first = page.locator('#cheminement ol input.seal-check').first();
await first.check();
await page.reload({ waitUntil: "networkidle" });
ok("checklist persistée après rechargement", await page.locator('#cheminement ol input.seal-check').first().isChecked());
const prog = await page.locator("text=Checklist de la zone").locator("..").innerText();
ok("progression de zone mise à jour", /1 \/ \d+/.test(prog), prog.replace(/\n/g, " "));

// 3. Filtres boss
await page.goto(B + "/boss", { waitUntil: "networkidle" });
await page.selectOption('select[aria-label="Contenu"]', "ringed-city");
const n = await page.locator("ul > li a[href*='/boss/']:not([href$='/boss/'])").count();
ok("filtre DLC The Ringed City = 4 boss", n === 4, `(${n})`);
await page.selectOption('select[aria-label="Contenu"]', "tous");
await page.selectOption('select[aria-label="Caractère obligatoire"]', "facultatifs");
ok("filtre boss facultatifs", (await page.locator("ul > li a[href*='/boss/']:not([href$='/boss/'])").count()) > 0);

// 4. Catalogue armes avec paramètre d'URL
await page.goto(B + "/armes?methode=Transposition", { waitUntil: "networkidle" });
const rows = await page.locator("table.table-archive tbody tr").count();
ok("armes filtrées par transposition (URL)", rows > 20 && rows < 80, `(${rows})`);

// 5. Export / import
await page.goto(B + "/parametres", { waitUntil: "networkidle" });
const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Exporter/ }).click()]);
const file = OUT + "/export.json";
await dl.saveAs(file);
const data = JSON.parse(fs.readFileSync(file, "utf8"));
ok("export JSON valide", data.version === 1 && Object.keys(data.profiles).length >= 1);
await page.evaluate(() => localStorage.clear());
await page.setInputFiles('input[type="file"]', file);
await page.waitForSelector("text=Sauvegarde importée");
await page.goto(B + "/guide/cimetiere-des-cendres", { waitUntil: "networkidle" });
ok("import restaure la progression", await page.locator('#cheminement ol input.seal-check').first().isChecked());
fs.writeFileSync(OUT + "/bad.json", '{"foo":1}');
await page.goto(B + "/parametres", { waitUntil: "networkidle" });
await page.setInputFiles('input[type="file"]', OUT + "/bad.json");
ok("import refuse un fichier invalide", await page.waitForSelector("text=ne correspond pas au format", { timeout: 5000 }).then(() => true).catch(() => false));

// 6. Planificateur de fin
await page.goto(B + "/fins", { waitUntil: "networkidle" });
await page.getByRole("radio", { name: "L'Usurpation du Feu" }).click();
ok("planificateur : checklist de fin affichée", await page.getByText("Rite de l'Engagement").first().isVisible());

// 7. Spoiler
await page.goto(B + "/boss/aldrich", { waitUntil: "networkidle" });
const veil = await page.locator(".spoiler-veil").count();
ok("spoilers masqués par défaut", veil > 0, `(${veil})`);

// 8. 404
const r404 = await page.goto(B + "/cette-page-nexiste-pas");
ok("404 personnalisée", r404.status() === 404 && (await page.getByText("Vous êtes mort").isVisible()));

// 9. Carte : clic marqueur
await page.goto(B + "/cartes/haut-mur-de-lothric", { waitUntil: "networkidle" });
await page.locator('svg g[role="button"]').nth(3).click();
ok("carte : panneau latéral sur clic", await page.getByText("Voir dans le guide").isVisible());

// 10. Graphe lore
await page.goto(B + "/lore/graphe", { waitUntil: "networkidle" });
await page.locator('svg g[aria-label="Aldrich"]').click();
ok("graphe lore : sélection d'un nœud", (await page.locator("aside h3").innerText()).includes("Aldrich"));

// 11. Débordement horizontal mobile
const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const mp = await mobile.newPage();
mp.on("pageerror", (e) => errors.push(`mobile: ${e.message}`));
const paths = ["/", "/guide", "/guide/irithyll-de-la-vallee-boreale", "/boss", "/boss/roi-sans-nom", "/pnj/anri", "/quetes", "/fins", "/fins/usurpation-du-feu", "/lore", "/lore/graphe", "/lore/chronologie", "/armes", "/armes/storm-ruler", "/armes/comparateur?ids=storm-ruler,claymore", "/armures", "/anneaux", "/sorts", "/objets", "/objets/tower-key", "/cartes/cite-annelee", "/completion", "/parametres", "/a-propos", "/serments"];
for (const p of paths) {
  await mp.goto(B + p, { waitUntil: "networkidle" });
  const over = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 1) results.push(`✗ débordement mobile ${p} (+${over}px)`);
}
results.push(`✓ débordement mobile vérifié sur ${paths.length} pages (erreurs listées ci-dessus le cas échéant)`);
// menu mobile
await mp.goto(B + "/", { waitUntil: "networkidle" });
await mp.getByRole("button", { name: "Ouvrir le menu" }).click();
await mp.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Boss" }).click();
await mp.waitForURL(/\/boss\/?$/);
ok("menu mobile : navigation", /\/boss\/?$/.test(mp.url()));

console.log(results.join("\n"));
console.log("\nErreurs console :", errors.length ? "\n" + errors.join("\n") : "aucune");
await browser.close();
