/**
 * Colori personalizzati per l'app della pizzeria
 * Palette calda e appetitosa ispirata ai colori della pizza
 */

export const PizzaColors = {
  // Colori principali
  primary: "#E53E3E", // Rosso pomodoro
  secondary: "#38A169", // Verde basilico
  accent: "#F6AD55", // Arancione caldo

  // Colori di stato
  success: "#38A169", // Verde per successi
  warning: "#F6AD55", // Arancione per avvisi
  error: "#E53E3E", // Rosso per errori
  info: "#3182CE", // Blu per informazioni

  // Colori neutri
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#ffeec9", // Sfondo principale
    100: "#EDF2F7", // Sfondo secondario
    200: "#E2E8F0", // Bordi
    300: "#CBD5E0", // Bordi scuri
    400: "#A0AEC0", // Testo secondario
    500: "#718096", // Testo muted
    600: "#4A5568", // Testo normale
    700: "#5C4033", // Testo scuro
    800: "#1A202C", // Sfondo scuro
    900: "#171923", // Sfondo molto scuro
  },

  // Colori specifici per la pizzeria
  pizza: {
    crust: "#D69E2E", // Colore della crosta
    sauce: "#E53E3E", // Colore del pomodoro
    cheese: "#F6E05E", // Colore della mozzarella
    basil: "#38A169", // Colore del basilico
    pepperoni: "#C53030", // Colore del salame
  },

  // Gradienti
  gradients: {
    primary: ["#E53E3E", "#C53030"],
    secondary: ["#38A169", "#2F855A"],
    accent: ["#F6AD55", "#ED8936"],
    sunset: ["#F6AD55", "#E53E3E"],
  },

  // Ombre
  shadows: {
    small: {
      shadowColor: "#E53E3E",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: "#E53E3E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: "#E53E3E",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export default PizzaColors;
