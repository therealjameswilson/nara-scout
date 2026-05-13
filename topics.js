// NARA Scout — Topic Packs 2.0
//
// Source of truth: the SOURCES section of each PUBLISHED FRUS volume for the
// Reagan and George H.W. Bush administrations, as listed on
// history.state.gov/historicaldocuments/{reagan,bush-ghw}
// (snapshot: May 2026 — 12 Reagan volumes + 1 Bush 41 volume published).
//
// Each pack is keyed to a single published volume. Its scope is NAID-precise:
// only the NARA Presidential Library collections the volume's Sources page
// actually cites. Queries are derived from the volume's topical scope and the
// named programs / staffers / lot files that the Sources section highlights.
//
// Pack fields:
//   id    - unique slug
//   name  - "Vol N · Title"
//   note  - 1-line scope + key cited collections (shown under date range)
//   q     - keyword query tuned to the volume's topic
//   from  - volume's actual start year
//   to    - volume's actual end year
//   scope - array of NAIDs (strings) AND/OR admin tokens ("reagan","bush41","clinton")
//           The engine treats numeric strings as NARA ancestor-collection NAIDs.
//
// Reagan NSC Executive Secretariat NAIDs you'll see below:
//   1188      Executive Secretariat (umbrella)
//   7451593   European & Soviet Affairs Directorate
//   12024979  Near East & South Asia Affairs Directorate
//   40359468  African Affairs Directorate
//   12024796  Latin American Affairs Directorate
//   12024916  Asian Affairs Directorate
//   12011340  Political-Military Affairs Directorate
//   12011341  Defense Policy Directorate
//   12011342  Defense Programs & Arms Control Directorate
//   12024797  Intelligence Directorate
//   12024920  Political Affairs Directorate
//   12024929  Coordination Office
//   67603959  International Economic Affairs Directorate
//   60693877  Legal Advisor Office
//   364672879 Crisis Management Center
//   364776614 Counterterrorism & Narcotics Directorate
//
// Reagan adjacent collections cited by Sources:
//   6120375   Domestic Policy Council (Bledsoe / DPC records)
//   7821173   Economic Policy Council
//   2618827   Ralph Bledsoe Files (cabinet councils — within Reagan Library)
//
// Bush 41 collections cited by Sources for v31 (START I):
//   2163580   Records of the National Security Council (Bush 41 umbrella)
//   2579957   Records of the Office of the Vice President (Bush 41) — VP Bush era continuity

