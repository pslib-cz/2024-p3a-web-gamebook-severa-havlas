# Plánované Implementace
## Zápisník
Jednoduchý textový editor pro hráče, ve kterém si mohou zaznamenávat nápovědy, úkoly a poznatky. Ve hře totiž nebudou žádné předem dané nápovědy; vše bude záležet na hráčově vlastní iniciativě.

## Rébusy, šifry, hádanky
Hlavním úkolem hry bude odhalit, co se stalo se ztracenou výpravou dědečka našeho protagonisty. Inspirujeme se hrou "Return of the Obra Dinn", avšak s odlišným zpracováním. Hráč bude pátrat po denících, předmětech, svědcích či pozůstalých a dalších nápovědách, které mu postupně objasní záhadu příběhu.
### A. Deníky
Útržky textu budou vždy vyprávět určitou část příběhu. Jedná se o relativně jednoduchou a technicky nenáročnou součást hry.
### B. Svědci
Podobně jako deníky, avšak v tomto případě půjde o interakci s postavou. Hráč bude muset zvolit správné možnosti nebo splnit úkol typu "přines předmět X"
### C. Předměty
Hráč bude moci nalézt například krabici s kódem nebo jiné objekty, jejichž zkoumání či odemknutí bude vyžadovat splnění dalších úkolů k získání nových informací.
### D. Foťák, rozbité předměty
Tato implementace není nezbytná, ale výrazně by hru obohatila. Pro vyzkoušení mechaniky craftingu by hráč mohl hledat čáati poškozených předmětů, které by mohl opravit či spojit, aby získal další důležité informace.

## Obchod
Hráč si bude moci zakoupit nebo směnit různé předměty, které následně využije ve hře. Jednoduše řečeno, bude k dispozici obchod.

# Optimistické implementace
## Survival
Hráč se bude vydávat do hor, a proto bychom z této hry nechtěli udělat čistou adventuru. Hráč by musel řešit základní potřeby, jako jsou jídlo, pití a teplo. To by přidalo na autentičnosti a zvýšilo výzvu při průzkumu.

## Souboje
Tahové souboje neplánujeme přidávat, protože je považujeme za nudné a příliš běžné. Navíc se do konceptu hry příliš nehodí. Přesto zvažujeme dvě alternativní varianty soubojů:
  ### A. Quick Time Eventy (QTE)
  Zvažujeme implementaci QTE, i když nemusí zapadat do pomalejšího tempa hry. Možná bychom našli způsob, jak je vhodně zakomponovat do určité části příběhu.
  ### B. Hazardní souboje
  Souboje by mohly fungovat na principu hazardu se smrtí, což by nám umožnilo zahrnout i boj s přírodními živly (například při lezení na skálu). Tato varianta nám připadá zajímavější než tahové souboje, protože hráči by nabízela možnost volby, co vsadí - například víru, přátele nebo rodinu. Nevýhodou je, že hazard může být pro hráče frustrující, takže bychom museli pečlivě promyslet, jak tento systém nastavit, aby byl odměňující a motivující.

## Kreslení do zápisníku
Zvažujeme možnost, aby hráč mohl kreslit do zápisníku, což by nám umožnilo přidat vlastní písmo nebo runy, které by musel luštit. Tato mechanika by mohla zvýšit interaktivitu, ale její implementace je poměrně složitá a náročná.
