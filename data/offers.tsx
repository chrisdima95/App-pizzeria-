import { Offer } from '../types/offer';

// Offerte generiche disponibili nella ruota della fortuna
export const wheelOffers: Offer[] = [
  {
    id: "offer1",
    name: "Pizza Margherita",
    price: 6.50,
    originalPrice: 8.50,
    description: "Pomodoro, mozzarella e basilico fresco",
    emoji: "",
    discount: 24,
    category: "classic"
  },
  {
    id: "offer2",
    name: "Pizza Diavola",
    price: 7.50,
    originalPrice: 10.50,
    description: "Pomodoro, mozzarella e salame piccante",
    emoji: "",
    discount: 29,
    category: "spicy"
  },
  {
    id: "offer3",
    name: "Pizza Quattro Stagioni",
    price: 8.50,
    originalPrice: 12.00,
    description: "Prosciutto, funghi, carciofi e olive",
    emoji: "",
    discount: 29,
    category: "classic"
  },
  {
    id: "offer4",
    name: "Pizza Capricciosa",
    price: 8.00,
    originalPrice: 11.00,
    description: "Prosciutto, funghi, carciofi e olive nere",
    emoji: "",
    discount: 27,
    category: "classic"
  },
  {
    id: "offer5",
    name: "Pizza Marinara",
    price: 5.50,
    originalPrice: 7.50,
    description: "Pomodoro, aglio, origano e olio",
    emoji: "",
    discount: 27,
    category: "vegan"
  },
  {
    id: "offer6",
    name: "Pizza Bufala",
    price: 9.50,
    originalPrice: 13.50,
    description: "Pomodoro, mozzarella di bufala e basilico",
    emoji: "",
    discount: 30,
    category: "premium"
  },
  {
    id: "offer7",
    name: "Pizza Prosciutto e Funghi",
    price: 8.00,
    originalPrice: 11.50,
    description: "Pomodoro, mozzarella, prosciutto e funghi",
    emoji: "",
    discount: 30,
    category: "classic"
  },
  {
    id: "offer8",
    name: "Pizza Quattro Formaggi",
    price: 9.00,
    originalPrice: 12.50,
    description: "Mozzarella, gorgonzola, parmigiano e fontina",
    emoji: "",
    discount: 28,
    category: "cheese"
  },
  {
    id: "offer9",
    name: "Pizza Ortolana",
    price: 7.00,
    originalPrice: 10.00,
    description: "Pomodoro, mozzarella e verdure di stagione",
    emoji: "",
    discount: 30,
    category: "vegetarian"
  },
  {
    id: "offer10",
    name: "Pizza Bresaola e Rucola",
    price: 10.00,
    originalPrice: 14.00,
    description: "Mozzarella, bresaola, rucola e pomodorini",
    emoji: "",
    discount: 29,
    category: "premium"
  },
  {
    id: "offer11",
    name: "Pizza Tonno e Cipolle",
    price: 8.00,
    originalPrice: 11.00,
    description: "Pomodoro, mozzarella, tonno e cipolle",
    emoji: "",
    discount: 27,
    category: "seafood"
  },
  {
    id: "offer12",
    name: "Pizza Patate e Salsiccia",
    price: 7.50,
    originalPrice: 10.50,
    description: "Mozzarella, patate, salsiccia e rosmarino",
    emoji: "",
    discount: 29,
    category: "rustic"
  }
];

// Funzione per ottenere tutte le offerte disponibili nella ruota
export const getAllOffers = (): Offer[] => {
  return wheelOffers;
};
