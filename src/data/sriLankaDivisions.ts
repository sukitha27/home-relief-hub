export interface DSDivision {
  name: string;
  gnDivisions: string[];
}

export interface DistrictData {
  name: string;
  dsDivisions: DSDivision[];
}

export const sriLankaDistricts: DistrictData[] = [
  {
    name: "Colombo",
    dsDivisions: [
      {
        name: "Colombo Divisional Secretariat",
        gnDivisions: [
          "Sammanthranapura", "Mattakkuliya", "Modara", "Madampitiya", "Mahawatta",
          "Aluthmawatha", "Lunupokuna", "Bloemendhal", "Kotahena East", "Kotahena West",
          "Kochchikade North", "Jinthupitiya", "Massangar Street", "New Bazaar",
          "Grandpass South", "Grandpass North", "Nawagampura", "Maligawatta East",
          "Kettarama", "Aluthkade East", "Aluthkade West", "Kochchikade South",
          "Pettah", "Fort", "Galle Face", "Slave Island", "Hunupitiya", "Suduwella",
          "Keselwatta", "Panchikawatta", "Maligawatta West", "Maligakanda", "Maradana",
          "Ibbanwala", "Wekanda", "Wadulla", "Sedawatta", "Halmulla", "Kotuvila",
          "Veheragoda", "Orugodawatta", "Meethotamulla", "Welewaththa", "Kiththampahuwa",
          "Wennawatta", "Mahabuthgamuwa B", "Kuda Buthgamuwa", "Kelanimulla", "Ambathale",
          "Mulleriyawa North", "Belagama", "Kotikawatta East", "Maha Buthgamuwa A",
          "Maha Buthgamuwa C", "Wellampitiya", "Kuriniyawatta", "Kolonnawa", "Dahampura",
          "Singhapura", "Megoda Kolonnawa", "Bopeththa", "Batalandahena", "Kotikawatta West",
          "Mulleriyawa South", "Malgama", "Udumulla North", "Maligagodella", "Rajasinghagama",
          "Udumulla South", "Himbutana East", "Himbutana West", "Malpura", "Gothatuwa New Town",
          "Kajugahawatta", "Gothatuwa", "Salamulla", "Wijayapura", "Gajabapura", "Madinnagoda",
          "Elhena", "Dodamgahahena", "Welivita", "Raggahawatta", "Hewagama", "Kaduwela",
          "Pahala Bomiriya", "Ihala Bomiriya", "Wekewatta", "Nawagamuwa", "Pahala Bomiriya B",
          "Welihinda", "Kothalawala", "Mahadeniya", "Thalahena North", "Malabe North",
          "Thunadahena", "Korathota", "Nawagamuwa South", "Batewela", "Ranala", "Dedigamuwa",
          "Embilladeniya", "Welipillewa", "Shanthalokagama", "Pore", "Malabe East",
          "Malabe West", "Thalangama North B", "Thalahena South", "Muttettugoda",
          "Thalangama North A", "Walpola", "Kalapaluwawa", "Kotuwegoda", "Subhoothipura",
          "Udumulla", "Battaramulla North", "Batapotha", "Pothuarawa", "Hokandara North",
          "Oruwala", "Athurugiriya", "Thaldiyawala", "Boralugoda", "Hokandara East",
          "Arangala", "Evarihena", "Kumaragewatta", "Jayawadanagama", "Aruppitiya",
          "Asiri Uyana", "Battaramulla South", "Rajamalwatta", "Pahalawela", "Wickramasinghapura",
          "Wellangiriya", "Hokandara South", "Athurugiriya South", "Jalthara", "Henpita",
          "Atigala West", "Atigala East", "Batawala", "Walpita", "Nawalamulla", "Meegasmulla",
          "Habarakada North", "Mullegama North", "Mullegama South", "Habarakada South",
          "Panagoda Town", "Henawatta", "Meegoda North", "Panaluwa", "Watareka North",
          "Meegoda South", "Godagama North", "Panagoda West", "Panagoda East", "Habarakada Watta",
          "Homagama North", "Homagama West", "Homagama South", "Galavilawatta North",
          "Homagama Town", "Homagama East", "Pitipana Town", "Godagama South", "Kurunduwatta",
          "Gehenuwala", "Watareka South", "Ovitigama", "Kandhanawatta", "Kiriberiyakele",
          "Mawathagama", "Katuwana", "Galavilawatta South", "Niyadagala", "Hiripitiya",
          "Mambulgoda", "Kithulhena", "Siddamulla North", "Siddamulla South", "Mattegoda West",
          "Mattegoda Central A", "Mattegoda East", "Brahmanagama", "Deepangoda", "Magammana West",
          "Magammana East", "Uduwana", "Prasannapura", "Pitipana North", "Suwapubudugama",
          "Pitipana South", "Dolahena", "Diyagama East", "Diyagama West", "Kirigampamunuwa",
          "Mattegoda Central B", "Siyambalagoda North", "Kudamaduwa", "Sangarama",
          "Siyambalagoda South", "Rilawala", "Kahathuduwa West", "Kiriwattuduwa South",
          "Kiriwattuduwa North", "Moonamale - Yakahaluwa", "Kithulavila", "Kahathuduwa North",
          "Kahathuduwa East", "Kahathuduwa South", "Undurugoda", "Wethara", "Ambalangoda",
          "Heraliyawala", "Palagama", "Weniwelkola", "Bollathawa", "Kanampella West",
          "Kanampella East", "Manakada", "Eswatta North", "Kiriwandala North", "Kudagama",
          "Weralupitiya", "Seethagama", "Avissawella", "Ukwatta", "Agra place", "Eswatta South",
          "Ihala Kosgama North", "Thawalgoda", "Muruthagama", "Akaravita", "Kahatapitiya",
          "Kalu Aggala", "Salawa", "Pahala Kosagama West", "Pahala Kosgama East",
          "Ihala Kosgama South", "Miriswatta", "Aluth Ambalama", "Kiriwandala South",
          "Kotahera", "Seethawaka", "Aradhana Kanda", "Puwakpitiya South", "Puwakpitiya",
          "Egodagama", "Weragolla North", "Hingurala", "Kadugoada North", "Mawalgama",
          "Suduwella", "Gira Imbula", "Walauwathta", "Pahala Hanwella", "Hanwella Town",
          "Ihala Hanwella North", "Niripola", "Brandigampala", "Kadugoda South",
          "Weragolla South", "Digana", "Lahirugama", "Mabula", "Welikanna", "Kahahena",
          "Neluwattuduwa", "Diddeniya North", "Ihala Hanwella South", "Pahathgama",
          "Jayaweeragoda", "Koodaluvila", "Thunnana East", "Diddeniya South", "Elamalawala",
          "Ilukovita", "Koswatta", "Pagnagula", "Pelpola", "Kudakanda", "Thunnana West",
          "Mawathagama West", "Mawathagama East", "Pinnawala North", "Pinnawala South",
          "Waga North", "Waga East", "Thummodara", "Waga South", "Siyambalawa", "Pahala Bope",
          "Halpe", "Waga West", "Uggalla", "Wewelpanawa", "Pitumpe North", "Pitumpe South",
          "Galagedara East", "Galagedara North", "Galagedara South", "Padukka", "Arukwatta North",
          "Arukwatta South", "Ganegoda", "Angampitiya", "Weragala", "Angamuwa", "Udumulla",
          "Poregedara", "Pahala Padukka", "Liyanwala", "Kurugala", "Madulawa South",
          "Madulawa North", "Horakandawala", "Dampe", "Beruketiya", "Horagala West",
          "Horagala East", "Beliattavila", "Miriyagalla", "Malagala", "Kahawala", "Yatawathura",
          "Mahingala", "Ihala Bope", "Gurulana", "Udagama", "Dabora", "Mirihana South",
          "Mirihana North", "Madiwela", "Thalawathugoda West", "Thalawathugoda East",
          "Kalalgoda", "Kottawa East", "Rukmale West", "Rukmale East A", "Rukmale East B",
          "Liyanagoda", "Kottawa North", "Depanama", "Polwatta", "Pamunuwa", "Thalapathpitiya",
          "Pragathipura", "Udahamulla East", "Udahamulla West", "Pathiragoda", "Maharagama East",
          "Maharagama West", "Dambahena", "Pannipitiya North", "Kottawa West", "Kottawa South",
          "Malapalla West", "Malapalla East", "Makumbura North", "Makumbura South", "Kottawa Town",
          "Pannipitiya South", "Maharagama Town", "Godigamuwa South", "Godigamuwa South B",
          "Godigamuwa North", "Wattegedara", "Navinna", "Wijerama", "Gangodavila South B",
          "Jambugasmulla", "Obesekarapura", "Welikada West", "Welikada East", "Rajagiriya",
          "Welikada North", "Nawala West", "Koswatta", "Ethulkotte West", "Ethulkotte",
          "Pitakotte East", "Pitakotte", "Pitakotte West", "Nawala East", "Nugegoda West",
          "Pagoda", "Nugegoda", "Pagoda East", "Gangodavila North", "Gangodavila South",
          "Gangodavila East", "Kollupitiya", "Bambalapitiya", "Kurunduwatta", "Kuppiyawatta West",
          "Kuppiyawatta East", "Dematagoda", "Wanathamulla", "Borella North", "Borella South",
          "Gothamipura", "Narahenpita", "Thimbirigasyaya", "Milagiriya", "Havelock Town",
          "Kirula", "Kirulapone", "Wellawatta North", "Wellawatta South", "Pamankada West",
          "Pamankada East", "Sri Saranankara", "Vilawala", "Dutugemunu", "Kohuwala",
          "Kalubowila", "Hathbodhiya", "Galwala", "Dehiwala West", "Dehiwala East", "Udyanaya",
          "Nedimala", "Malwatta", "Jayathilaka", "Karagampitiya", "Kawdana East", "Kawdana West",
          "Watarappala", "Wathumulla", "Katukurunduwatta", "Attidiya North", "Attidiya South",
          "Piriwena", "Wedikanda", "Vihara", "Rathmalana West", "Rathmalana East", "Kandawala",
          "Angulana North", "Kaldemulla", "Soysapura North", "Soysapura South", "Dahampura",
          "Thelawala North", "Borupana", "Thelawala South", "Lakshapathiya North",
          "Lakshapathiya Central", "Angulana South", "Uyana South", "Uyana North",
          "Rawathawatta South", "Rawathawatta East", "Lakshapathiya South", "Kuduwamulla",
          "Katubedda", "Molpe", "Moratumulla North", "Kadalana", "Rawathawatta West", "Idama",
          "Uswatta", "Moratuwella South", "Indibedda West", "Moratumulla East", "Moratumulla West",
          "Villorawatta East", "Villorawatta West", "Indibedda East", "Moratuwella North",
          "Moratuwella West", "Koralawella North", "Koralawella East", "Koralawella West",
          "Koralawella South", "Katukurunda North", "Katukurunda South", "Egoda Uyana North",
          "Egoda Uyana Central", "Egoda Uyana South", "Pepiliyana West", "Pepiliyana East",
          "Divulpitiya East", "Divulpitiya West", "Bellanvila", "Boralesgamuwa West A",
          "Boralesgamuwa West C", "Rattanapitiya", "Egodawatta", "Boralesgamuwa East A",
          "Boralesgamuwa West B", "Werahera North", "Boralesgamuwa East B", "Neelammahara",
          "Katuwawala North", "Vishwakalawa", "Werahera South", "Katuwawala South", "Niwanthidiya",
          "Erewwala West", "Erewwala North", "Erewwala East", "Rathmaldeniya", "Mahalwarawa",
          "Bangalawatta", "Pelenwatta East", "Pelenwatta North", "Pelenwatta West", "Paligedara",
          "Kaliyammahara", "Bokundara", "Thumbovila South", "Thumbovila North", "Wewala West",
          "Wewala East", "Thumbovila West", "Mampe North", "Makuludoowa", "Gorakapitiya",
          "Nampamunuwa", "Mavittara North", "Mampe East", "Bodhirajapura", "Mampe West",
          "Mampe South", "Kolamunna", "Suwarapola East", "Suwarapola West", "Hedigama",
          "Batakettara North", "Kesbewa North", "Kesbewa East", "Mavittara South",
          "Honnanthara North", "Honnanthara South", "Makandana East", "Kesbewa South",
          "Batakettara South", "Madapatha", "Delthara West", "Delthara East", "Dampe",
          "Makandana West", "Nivungama", "Halpita", "Horathuduwa", "Morenda", "Batuwandara North",
          "Batuwandara South", "Jamburaliya", "Polhena", "Regidel Watta", "Kahapola",
          "Mount Lavinia"
        ]
      },
      {
        name: "Dehiwala Divisional Secretariat",
        gnDivisions: [
          "Dehiwala West", "Dehiwala East", "Mount Lavinia", "Wattala", "Sedawatta",
          "Pamunuwa", "Thalapathpitiya", "Pragathipura", "Udahamulla East", "Udahamulla West"
        ]
      },
      {
        name: "Homagama Divisional Secretariat",
        gnDivisions: [
          "Homagama North", "Homagama West", "Homagama South", "Galavilawatta North",
          "Homagama Town", "Homagama East", "Pitipana Town", "Godagama South"
        ]
      },
      {
        name: "Kaduwela Divisional Secretariat",
        gnDivisions: [
          "Kaduwela", "Pahala Bomiriya", "Ihala Bomiriya", "Wekewatta", "Nawagamuwa",
          "Pahala Bomiriya B", "Welihinda", "Kothalawala", "Mahadeniya"
        ]
      },
      {
        name: "Kesbewa Divisional Secretariat",
        gnDivisions: [
          "Kesbewa North", "Kesbewa East", "Kesbewa South", "Batakettara North",
          "Batakettara South", "Madapatha", "Delthara West", "Delthara East"
        ]
      },
      {
        name: "Kolonnawa Divisional Secretariat",
        gnDivisions: [
          "Kolonnawa", "Dahampura", "Singhapura", "Megoda Kolonnawa", "Bopeththa",
          "Batalandahena", "Kotikawatta West", "Mulleriyawa South"
        ]
      },
      {
        name: "Kotte Divisional Secretariat",
        gnDivisions: [
          "Nugegoda", "Kotte", "Ethul Kotte", "Pita Kotte", "Battaramulla", "Rajagiriya",
          "Nawala", "Koswatta"
        ]
      },
      {
        name: "Maharagama Divisional Secretariat",
        gnDivisions: [
          "Maharagama East", "Maharagama West", "Maharagama Town", "Godigamuwa South",
          "Godigamuwa North", "Wattegedara", "Navinna"
        ]
      },
      {
        name: "Moratuwa Divisional Secretariat",
        gnDivisions: [
          "Moratuwella South", "Moratuwella North", "Moratuwella West", "Koralawella North",
          "Koralawella East", "Koralawella West", "Koralawella South"
        ]
      },
      {
        name: "Padukka Divisional Secretariat",
        gnDivisions: [
          "Padukka", "Arukwatta North", "Arukwatta South", "Ganegoda", "Angampitiya",
          "Weragala", "Angamuwa", "Udumulla"
        ]
      },
      {
        name: "Ratmalana Divisional Secretariat",
        gnDivisions: [
          "Ratmalana West", "Ratmalana East", "Kandawala", "Angulana North", "Kaldemulla",
          "Soysapura North", "Soysapura South"
        ]
      },
      {
        name: "Seethawaka Divisional Secretariat",
        gnDivisions: [
          "Seethawaka", "Aradhana Kanda", "Puwakpitiya South", "Puwakpitiya", "Egodagama",
          "Weragolla North", "Hingurala", "Kadugoada North"
        ]
      }
    ]
  },
  // Other districts would follow the same pattern
  {
    name: "Gampaha",
    dsDivisions: [
      {
        name: "Gampaha Divisional Secretariat",
        gnDivisions: ["Gampaha Town", "Yakkala", "Mirigama", "Veyangoda", "Kirindiwela"]
      },
      {
        name: "Negombo Divisional Secretariat",
        gnDivisions: ["Negombo Town", "Kochchikade", "Kattuwa", "Dalupotha", "Kurana"]
      }
      // Add more DS divisions for Gampaha
    ]
  },
  // Add other districts similarly...
];

export const districts = sriLankaDistricts.map(district => district.name);

export function getDSDivisions(districtName: string): string[] {
  const district = sriLankaDistricts.find(d => d.name === districtName);
  return district ? district.dsDivisions.map(ds => ds.name) : [];
}

export function getGNDivisions(districtName: string, dsDivisionName: string): string[] {
  const district = sriLankaDistricts.find(d => d.name === districtName);
  if (!district) return [];
  
  const dsDivision = district.dsDivisions.find(ds => ds.name === dsDivisionName);
  return dsDivision ? dsDivision.gnDivisions : [];
}