window.TOPIC_PACKS = [
  // ===================================================================
  // Reagan Administration — Published Volumes
  // ===================================================================
  {
    id: 'frus1981-88v01',
    name: 'Vol I · Foundations of Foreign Policy',
    note: 'Reagan public statements + transition. Speechwriting Research Office, WHORM Subject File, 1980 Transition Papers, Exec Sec Subject File, McFarlane/Gergen/Bailey/Dobriansky/Fortier staff files.',
    q: 'Reagan speech OR speechwriting OR "Public Papers" OR statement OR "Transition Papers" OR doctrine OR "national strategy" OR address',
    from: '1980',
    to: '1989',
    scope: ['1188', 'reagan'],
  },
  {
    id: 'frus1981-88v03',
    name: 'Vol III · Soviet Union, Jan 1981–Jan 1983',
    note: 'NSDDs, NSC/NSPG meetings, USSR Country File, Head of State File. Clark/McFarlane files; Pipes & Matlock (European & Soviet Affairs Directorate). Shultz Papers; Haig Papers (LoC). State Lot 93D188 memcons.',
    q: 'Soviet OR USSR OR Moscow OR Brezhnev OR Andropov OR Gromyko OR INF OR "arms control" OR "NSDD" OR Pipes OR Matlock',
    from: '1981',
    to: '1983',
    scope: ['1188', '7451593'],
  },
  {
    id: 'frus1981-88v04',
    name: 'Vol IV · Soviet Union, Jan 1983–Mar 1985',
    note: 'Clark/McFarlane files; Matlock (European & Soviet Affairs Directorate USSR Files). NSC staff Lenczowski, Linhard, Lehman, Kraemer. State Exec Sec Lot files 91D257, 92D52, 92D630, 93D188, 94D92, 96D262.',
    q: 'Soviet OR USSR OR Andropov OR Chernenko OR Gromyko OR INF OR START OR "arms control" OR Matlock OR KAL-007 OR "Able Archer"',
    from: '1983',
    to: '1985',
    scope: ['1188', '7451593'],
  },
  {
    id: 'frus1981-88v05',
    name: 'Vol V · Soviet Union, Mar 1985–Oct 1986',
    note: 'McFarlane/Poindexter files; Matlock (European & Soviet Affairs USSR Files). NSC staff Lenczowski, Linhard, Lehman, Kraemer. Geneva and Reykjavik summit prep.',
    q: 'Gorbachev OR Soviet OR USSR OR Geneva OR Reykjavik OR INF OR SDI OR "arms control" OR Shevardnadze OR Matlock',
    from: '1985',
    to: '1986',
    scope: ['1188', '7451593'],
  },
  {
    id: 'frus1981-88v06',
    name: 'Vol VI · Soviet Union, Oct 1986–Jan 1989',
    note: 'Poindexter/Carlucci/Powell files; Matlock & Ermarth (European & Soviet Affairs Senior Director). Linhard (Defense Programs & Arms Control). Shultz Papers. INF Treaty, Moscow Summit.',
    q: 'Gorbachev OR Soviet OR USSR OR Reykjavik OR Moscow OR INF OR "INF Treaty" OR Shevardnadze OR Matlock OR Ermarth',
    from: '1986',
    to: '1989',
    scope: ['1188', '7451593', '12011342'],
  },
  {
    id: 'frus1981-88v10',
    name: 'Vol X · Eastern Europe',
    note: 'European & Soviet Directorate staffers Paula Dobriansky and Rudolf Perina Files. John Whitehead Lot File 89D139. CIA NIC Registry of NIE/SNIE. Poland-adjacent.',
    q: 'Poland OR Hungary OR Czechoslovakia OR Romania OR Bulgaria OR Yugoslavia OR "Eastern Europe" OR Solidarity OR Whitehead OR Dobriansky OR Perina',
    from: '1981',
    to: '1989',
    scope: ['1188', '7451593'],
  },
  {
    id: 'frus1981-88v11',
    name: 'Vol XI · START I',
    note: 'Exec Sec USSR Country / Head of State / NSDDs / NSC / NSPG. National Security Advisors Allen/Clark/McFarlane/Poindexter/Carlucci/Powell + Linhard. State Lots 90D397 (Nitze), 01D127 (Timbie).',
    q: 'START OR "Strategic Arms Reduction" OR Geneva OR Nitze OR Timbie OR Kampelman OR "arms control" OR Soviet OR USSR',
    from: '1981',
    to: '1989',
    scope: ['1188', '12011342', '7451593'],
  },
  {
    id: 'frus1981-88v13',
    name: 'Vol XIII · Conflict in the South Atlantic, 1981–1984',
    note: 'Falklands / Malvinas crisis. Exec Sec Country File (Argentina, UK), Latin American Affairs Directorate, European & Soviet Affairs (UK), Haig/Shultz papers, OSD/JCS records.',
    q: 'Falkland OR Malvinas OR Argentina OR "United Kingdom" OR "South Atlantic" OR Haig OR Galtieri OR Thatcher OR "Latin America"',
    from: '1981',
    to: '1984',
    scope: ['1188', '12024796', '7451593'],
  },
  {
    id: 'frus1981-88v24',
    name: 'Vol XXIV · North Africa',
    note: 'Reagan Library Exec Sec Africa Country File, Agency File, Head of State File; Near East & South Asia Affairs NSC Directorate. Bush VP records (Donald Gregg Files) at Bush Library.',
    q: 'Libya OR Qadhafi OR Gaddafi OR Morocco OR Algeria OR Tunisia OR Mauritania OR "North Africa" OR Hassan OR Gregg',
    from: '1981',
    to: '1989',
    scope: ['1188', '12024979', '40359468', '2579957'],
  },
  {
    id: 'frus1981-88v38',
    name: 'Vol XXXVIII · Int\u2019l Economic Development; Debt; Foreign Assistance',
    note: 'Exec Sec NSC Trip File (G-7 / Cancun summits), Subject File. International Economic Affairs Directorate staff (Robinson, Bailey, Danzansky, Wigg, Farrar, McMinn). DPC Bledsoe Files (CCEA). Treasury RG 56.',
    q: '"economic summit" OR G-7 OR Cancun OR debt OR "foreign assistance" OR "development assistance" OR "World Bank" OR IMF OR Bretton',
    from: '1981',
    to: '1989',
    scope: ['1188', '67603959', '6120375', '7821173', '2618827'],
  },
  {
    id: 'frus1981-88v41',
    name: 'Vol XLI · Global Issues II',
    note: 'Michael Guhin Files; NSC Subject File; DPC (Bledsoe). Human rights (Abrams, Schifter lot files); UN Women conference (Nairobi); refugees, AIDS, environment. Bush VP materials.',
    q: '"human rights" OR refugee OR AIDS OR environment OR "ozone" OR whaling OR "population control" OR Abrams OR Schifter OR Guhin OR Nairobi',
    from: '1981',
    to: '1989',
    scope: ['1188', '6120375', '2618827'],
  },
  {
    id: 'frus1981-88v44p1',
    name: 'Vol XLIV·1 · National Security Policy, 1985–1988',
    note: 'NSC Exec Sec USSR / Head of State / NSDDs / NSC / NSPG. NSAs McFarlane/Poindexter/Carlucci/Powell. NSC staffers Cockell, Donley, Kraemer, Linhard. Shultz, Carlucci, Ikle papers; PROFS messages; NSC "W files".',
    q: '"national security" OR NSDD OR NSPG OR strategy OR "arms control" OR Carlucci OR Poindexter OR Powell OR McFarlane OR Ikle',
    from: '1985',
    to: '1988',
    scope: ['1188', '12011342', '12011341', '12011340'],
  },

  // ===================================================================
  // George H.W. Bush Administration — Published Volumes
  // ===================================================================
  {
    id: 'frus1989-92v31',
    name: 'Vol XXXI · START I, 1989–1991',
    note: 'Bush NSC Institutional H-Files (NSC / Deputies Committee / NSDs). Scowcroft, Gates; NSC staff Gordon, Kanter. Bush VP records (Reagan era continuity, Gregg/Watson). State Lots 01D127 / 05D259 (Timbie). Baker Papers (Princeton).',
    q: 'START OR "Strategic Arms Reduction" OR Scowcroft OR Gates OR Kanter OR Timbie OR Baker OR Geneva OR "arms control" OR Soviet OR Gorbachev',
    from: '1989',
    to: '1991',
    scope: ['2163580', '2579957'],
  },
];
