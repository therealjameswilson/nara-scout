// NARA Scout — Topic Packs.
// Each pack defines a curated FRUS-volume-style search: query string, date range,
// and a recommended scope (administration umbrellas + specific featured collections).
//
// scope values are strings the engine knows about:
//   "bush41"     - all 70 Bush 41 collections
//   "clinton"    - all 132 Clinton administration collections
//   numeric NAID - that specific collection
//
// Edit freely; the UI rebuilds itself from this list.

window.TOPIC_PACKS = [
  {
    id: 'start',
    name: 'Strategic Arms Reduction (START I/II)',
    note: 'Soviet/Russian strategic arms negotiations, ratification, lab dismantlement.',
    q: 'START OR "strategic arms reduction" OR "strategic arms" Russia Soviet',
    from: 1989, to: 2001,
    scope: ['bush41', 'clinton', '2163580', '7386739', '7388773'],
  },
  {
    id: 'gulf-war',
    name: 'Gulf War — Coalition Diplomacy & Desert Storm',
    note: 'Pre-war coalition building, U.N. Resolution 678, Desert Shield/Storm, post-war containment.',
    q: 'Iraq OR Kuwait OR "Desert Storm" OR "Desert Shield" coalition',
    from: 1990, to: 1992,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'german-reunif',
    name: 'German Reunification (2+4 Talks)',
    note: 'Bush-Kohl-Gorbachev diplomacy, Two Plus Four negotiations, NATO membership of united Germany.',
    q: '(Germany OR German) (reunification OR unification OR "two plus four" OR Kohl)',
    from: 1989, to: 1991,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'soviet-collapse',
    name: 'Soviet Collapse & Successor States',
    note: 'Recognition of independent republics, Lisbon Protocol, Nunn-Lugar, nuclear inheritance.',
    q: '(Soviet OR USSR OR Yeltsin OR Gorbachev OR Ukraine OR Belarus OR Kazakhstan) (collapse OR independence OR "nuclear inheritance" OR Lisbon)',
    from: 1990, to: 1994,
    scope: ['bush41', 'clinton', '2163580', '7386739'],
  },
  {
    id: 'bosnia',
    name: 'Yugoslavia / Bosnia / Dayton',
    note: 'Bosnian war, NATO airstrikes, Dayton Accords, IFOR/SFOR.',
    q: '(Bosnia OR Yugoslavia OR Sarajevo OR Dayton OR Milosevic OR Karadzic)',
    from: 1991, to: 1999,
    scope: ['bush41', 'clinton', '7386505'],
  },
  {
    id: 'china-mfn',
    name: 'China — MFN, Human Rights, Tiananmen',
    note: 'Tiananmen aftermath, MFN debates, WTO accession, Taiwan Strait.',
    q: '(China OR Beijing OR Tiananmen OR Taiwan) ("most favored nation" OR MFN OR "human rights" OR WTO)',
    from: 1989, to: 2001,
    scope: ['bush41', 'clinton', '2163580', '7386739'],
  },
  {
    id: 'haiti',
    name: 'Haiti Intervention',
    note: 'Aristide restoration, UN Mission, Operation Uphold Democracy.',
    q: '(Haiti OR Aristide OR "Uphold Democracy")',
    from: 1991, to: 1996,
    scope: ['clinton', '7386739'],
  },
  {
    id: 'nato-enlargement',
    name: 'NATO Enlargement (Partnership for Peace)',
    note: 'Partnership for Peace, Madrid Summit, Article V, first round invitations.',
    q: '(NATO OR "Partnership for Peace" OR enlargement OR "Article V") (Poland OR Hungary OR Czech)',
    from: 1993, to: 1999,
    scope: ['clinton', '7386505', '7386739'],
  },
  {
    id: 'northern-ireland',
    name: 'Northern Ireland Peace Process',
    note: 'Good Friday Agreement, Mitchell talks, Adams visa, IRA decommissioning.',
    q: '("Northern Ireland" OR "Good Friday" OR IRA OR Adams OR Mitchell OR Stormont OR Sinn Fein)',
    from: 1993, to: 2000,
    scope: ['clinton', '7386505'],
  },
  {
    id: 'mepp',
    name: 'Middle East Peace Process (Madrid → Oslo → Wye)',
    note: 'Madrid Conference, Oslo Accords, Wye River, Camp David II.',
    q: '(Israel OR Palestine OR PLO OR Arafat OR Madrid OR Oslo OR Wye OR "Camp David")',
    from: 1991, to: 2001,
    scope: ['bush41', 'clinton', '2163580', '7386739'],
  },
  {
    id: 'rwanda',
    name: 'Rwanda Genocide & Great Lakes',
    note: 'UNAMIR, decision not to intervene, Great Lakes refugee crisis, post-genocide reckoning.',
    q: '(Rwanda OR Burundi OR "Great Lakes" OR UNAMIR OR Hutu OR Tutsi)',
    from: 1993, to: 1998,
    scope: ['clinton', '7385959', '7386739'],
  },
  {
    id: 'somalia',
    name: 'Somalia (UNOSOM / Restore Hope)',
    note: 'Operation Restore Hope, Mogadishu, withdrawal decisions.',
    q: '(Somalia OR Mogadishu OR UNOSOM OR "Restore Hope" OR Aideed)',
    from: 1992, to: 1995,
    scope: ['bush41', 'clinton', '2163580', '7385959'],
  },
  {
    id: 'iran-contra-aftermath',
    name: 'Iran-Contra Aftermath & Pardons',
    note: 'Weinberger pardon, Walsh investigation conclusion, Iran policy follow-on.',
    q: '("Iran-Contra" OR Weinberger OR Walsh OR pardon OR Poindexter)',
    from: 1989, to: 1993,
    scope: ['bush41'],
  },
  {
    id: 'nuclear-testing',
    name: 'Nuclear Testing & CTBT',
    note: 'Test moratorium, Comprehensive Test Ban Treaty, Senate ratification fight.',
    q: '("nuclear test" OR moratorium OR CTBT OR "comprehensive test ban") (Nevada OR Novaya OR Lop Nor)',
    from: 1990, to: 2000,
    scope: ['bush41', 'clinton', '7388773'],
  },
  {
    id: 'wto-trade',
    name: 'GATT / WTO / Trade Architecture',
    note: 'Uruguay Round conclusion, NAFTA, WTO accession debates.',
    q: '(GATT OR WTO OR "Uruguay Round" OR NAFTA OR "fast track" OR "trade promotion")',
    from: 1989, to: 2000,
    scope: ['bush41', 'clinton', '2525022', '612954'],
  },
  {
    id: 'india-pak-nuke',
    name: 'India-Pakistan Nuclear Tests (1998)',
    note: 'Pokhran-II, Chagai tests, Glenn Amendment sanctions, post-test diplomacy.',
    q: '(India OR Pakistan OR Pokhran OR Chagai OR "Glenn Amendment") (nuclear OR test)',
    from: 1997, to: 2000,
    scope: ['clinton', '7388773', '7386739'],
  },
];
