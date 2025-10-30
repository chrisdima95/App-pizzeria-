/**
 * Colori personalizzati per l'app della pizzeria.
 * La palette si basa su toni caldi (marrone pizza, verde basilico, arancio, rosso pomodoro) coerenti con il brand.
 */
export const PizzaColors = {
  // Colori principali per branding/app (usati in bottoni, header, elementi dominanti)
  primary: "#703537", // Marrone scuro per bottoni
  secondary: "#38A169", // Verde tipico del basilico
  accent: "#F6AD55", // Arancio per highlights e azioni

  // Colori per stato (`success`, `warning`, ecc...): da usare per badge, alert, notifiche
  // Success = verde diverso da secondary; Warning = tono arancio; Error = rosso acceso
  success: "#22C55E", 
  warning: "#F6AD55",
  error: "#DC2626",
  info: "#3182CE", // Informazioni neutre con blu

  // Colori d'urgenza/highlights (es. offerte urgenti, attenzione, promozioni):
  urgent: "#E53E3E", // Rosso pomodoro
  highlight: "#F6E05E", // Giallo mozzarella

  // Grigi "semanticizzati" per sfondi, bordi, testo secondario/primario, usando una scala simile a Tailwind (50-900)
  // Più il valore è alto, più scuro
  gray: {
    50: "#ffeec9", // Sfondo principale più chiaro
    100: "#EDF2F7", // Sfondo secondario
    200: "#E2E8F0", // Bordi
    300: "#CBD5E0", // Bordi scuri
    400: "#A0AEC0", // Testo secondario
    500: "#718096", // Testo muted
    600: "#4A5568", // Testo normale
    700: "#2D1B1B", // Testo scuro - miglior contrasto (4.5:1)
    800: "#1A202C", // Sfondo scuro
    900: "#171923", // Sfondo molto scuro
  },

  // Colori pizza figurativi, per branding/mascotte/icona
  pizza: {
    crust: "#D69E2E",
    sauce: "#E53E3E",
    cheese: "#F6E05E",
    basil: "#38A169",
    pepperoni: "#C53030",
  },

  // Gradients usati per effetti sfumatura su bottoni/componenti
  gradients: {
    primary: ["#703537", "#5C2D2A"],
    secondary: ["#38A169", "#2F855A"],
    accent: ["#F6AD55", "#ED8936"],
    sunset: ["#F6AD55", "#703537"],
    urgent: ["#E53E3E", "#C53030"],
    highlight: ["#F6E05E", "#F4D03F"],
  },

  // Ombre uniformi per elementi "elevati" (usati da componenti UI)
  shadows: {
    small: {
      shadowColor: "#703537",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: "#703537",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: "#703537",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export default PizzaColors;
