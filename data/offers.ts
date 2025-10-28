import { Offer } from './offer-carousel';

// Offerte per bambini (5-12 anni)
export const kidsOffers: Offer[] = [
  {
    id: "kids1",
    name: "Pizza Margherita Kids",
    price: 4.99,
    originalPrice: 6.99,
    description: "La pizza preferita dai bambini con ingredienti freschi",
    emoji: "",
    discount: 29,
    category: "kids",
    ageGroup: "5-12",
    target: "bambini"
  },
  {
    id: "kids2",
    name: "Pizza Prosciutto Kids",
    price: 5.49,
    originalPrice: 7.49,
    description: "Prosciutto cotto e mozzarella per i più piccoli",
    emoji: "",
    discount: 27,
    category: "kids",
    ageGroup: "5-12",
    target: "bambini"
  },
  {
    id: "kids3",
    name: "Pizza Wurstel Kids",
    price: 5.99,
    originalPrice: 7.99,
    description: "Wurstel e patatine fritte sulla pizza",
    emoji: "",
    discount: 25,
    category: "kids",
    ageGroup: "5-12",
    target: "bambini"
  },
  {
    id: "kids4",
    name: "Pizza Quattro Formaggi Kids",
    price: 6.49,
    originalPrice: 8.49,
    description: "Formaggi delicati per i piccoli gourmet",
    emoji: "",
    discount: 24,
    category: "kids",
    ageGroup: "5-12",
    target: "bambini"
  }
];

// Offerte per ragazzi (13-25 anni)
export const teensOffers: Offer[] = [
  {
    id: "teens1",
    name: "Pizza Diavola Student",
    price: 6.99,
    originalPrice: 9.99,
    description: "Piccante e saporita per gli studenti",
    emoji: "",
    discount: 30,
    category: "teens",
    ageGroup: "13-25",
    target: "studenti"
  },
  {
    id: "teens2",
    name: "Pizza Capricciosa Promo",
    price: 7.99,
    originalPrice: 11.99,
    description: "Ricca e conveniente per i giovani",
    emoji: "",
    discount: 33,
    category: "teens",
    ageGroup: "13-25",
    target: "studenti"
  },
  {
    id: "teens3",
    name: "Pizza Tonno e Cipolle",
    price: 7.49,
    originalPrice: 10.49,
    description: "Sapore di mare per i palati giovani",
    emoji: "",
    discount: 29,
    category: "teens",
    ageGroup: "13-25",
    target: "studenti"
  },
  {
    id: "teens4",
    name: "Pizza Quattro Stagioni",
    price: 8.99,
    originalPrice: 12.99,
    description: "Tutte le stagioni in una pizza",
    emoji: "",
    discount: 31,
    category: "teens",
    ageGroup: "13-25",
    target: "studenti"
  }
];

// Offerte per adulti (26-50 anni)
export const adultsOffers: Offer[] = [
  {
    id: "adults1",
    name: "Pizza Bufala Premium",
    price: 9.99,
    originalPrice: 14.99,
    description: "Mozzarella di bufala DOP di qualità superiore",
    emoji: "",
    discount: 33,
    category: "adults",
    ageGroup: "26-50",
    target: "professionisti"
  },
  {
    id: "adults2",
    name: "Pizza Parma e Rucola",
    price: 10.99,
    originalPrice: 15.99,
    description: "Prosciutto di Parma DOP e rucola fresca",
    emoji: "",
    discount: 31,
    category: "adults",
    ageGroup: "26-50",
    target: "professionisti"
  },
  {
    id: "adults3",
    name: "Pizza Speck e Asiago",
    price: 9.49,
    originalPrice: 13.49,
    description: "Speck dell'Alto Adige e Asiago DOP",
    emoji: "",
    discount: 30,
    category: "adults",
    ageGroup: "26-50",
    target: "professionisti"
  },
  {
    id: "adults4",
    name: "Pizza Ortolana Gourmet",
    price: 8.99,
    originalPrice: 12.99,
    description: "Verdure fresche di stagione grigliate",
    emoji: "",
    discount: 31,
    category: "adults",
    ageGroup: "26-50",
    target: "professionisti"
  }
];

// Offerte per senior (50+ anni)
export const seniorsOffers: Offer[] = [
  {
    id: "seniors1",
    name: "Pizza Marinara Classica",
    price: 5.99,
    originalPrice: 8.99,
    description: "La tradizione napoletana autentica",
    emoji: "",
    discount: 33,
    category: "seniors",
    ageGroup: "50+",
    target: "senior"
  },
  {
    id: "seniors2",
    name: "Pizza Prosciutto e Funghi",
    price: 7.99,
    originalPrice: 11.99,
    description: "Un classico intramontabile",
    emoji: "",
    discount: 33,
    category: "seniors",
    ageGroup: "50+",
    target: "senior"
  },
  {
    id: "seniors3",
    name: "Pizza Patate e Salsiccia",
    price: 7.49,
    originalPrice: 10.49,
    description: "Comfort food della tradizione italiana",
    emoji: "",
    discount: 29,
    category: "seniors",
    ageGroup: "50+",
    target: "senior"
  },
  {
    id: "seniors4",
    name: "Pizza Salsiccia e Friarielli",
    price: 8.99,
    originalPrice: 12.99,
    description: "Sapore napoletano autentico",
    emoji: "",
    discount: 31,
    category: "seniors",
    ageGroup: "50+",
    target: "senior"
  }
];

