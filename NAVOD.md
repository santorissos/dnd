# Kronika družiny – návod

## Súbory
- `index.html`, `style.css`, `app.js`, `dm.js`, `rules.js`, `spells.js`, `art.js`: kód stránky (netreba meniť).
- `data.js`: všetky dáta (hráči, postavy, kampane, bestiár, denník).
- `manifest.json`, `sw.js`, `icon.svg`: inštalácia ako appka a offline režim.

## Ako aktualizovať stránku
1. Na stránke urob zmeny (postavy, bestiár, denník…).
2. Dole stlač **Stiahnuť data.js (verejný)**.
3. Na GitHube otvor repozitár → **Add file → Upload files**, nahraj `data.js` (prepíše sa starý) a daj **Commit changes**.
4. Za pár minút je nová verzia online. Potom dole stlač **Zahodiť lokálne zmeny**, aby si videl verziu z GitHubu.

## Ukladanie priamo na GitHub (bez ručného nahrávania)
1. Na GitHube vytvor token: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate. Vyber **len tento repozitár** a oprávnenie **Contents: Read and write**.
2. Na stránke dole stlač **Ukladanie na GitHub**, vyplň používateľa, repozitár, vetvu a token a ulož nastavenia (token ostane len v tomto prehliadači).
3. Po úpravách stlač **Uložiť na GitHub**. Stránka sa obnoví do pár minút.
Do GitHubu sa posiela verejná verzia dát (bez vecí označených 🔒).

## Tajné veci pre pána jaskyne
Veci označené 🔒 (záznamy denníka, NPC/miesta/úlohy/frakcie, monštrá) sa do verejného `data.js` **nedostanú**.
- Pred zahodením lokálnych zmien stiahni **plnú zálohu** (`data-plne.js`) a uchovaj ju u seba (nenahrávaj ju na GitHub).
- Na inom zariadení ju načítaš tlačidlom **Načítať zo súboru**.
- Súbor `data.js` na GitHube si môže prečítať ktokoľvek, kto pozná adresu stránky.

## Zálohy
Dole je tlačidlo **Zálohy** s posledným piatimi stavmi uloženými v prehliadači.
