# Deploy-workflow

Deze site deployt automatisch naar Vercel zodra er iets naar `main` op
GitHub wordt gepusht. Dat is precies het probleem: zodra iets op `main`
staat, staat het meteen live voor bezoekers — er is geen moment meer om
het eerst te bekijken.

## Waarom nooit direct naar main pushen

- Elke push naar `main` wordt direct de **productie**-deployment.
- Als er een typefout in een bestandsnaam zit, een pagina per ongeluk
  verwijst naar iets dat niet bestaat, of Vercel de build-instellingen
  verkeerd interpreteert, zien bezoekers dat meteen — soms als een
  korte 404, soms langer.
- Een branch die niet `main` heet, krijgt van Vercel automatisch een
  eigen **preview-URL**. Die kun je rustig bekijken voordat er iets
  wijzigt aan de live site.

## De workflow

1. **Maak een branch** voor je wijziging:
   ```
   git checkout -b beschrijvende-naam
   ```
2. **Werk je wijzigingen bij** en gebruik dan het script om te pushen:
   ```
   ./safe-deploy.sh "korte omschrijving van de wijziging"
   ```
   Dit script weigert te werken als je op `main` zit, en pusht anders
   automatisch naar je huidige branch.
3. **Controleer de preview-URL.** Je vindt deze:
   - in het Vercel-dashboard, onder "Deployments" (elke branch krijgt
     een eigen regel), of
   - als je op GitHub een pull request opent voor de branch — Vercel
     plaatst daar automatisch een link naar de preview.

   Klik de preview-URL open en loop de site na alsof je een bezoeker
   bent: homepage, een paar onderliggende pagina's, en de pagina die je
   net hebt aangepast.
4. **Pas als de preview goed is**, merge je naar main:
   ```
   git checkout main
   git merge beschrijvende-naam
   git push
   ```
   Dit is het enige moment waarop `main` verandert — en dus het enige
   moment waarop de live site verandert.

## Een mislukte deployment herkennen

In het Vercel-dashboard, tabblad **Deployments**, zie je per deployment
een status:

- **Ready** (groen) — geslaagd.
- **Error** (rood) — de build is mislukt; deze gaat sowieso niet live.
- Een deployment die wel "Ready" is, maar waarbij de site zelf een 404
  of duidelijk kapotte pagina toont — dat merk je alleen door de
  preview-URL (of, bij main, de live site) zelf te bezoeken. Vandaar
  stap 3 hierboven: altijd eerst kijken, nooit blind vertrouwen op een
  groene status.

## Terugdraaien: Instant Rollback

Staat er toch een kapotte versie live op main? Je hoeft niet te
haasten met een git-fix:

1. Ga naar het project in het Vercel-dashboard → **Deployments**.
2. Zoek de laatste deployment die wél goed was.
3. Klik op de drie puntjes (**⋯**) naast die deployment →
   **Instant Rollback**.
4. Bevestig. Binnen enkele seconden wijst de productie-domeinnaam weer
   naar die eerdere, werkende deployment — zonder dat je iets in git
   hoeft aan te passen.

Los daarna, zonder tijdsdruk, het probleem op via een nieuwe branch en
de gewone workflow hierboven.