// Offerte speciali per famiglie
export const familyOffers: Offer[] = [
  {
    id: "family1",
    name: "Pizza Margherita Famiglia",
    price: 12.99,
    originalPrice: 16.99,
    description: "Pizza grande per tutta la famiglia",
    emoji: "",
    discount: 24,
    category: "family",
    ageGroup: "all",
    target: "famiglie"
  },
  {
    id: "family2",
    name: "Pizza Quattro Stagioni Famiglia",
    price: 15.99,
    originalPrice: 20.99,
    description: "Tutti i gusti per tutti i palati",
    emoji: "",
    discount: 24,
    category: "family",
    ageGroup: "all",
    target: "famiglie"
  },
  {
    id: "family3",
    name: "Pizza Capricciosa Famiglia",
    price: 16.99,
    originalPrice: 21.99,
    description: "Ricca e abbondante per la famiglia",
    emoji: "",
    discount: 23,
    category: "family",
    ageGroup: "all",
    target: "famiglie"
  },
  {
    id: "family4",
    name: "Pizza Quattro Formaggi Famiglia",
    price: 14.99,
    originalPrice: 19.99,
    description: "Formaggi pregiati per tutti",
    emoji: "",
    discount: 25,
    category: "family",
    ageGroup: "all",
    target: "famiglie"
  }
];

// Offerte gourmet per appassionati
export const gourmetOffers: Offer[] = [
  {
    id: "gourmet1",
    name: "Pizza Tartufo e Porcini",
    price: 14.99,
    originalPrice: 19.99,
    description: "Tartufo nero e funghi porcini pregiati",
    emoji: "",
    discount: 25,
    category: "gourmet",
    ageGroup: "adult",
    target: "gourmet"
  },
  {
    id: "gourmet2",
    name: "Pizza Gamberi e Zucchine",
    price: 13.99,
    originalPrice: 18.99,
    description: "Gamberi freschi e zucchine delicate",
    emoji: "",
    discount: 26,
    category: "gourmet",
    ageGroup: "adult",
    target: "gourmet"
  },
  {
    id: "gourmet3",
    name: "Pizza Bresaola e Rucola",
    price: 12.99,
    originalPrice: 17.99,
    description: "Bresaola della Valtellina e rucola fresca",
    emoji: "",
    discount: 28,
    category: "gourmet",
    ageGroup: "adult",
    target: "gourmet"
  },
  {
    id: "gourmet4",
    name: "Pizza Bufala e Pomodorini",
    price: 11.99,
    originalPrice: 15.99,
    description: "Mozzarella di bufala e pomodorini del Vesuvio",
    emoji: "",
    discount: 25,
    category: "gourmet",
    ageGroup: "adult",
    target: "gourmet"
  }
];

// Tutte le offerte organizzate per sezione
export const offerSections = [
  {
    id: "kids",
    title: "Per i Piccoli Chef",
    subtitle: "Offerte speciali per bambini dai 5 ai 12 anni",
    offers: kidsOffers,
    icon: ""
  },
  {
    id: "teens",
    title: "Studenti in Pizza",
    subtitle: "Promozioni per ragazzi e studenti",
    offers: teensOffers,
    icon: ""
  },
  {
    id: "adults",
    title: "Professionisti Gourmet",
    subtitle: "Offerte premium per adulti lavoratori",
    offers: adultsOffers,
    icon: ""
  },
  {
    id: "seniors",
    title: "Tradizione Italiana",
    subtitle: "Classici della cucina italiana per senior",
    offers: seniorsOffers,
    icon: ""
  },
  {
    id: "family",
    title: "Pizza in Famiglia",
    subtitle: "Offerte speciali per tutta la famiglia",
    offers: familyOffers,
    icon: ""
  },
  {
    id: "gourmet",
    title: "Gourmet Experience",
    subtitle: "Pizze di alta qualità per veri appassionati",
    offers: gourmetOffers,
    icon: ""
  }
];

// Funzione per ottenere tutte le offerte
export const getAllOffers = (): Offer[] => {
  return [
    ...kidsOffers,
    ...teensOffers,
    ...adultsOffers,
    ...seniorsOffers,
    ...familyOffers,
    ...gourmetOffers
  ];
};
