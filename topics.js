// NARA Scout — Topic Packs.
//
// Source of truth: FRUS volumes currently marked "Being Researched" on the
// Status of the Series page at history.state.gov/historicaldocuments/status-of-the-series
// (snapshot: May 2026).
//
// One pack per volume. Each pack defines a curated FRUS-volume search:
//   q     - keyword query (no quotes around the whole string; embedded "phrases" allowed)
//   from  - start year (inclusive)
//   to    - end year (inclusive)
//   scope - array of strings the engine knows about:
//             "bush41"     - all 70 Bush 41 collections
//             "clinton"    - all 132 Clinton administration collections
//             numeric NAID - that specific collection
//
// Scope now includes 83 Reagan-administration collections (incl. 17 Reagan
// NSC directorate collections) plus all Bush 41 and Clinton collections.
// Reagan packs are tuned to Reagan-era records; Bush 41 packs include some
// Reagan continuity material where relevant.
//
// Edit freely; the UI rebuilds itself from this list.

window.TOPIC_PACKS = [
  // ===================================================================
  // Reagan Administration (1981–1989)
  // ===================================================================
  {
    id: 'reagan-weur',
    name: 'Reagan Vol VIII · Western Europe, 1985–1988',
    note: 'FRUS Being Researched. Reagan-era Western Europe; NSC European & Soviet Affairs directorate central.',
    q: '(Britain OR France OR Germany OR Italy OR Spain OR "Western Europe" OR Thatcher OR Mitterrand OR Kohl OR Andreotti)',
    from: 1985, to: 1988,
    scope: ['reagan', '1188', '7451593'],
  },
  {
    id: 'reagan-iran-contra',
    name: 'Reagan Vol XXIII · Iran-Contra Affair, 1985–1988',
    note: 'FRUS Being Researched. Iran-Contra primary records (Reagan NSC) plus Bush 41 aftermath, Walsh investigation, Weinberger pardon.',
    q: '("Iran-Contra" OR "Iran Contra" OR Weinberger OR Walsh OR Poindexter OR North OR Hakim OR Secord OR Casey OR pardon)',
    from: 1985, to: 1993,
    scope: ['reagan', 'bush41', '1188', '12024797', '60693877'],
  },
  {
    id: 'reagan-trade-monpol',
    name: 'Reagan Vol XXXVII · Trade; Monetary Policy; Industrialized Country Cooperation, 1985–1988',
    note: 'FRUS Being Researched. Plaza Accord, Louvre Accord, G7; Reagan EPC and NSC International Economic Affairs.',
    q: '("Plaza Accord" OR Louvre OR G7 OR G-7 OR "trade policy" OR "monetary policy" OR "exchange rate" OR yen OR deutschmark OR "Uruguay Round")',
    from: 1985, to: 1988,
    scope: ['reagan', '7821173', '67603959'],
  },
  {
    id: 'reagan-refugees',
    name: 'Reagan Vol XLII · Refugees and Immigration, 1975–1984',
    note: 'FRUS Being Researched. Refugee/immigration policy through Reagan first term; Cuban, Haitian, Vietnamese, Salvadoran flows.',
    q: '(refugee OR refugees OR immigration OR asylum OR Mariel OR "boat people" OR resettlement OR Indochinese)',
    from: 1981, to: 1984,
    scope: ['reagan', '1188', '6120375'],
  },
  {
    id: 'reagan-eastmed',
    name: 'Reagan Vol XLV · Eastern Mediterranean, 1981–1988',
    note: 'FRUS Being Researched. Cyprus, Greece, Turkey, Lebanon; Reagan NSC Near East & South Asia central.',
    q: '(Cyprus OR Greece OR Turkey OR Lebanon OR Aegean OR PKK OR Beirut OR Papandreou OR Demirel OR Ozal)',
    from: 1981, to: 1988,
    scope: ['reagan', '1188', '12024979'],
  },

  // ===================================================================
  // Bush 41 Administration (1989–1993)
  // ===================================================================
  {
    id: 'bush41-v1-foundations',
    name: 'Bush 41 Vol I · Foundations of Foreign Policy; Public Diplomacy',
    note: 'FRUS Being Researched. Bush 41 foundational doctrine, NSDs, public diplomacy.',
    q: '("National Security Directive" OR NSD OR "foreign policy" OR doctrine OR "public diplomacy" OR speechwriting)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580', '2579957'],
  },
  {
    id: 'bush41-v2-orgmgmt',
    name: 'Bush 41 Vol II · Organization and Management of Foreign Policy',
    note: 'FRUS Being Researched. Interagency process, NSC org, Scowcroft model.',
    q: '(NSC OR interagency OR "Policy Coordinating Committee" OR PCC OR Scowcroft OR "deputies committee" OR "principals committee" OR reorganization)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v4-soviet-policy',
    name: 'Bush 41 Vol IV · Soviet Union, Russia, and Post-Soviet States: Policy',
    note: 'FRUS Being Researched. Policy toward USSR/Russia, Lisbon Protocol, Nunn-Lugar, recognition of successor states.',
    q: '(Soviet OR USSR OR Russia OR Yeltsin OR Gorbachev OR Ukraine OR Belarus OR Kazakhstan OR "Nunn-Lugar" OR Lisbon)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v5-east-europe',
    name: 'Bush 41 Vol V · Eastern Europe',
    note: 'FRUS Being Researched. Velvet revolutions, Poland/Hungary/Czechoslovakia/Romania/Bulgaria transitions.',
    q: '(Poland OR Hungary OR Czechoslovakia OR Romania OR Bulgaria OR Walesa OR Havel OR "Eastern Europe" OR "Warsaw Pact")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v6-eastmed',
    name: 'Bush 41 Vol VI · Eastern Mediterranean',
    note: 'FRUS Being Researched. Cyprus, Greece, Turkey, Lebanon during Bush 41.',
    q: '(Cyprus OR Greece OR Turkey OR Lebanon OR Aegean OR Demirel OR Papandreou)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v8-weur',
    name: 'Bush 41 Vol VIII · Western Europe',
    note: 'FRUS Being Researched. UK, France, Italy, Spain, EC relations during Bush 41.',
    q: '(Britain OR "United Kingdom" OR France OR Italy OR Spain OR Thatcher OR Major OR Mitterrand OR Andreotti OR "European Community")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v9-germany',
    name: 'Bush 41 Vol IX · Germany',
    note: 'FRUS Being Researched. German reunification, Two Plus Four, NATO membership of united Germany.',
    q: '(Germany OR German OR reunification OR unification OR "two plus four" OR "2+4" OR Kohl OR Genscher OR Berlin)',
    from: 1989, to: 1991,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v14-arab-israeli',
    name: 'Bush 41 Vol XIV · Arab-Israeli Dispute',
    note: 'FRUS Being Researched. Madrid Conference, loan guarantees, Shamir/Rabin transition.',
    q: '(Israel OR Palestinian OR PLO OR Arafat OR Madrid OR Shamir OR Rabin OR "loan guarantees" OR settlements)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v15-southasia',
    name: 'Bush 41 Vol XV · South Asia',
    note: 'FRUS Being Researched. India, Pakistan, Bangladesh, Sri Lanka, Afghanistan, Pressler Amendment.',
    q: '(India OR Pakistan OR Bangladesh OR "Sri Lanka" OR Afghanistan OR Kashmir OR Pressler OR nuclear)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v16-seasia-pacific',
    name: 'Bush 41 Vol XVI · Southeast Asia and the Pacific',
    note: 'FRUS Being Researched. ASEAN, Cambodia settlement, Vietnam normalization, Philippines bases.',
    q: '(ASEAN OR Cambodia OR Vietnam OR Philippines OR Indonesia OR Thailand OR Malaysia OR Singapore OR Burma OR Myanmar OR "Subic Bay" OR "Clark Air Base")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v18-japan-korea',
    name: 'Bush 41 Vol XVIII · Japan; Korea',
    note: 'FRUS Being Researched. SII talks, Gulf War burden-sharing, North Korea nuclear, Roh Tae-woo.',
    q: '(Japan OR Korea OR "Roh Tae" OR SII OR "Structural Impediments" OR Pyongyang OR DPRK OR "burden sharing")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v20-africa',
    name: 'Bush 41 Vol XX · North Africa; Sub-Saharan Africa',
    note: 'FRUS Being Researched. Liberia, Somalia (early), Sudan, Maghreb, AIDS in Africa.',
    q: '(Liberia OR Somalia OR Sudan OR Algeria OR Morocco OR Tunisia OR Nigeria OR Kenya OR Ethiopia OR Mengistu OR "Provide Relief")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v22-cuba-haiti-carib',
    name: 'Bush 41 Vol XXII · Cuba; Haiti; Caribbean',
    note: 'FRUS Being Researched. Cuban Democracy Act, Haiti coup against Aristide, Caribbean.',
    q: '(Cuba OR Castro OR Haiti OR Aristide OR Caribbean OR Jamaica OR "Cuban Democracy Act" OR embargo OR Guantanamo)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v23-central-america',
    name: 'Bush 41 Vol XXIII · Central America',
    note: 'FRUS Being Researched. Nicaragua/Chamorro, El Salvador peace, Esquipulas follow-on, Guatemala.',
    q: '(Nicaragua OR Chamorro OR "El Salvador" OR Guatemala OR Honduras OR "Costa Rica" OR Esquipulas OR Contra OR Sandinista OR ONUSAL)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v24-panama',
    name: 'Bush 41 Vol XXIV · Panama, 1981–1992',
    note: 'FRUS Being Researched. Operation Just Cause, Noriega, post-invasion governance, Canal handover prep.',
    q: '(Panama OR Noriega OR "Just Cause" OR Endara OR Canal)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v25-south-america',
    name: 'Bush 41 Vol XXV · South America',
    note: 'FRUS Being Researched. Andean Initiative, drug war, MERCOSUR origins, Brazil/Argentina nuclear.',
    q: '(Argentina OR Brazil OR Chile OR Peru OR Colombia OR Venezuela OR Bolivia OR Ecuador OR "Andean Initiative" OR Fujimori OR Pinochet OR MERCOSUR)',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v27-arms-nonprolif',
    name: 'Bush 41 Vol XXVII · Arms Control and Nonproliferation',
    note: 'FRUS Being Researched. START I, CFE, INF implementation, CWC, MTCR, NPT extension prep.',
    q: '(START OR CFE OR INF OR "Chemical Weapons" OR CWC OR MTCR OR NPT OR nonproliferation OR "arms control")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },
  {
    id: 'bush41-v30-econ',
    name: 'Bush 41 Vol XXX · Foreign Economic Policy',
    note: 'FRUS Being Researched. NAFTA negotiation, Uruguay Round, G7 summits, IMF/World Bank.',
    q: '(NAFTA OR "Uruguay Round" OR GATT OR G7 OR G-7 OR IMF OR "World Bank" OR "fast track" OR "trade policy")',
    from: 1989, to: 1993,
    scope: ['bush41', '2133275', '2163580'],
  },
  {
    id: 'bush41-v32-iran',
    name: 'Bush 41 Vol XXXII · Iran',
    note: 'FRUS Being Researched. Hostage releases, Rafsanjani opening explored, dual containment precursors.',
    q: '(Iran OR Tehran OR Rafsanjani OR hostage OR "dual containment")',
    from: 1989, to: 1993,
    scope: ['bush41', '2163580'],
  },

  // ===================================================================
  // Clinton Administration (1993–2001)
  // ===================================================================
  {
    id: 'clinton-v1-foundations',
    name: 'Clinton Vol I · Foundations of Foreign Policy',
    note: 'FRUS Being Researched. PDDs, doctrine speeches, democratic enlargement, "indispensable nation".',
    q: '("Presidential Decision Directive" OR PDD OR "Presidential Review Directive" OR PRD OR "democratic enlargement" OR doctrine OR speechwriting)',
    from: 1993, to: 2001,
    scope: ['clinton', '7386739'],
  },
  {
    id: 'clinton-v4-econ',
    name: 'Clinton Vol IV · Foreign Economic Policy, 1993–1996',
    note: 'FRUS Being Researched. NAFTA passage, WTO/Uruguay, peso crisis, APEC, Big Emerging Markets.',
    q: '(NAFTA OR WTO OR "Uruguay Round" OR APEC OR "Big Emerging Markets" OR peso OR Mexico OR "fast track" OR Kantor OR Rubin)',
    from: 1993, to: 1996,
    scope: ['clinton', '2525022', '612954', '7386739'],
  },
  {
    id: 'clinton-v15-balkans',
    name: 'Clinton Vol XV · Wars in the Balkans, 1993–1995',
    note: 'FRUS Being Researched. Bosnia war, Dayton, NATO airstrikes, Holbrooke shuttle, IFOR.',
    q: '(Bosnia OR Yugoslavia OR Sarajevo OR Dayton OR Milosevic OR Karadzic OR Mladic OR Holbrooke OR IFOR OR Srebrenica OR Croatia)',
    from: 1993, to: 1995,
    scope: ['clinton', '7386505', '7386739'],
  },
  {
    id: 'clinton-v20-fsu-arms',
    name: 'Clinton Vol XX · Arms Control & Nonproliferation in the FSU, Dec 1991–Dec 1994',
    note: 'FRUS Being Researched. Lisbon Protocol, Trilateral Statement, Ukraine denuclearization, Nunn-Lugar.',
    q: '(Ukraine OR Belarus OR Kazakhstan OR "Lisbon Protocol" OR Trilateral OR "Nunn-Lugar" OR denuclearization OR Budapest OR "Massandra")',
    from: 1993, to: 1995,
    scope: ['clinton', 'bush41', '7388773', '7386739', '2163580'],
  },
  {
    id: 'clinton-v22-europe-highlevel',
    name: 'Clinton Vol XXII · Europe: High-Level Contacts',
    note: 'FRUS Being Researched. Presidential & secretarial meetings with European leaders.',
    q: '(summit OR Yeltsin OR Major OR Blair OR Chirac OR Kohl OR Schroeder OR Prodi OR Aznar OR "high-level" OR bilateral)',
    from: 1993, to: 2001,
    scope: ['clinton', '7386505', '7386739'],
  },
  {
    id: 'clinton-v24-europe-policy',
    name: 'Clinton Vol XXIV · Europe: Policy, 1997–2000',
    note: 'FRUS Being Researched. NATO Madrid Summit, second-tranche enlargement, Russia-NATO Founding Act, Kosovo aftermath.',
    q: '(NATO OR "Partnership for Peace" OR enlargement OR Madrid OR Helsinki OR "Founding Act" OR Kosovo OR ESDP)',
    from: 1997, to: 2001,
    scope: ['clinton', '7386505', '7386739'],
  },
  {
    id: 'clinton-v25-northern-ireland',
    name: 'Clinton Vol XXV · Northern Ireland Peace Process',
    note: 'FRUS Being Researched. Good Friday Agreement, Mitchell talks, Adams visa, IRA decommissioning.',
    q: '("Northern Ireland" OR "Good Friday" OR IRA OR "Gerry Adams" OR Mitchell OR Stormont OR "Sinn Fein" OR Trimble OR Hume OR decommissioning)',
    from: 1993, to: 2000,
    scope: ['clinton', '7386505', '7386739'],
  },
  {
    id: 'clinton-v27-southern-africa',
    name: 'Clinton Vol XXVII · South Africa; Southern Africa',
    note: 'FRUS Being Researched. Mandela presidency, post-apartheid policy, SADC, Angola, Mozambique.',
    q: '("South Africa" OR Mandela OR Mbeki OR apartheid OR SADC OR Angola OR Mozambique OR Zimbabwe OR Namibia OR Botswana)',
    from: 1993, to: 2001,
    scope: ['clinton', '7385959', '7386739'],
  },
  {
    id: 'clinton-v28-rwanda',
    name: 'Clinton Vol XXVIII · Rwanda; Central Africa',
    note: 'FRUS Being Researched. UNAMIR, decision not to intervene, Great Lakes refugees, Zaire/Congo war.',
    q: '(Rwanda OR Burundi OR Zaire OR Congo OR Kabila OR UNAMIR OR "Great Lakes" OR Hutu OR Tutsi OR genocide OR Mobutu)',
    from: 1993, to: 2000,
    scope: ['clinton', '7385959', '7386739'],
  },
  {
    id: 'clinton-v32-central-america',
    name: 'Clinton Vol XXXII · Central America',
    note: 'FRUS Being Researched. Post-conflict Central America, Mitch reconstruction, immigration, drug interdiction.',
    q: '(Nicaragua OR "El Salvador" OR Guatemala OR Honduras OR "Costa Rica" OR Panama OR Mitch OR ESF OR "Central America")',
    from: 1993, to: 2001,
    scope: ['clinton', '7386739'],
  },
];
