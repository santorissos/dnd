# Osada na hranici (West Marches)

Statická stránka pre GitHub Pages. Nepotrebuje server ani build.

## Nasadenie
1. Na GitHube vytvor repozitár a nahraj doň **obsah** tohto priečinka (aj skrytý `.nojekyll`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Po minúte-dvoch je stránka na `https://<meno>.github.io/<repozitar>/`.

## Štruktúra
- `index.html`, `favicon.svg`, `css/style.css`, `js/app.js` (stránka), `js/bg.js` (animované pozadie): kód stránky.
- `data/data.js`: **všetky dáta** (výpravy, mapy, zvesti, postavy, NPC). Tento súbor sa prepisuje.
- `img/postavy/` (400×400 px), `img/npc/` (400×400 px), `img/mapa/` (512×512 px): obrázky v WebP alebo JPG. V stránke sa zadáva len cesta, napr. `img/postavy/thorin.webp`.

## Ako sa menia dáta
1. Hráč upravuje stránku, zmeny sa ukladajú v jeho prehliadači (žltý pruh „Máš neodoslané zmeny").
2. V záložke **Odoslať zmeny** stiahne `data.js` a pošle ho e-mailom (michal.santoris@gmail.com) spolu s novými obrázkami.
3. Správca nahrá `data.js` do priečinka `data/` (Add file → Upload files, prepíše sa) a obrázky do `img/`.
4. Súbor nesie číslo verzie. Keď vyjde nová, lokálne zmeny hráčov sa zahodia a načíta sa nová verzia. Preto posielajte zmeny postupne a po nahratí obnovte stránku.

## Poznámky
- Hmla je len vizuálna, dáta sú verejné.
- Písma sa načítajú z Google Fonts. Bez internetu sa použije záložné písmo.
- Mapy sa rozširujú v **Režime úprav** tlačidlami „+ riadok / + stĺpec". Pri pridaní hore alebo vľavo sa zvestiam automaticky posunú súradnice.
- Hráč má vlastné postavy (záložka Hráči a postavy) so všetkými 18 zručnosťami podľa D&D 5e.
- **Osada:** sklad surovín so záznamom zmien, budovy s postupom stavby, aktivity medzi výpravami, udalosti, ukazovatele. **Kronika** má herný kalendár s ročnými obdobiami. Ďalej sú Frakcie (reputácia), Pravidlá a Štatistiky (rotácia DM).
- Postava má kúzla so slotmi (dlhý odpočinok ich obnoví) a inventár s prepínačom „U seba / V sklade".
- Inventár postavy: zbrane (zásah a zranenie sa dopočítajú, klik hodí oboje), brnenia a štíty (AC sa počíta automaticky z vybavených kusov), ostatné predmety, váha a zoznam bežných SRD zbraní a brnení.
- Budovy a aktivity majú pole **Hotové do** s živým odpočtom (reálny čas). Prebiehajúce práce sú aj na nástenke.
