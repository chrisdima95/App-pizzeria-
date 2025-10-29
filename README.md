# 🍕 App Pizzeria - Documentazione Completa

Documentazione dettagliata della struttura completa del progetto App Pizzeria.

## 📋 Indice

1. [Panoramica del Progetto](#panoramica-del-progetto)
2. [Struttura delle Cartelle](#struttura-delle-cartelle)
3. [Dettagli dei File](#dettagli-dei-file)
4. [Tecnologie Utilizzate](#tecnologie-utilizzate)

---

## 📖 Panoramica del Progetto

**App Pizzeria** è un'applicazione mobile cross-platform sviluppata con **React Native** ed **Expo Router**, progettata per gestire ordini di pizze con funzionalità avanzate come:
- Menu completo con categorie di pizze (Rosse, Bianche, Speciali)
- Sistema di autenticazione per clienti e chef
- Carrello e checkout
- Ruota della fortuna per offerte esclusive
- Gestione ordini e profilo utente
- Interfaccia moderna con supporto dark/light mode

---

## 📁 Struttura delle Cartelle

### `app/` - Directory Principale dell'Applicazione

Contiene tutte le schermate (screen) dell'applicazione utilizzando il routing basato su file di Expo Router.

#### `app/_layout.tsx`
Layout principale dell'app che configura:
- Provider globali (AuthProvider, OrderProvider)
- Gestione tema (dark/light mode)
- Stack navigator con tutte le schermate principali
- Configurazione animazioni e transizioni

#### `app/index.tsx`
Schermata di benvenuto che mostra:
- Logo dell'app con mascotte
- Caricamento iniziale (2 secondi)
- Redirect automatico alle tab dopo il caricamento

#### `app/login.tsx`
Schermata di autenticazione che gestisce:
- Login utenti (email e password)
- Registrazione nuovi utenti (nome, cognome, email, password)
- Validazione form con messaggi di errore
- Gestione sessioni utente/chef separate
- Redirect automatico se già autenticati

#### `app/checkout.tsx`
Schermata del carrello che mostra:
- Lista degli articoli nel carrello con quantità e prezzo
- Controlli per modificare quantità o rimuovere articoli
- Swipe per eliminare articoli
- Riepilogo totale ordine
- Conferma ordine (per utenti loggati o ospiti)
- Svuotamento carrello

#### `app/pizza-details.tsx`
Schermata dettagli pizza che permette:
- Visualizzazione immagine e descrizione completa
- Selezione quantità (1-10)
- Personalizzazioni (mozzarella extra, doppio pomodoro, senza glutine, ecc.)
- Note speciali per l'ordine
- Calcolo prezzo totale con personalizzazioni
- Aggiunta al carrello con animazioni

#### `app/ordini.tsx`
Schermata storico ordini che mostra:
- Lista degli ordini confermati dell'utente
- Dettagli di ogni ordine (pizze, quantità, prezzi)
- Totale per ogni ordine
- Accesso riservato agli utenti autenticati

#### `app/chef-orders.tsx`
Schermata gestione ordini per il chef che permette:
- Visualizzazione di tutti gli ordini (da tutti gli utenti)
- Gestione stati ordine (pending, completed)
- Filtri per stato
- Aggiornamento stati in tempo reale

#### `app/modal.tsx`
Modal generico utilizzato in varie parti dell'app.

#### `app/modifica-profilo.tsx`
Schermata per modificare i dati del profilo utente.

#### `app/(tabs)/` - Tab Navigator (Navigazione a Tab)

Directory che contiene le schermate principali accessibili tramite tab bar in basso.

##### `app/(tabs)/_layout.tsx`
Configurazione del tab navigator con:
- 4 tab principali: Menu, Offerte, Profilo, Chef
- Icone personalizzate per ogni tab
- Animazioni haptic feedback
- Gestione colori per tema light/dark

##### `app/(tabs)/index.tsx` - **Schermata Menu**
Schermata principale che mostra:
- Header con mascotte
- Barra filtri per categorie (Rosse, Bianche, Speciali)
- Card consigliata dallo chef (randomizzata ad ogni avvio)
- Lista pizze filtrate per categoria
- Controlli quantità direttamente dalla lista
- Pulsante carrello flottante con badge quantità

##### `app/(tabs)/offerte.tsx` - **Schermata Offerte**
Schermata ruota della fortuna che permette:
- Ruota interattiva con tutte le offerte disponibili
- Spin per vincere offerte casuali
- Cooldown tra i giri (per evitare abusi)
- Gestione offerte riscattate (una sola volta per offerta)
- Requisito autenticazione per riscattare

##### `app/(tabs)/profilo.tsx` - **Schermata Profilo**
Schermata profilo utente che include:
- Avatar personalizzabile (foto profilo)
- Dati personali editabili (nome, cognome, email, data di nascita)
- Gestione foto profilo (camera o galleria)
- Link ai propri ordini
- Pulsante logout
- Gestione utenti ospiti (non loggati)

##### `app/(tabs)/chef.tsx` - **Schermata Chef**
Schermata login chef che permette:
- Autenticazione con credenziali chef
- Credenziali di test (chef@gmail.com / chef)
- Redirect automatico se già autenticato come chef
- Controllo sessioni separate (utente normale vs chef)

#### `app/(modals)/` - Modals

Directory per modals dell'applicazione.

##### `app/(modals)/nuovo-indirizzo.tsx`
Modal per aggiungere un nuovo indirizzo di consegna.

---

### `components/` - Componenti Riutilizzabili

Contiene tutti i componenti React riutilizzabili nell'applicazione.

#### `components/AuthGuard.tsx`
Componente guard che protegge le route che richiedono autenticazione, reindirizzando gli utenti non autenticati al login.

#### `components/ChefRecommendation.tsx`
Componente che mostra la pizza consigliata dallo chef, utilizzato nella schermata menu principale.

#### `components/haptic-tab.tsx`
Componente wrapper per i tab button con feedback haptic (vibrazioni) quando vengono premuti.

#### `components/TabHeader.tsx`
Header personalizzato per le schermate tab che include:
- Titolo della schermata
- Opzione per mostrare/nascondere la mascotte
- Stile consistente in tutta l'app

#### `components/themed-text.tsx`
Componente testo che si adatta automaticamente al tema (light/dark mode) dell'applicazione.

#### `components/themed-view.tsx`
Componente view che si adatta automaticamente al tema (light/dark mode) dell'applicazione.

#### `components/ui/` - Componenti UI Personalizzati

Sotto-cartella con componenti UI specifici per la pizzeria.

##### `components/ui/index.ts`
File di esportazione centralizzato per tutti i componenti UI, facilitando gli import.

##### `components/ui/collapsible.tsx`
Componente collapsibile (espandibile/contraibile) utilizzato per mostrare/nascondere contenuti.

##### `components/ui/cooldown-modal.tsx`
Modal che mostra il countdown della ruota della fortuna quando è in cooldown.

##### `components/ui/icon-symbol.tsx` e `icon-symbol.ios.tsx`
Componenti per icone simboliche:
- Versione generica per tutte le piattaforme
- Versione specifica iOS con supporto SF Symbols nativi

##### `components/ui/mascotte-icon.tsx`
Icona personalizzata della mascotte dell'applicazione.

##### `components/ui/offer-carousel.tsx`
Componente carosello per mostrare le offerte disponibili (non più utilizzato, sostituito dalla ruota).

##### `components/ui/pizza-badge.tsx`
Badge personalizzato per contrassegnare elementi (es. "Nuovo", "In Offerta").

##### `components/ui/pizza-button.tsx`
Pulsante personalizzato con stile tematico della pizzeria.

##### `components/ui/pizza-card.tsx`
Card personalizzata per mostrare le pizze nel menu.

##### `components/ui/pizza-divider.tsx`
Divisore visivo tematico.

##### `components/ui/pizza-loading.tsx`
Indicatore di caricamento personalizzato.

##### `components/ui/pizza-modal.tsx`
Modal personalizzato con supporto per:
- Titolo e messaggio
- Pulsanti personalizzabili
- Stile tematico

##### `components/ui/pizza-price.tsx`
Componente per formattare e mostrare i prezzi in modo consistente.

##### `components/ui/pizza-title.tsx`
Titolo personalizzato con stile tematico.

##### `components/ui/pizza-wheel.tsx`
Componente principale della ruota della fortuna che gestisce:
- Animazione di rotazione (esattamente 5 secondi)
- Selezione casuale dell'offerta
- Gestione cooldown
- Validazione offerte già riscattate
- Feedback visivo e animazioni

##### `components/ui/README.md`
Documentazione specifica dei componenti UI.

---

### `contexts/` - Context API (State Management)

Gestione dello stato globale dell'applicazione tramite React Context API.

#### `contexts/AuthContext.tsx`
Context per la gestione dell'autenticazione che fornisce:
- Stato utente e chef separati
- Funzioni login/logout per utenti normali e chef
- Registrazione nuovi utenti
- Aggiornamento dati profilo
- Persistenza sessioni con AsyncStorage
- Callback per reset ruota e logout

#### `contexts/OrderContext.tsx`
Context per la gestione degli ordini che gestisce:
- Carrello corrente (ordini in attesa)
- Storico ordini completati
- Offerte riscattate
- Timestamp ultimo utilizzo ruota (per cooldown)
- Funzioni per aggiungere/rimuovere/modificare ordini
- Conferma ordine (per utenti loggati e ospiti)
- Persistenza dati per utente con AsyncStorage
- Ordini globali per il chef

---

### `data/` - Dati e Contenuti

Contiene i file JSON e i dati statici dell'applicazione.

#### `data/pizzas.json`
File JSON con il catalogo completo delle pizze contenente:
- 18 pizze diverse con dettagli completi
- Informazioni per ogni pizza: ID, nome, prezzo, descrizione, immagine
- Ingredienti, descrizione completa, categoria (rosse/bianche/speciali)
- Valori nutrizionali (calorie, carboidrati, proteine, grassi)

#### `data/offers.tsx`
File TypeScript che contiene tutte le offerte della ruota organizzate per:
- **Kids (5-12 anni)**: Offerte per bambini
- **Teens (13-25 anni)**: Offerte per studenti
- **Adults (26-50 anni)**: Offerte per professionisti
- **Seniors (50+)**: Offerte per senior
- **Family**: Offerte famiglia
- **Gourmet**: Offerte gourmet per appassionati
Ogni categoria ha 4 offerte specifiche con sconti e descrizioni.

---

### `hooks/` - Custom Hooks

Hooks personalizzati React per funzionalità riutilizzabili.

#### `hooks/use-color-scheme.ts`
Hook per rilevare il tema preferito dall'utente (light/dark mode).

#### `hooks/use-color-scheme.web.ts`
Implementazione web-specific del hook use-color-scheme.

#### `hooks/use-pizza-modal.tsx`
Hook per gestire i modal personalizzati dell'app, fornendo funzioni per mostrare/nascondere modal.

#### `hooks/use-theme-color.ts`
Hook per ottenere i colori del tema corrente in base allo schema selezionato.

#### `hooks/use-transition-animations.tsx`
Hook complesso per gestire animazioni di transizione tra schermate, incluso:
- Animazioni per card delle pizze
- Animazioni per raccomandazioni chef
- Animazioni per pulsanti carrello
- Animazioni per categorie
- Animazioni di background

#### `hooks/use-wheel-cooldown.tsx`
Hook per gestire il cooldown della ruota della fortuna, calcolando il tempo rimanente prima di poter rigirare.

---

### `constants/` - Costanti e Configurazioni

Contiene le costanti e le configurazioni dell'applicazione.

#### `constants/colors.ts`
File con la palette colori completa della pizzeria:
- Colori principali (primary, secondary, accent)
- Colori di stato (success, warning, error, info)
- Colori speciali (urgent, highlight)
- Scala di grigi
- Colori specifici pizza (crust, sauce, cheese, basil, pepperoni)
- Gradienti predefiniti
- Ombre per elevazione

#### `constants/theme.ts`
Configurazione completa del tema light/dark mode con:
- Colori testi, sfondi, icone
- Colori tab bar
- Colori personalizzati per la pizzeria
- Font supportati per iOS, Android e Web

---

### `assets/` - Risorse Statiche

Contiene tutte le risorse statiche dell'applicazione.

#### `assets/images/`
Directory con tutte le immagini dell'app:
- `icon.png` - Icona principale dell'app
- `logo.png` - Logo dell'applicazione
- `Mascotte.png` - Immagine della mascotte
- `MascotteLogo.png` - Logo con mascotte
- `ruota.png` - Immagine della ruota della fortuna
- `favicon.png` - Favicon per web
- `android-icon-background.png` - Sfondo icona Android
- `android-icon-foreground.png` - Primo piano icona Android
- `android-icon-monochrome.png` - Versione monocromatica icona Android

---

### `types/` - Definizioni TypeScript

Contiene le definizioni di tipo TypeScript personalizzate.

#### `types/images.d.ts`
Dichiarazioni TypeScript per i moduli di immagini, permettendo l'import di file PNG, JPG, JPEG, WEBP.

---

### `config/` - Configurazioni

Directory per file di configurazione aggiuntivi (attualmente vuota).

---

### `scripts/` - Script Utility

Contiene script Node.js per automatizzare operazioni.

#### `scripts/reset-project.js`
Script per resettare il progetto a uno stato iniziale, spostando file esistenti in `app-example` e creando una nuova struttura base.

---

## 📄 Dettagli dei File Principali

### File di Configurazione Root

#### `package.json`
File di configurazione npm che definisce:
- Nome progetto: "navigation"
- Script: start, android, ios, lint, reset-project
- Dipendenze principali:
  - React Native 0.81.5 e React 19.1.0
  - Expo SDK 54.0.21
  - Expo Router 6.0.14 (file-based routing)
  - React Navigation per navigazione
  - AsyncStorage per persistenza dati
  - Reanimated per animazioni avanzate
  - Haptics per feedback tattile
  - Camera, Image Picker per funzionalità native

#### `app.json`
Configurazione Expo che definisce:
- Nome e slug dell'app
- Icone e splash screen
- Permessi (fotocamera, localizzazione)
- Supporto tablet iOS
- Configurazioni Android (adaptive icon, edge-to-edge)
- Plugin Expo utilizzati

#### `tsconfig.json`
Configurazione TypeScript che imposta:
- Path alias (@/* per import relativi)
- JSX React
- Module resolution Bundler
- Type checking per React e React Native

#### `babel.config.js`
Configurazione Babel che include:
- Preset Expo
- Module resolver per path alias (@)
- Plugin Reanimated per animazioni

#### `eslint.config.js`
Configurazione ESLint per linting del codice con regole Expo.

#### `expo-env.d.ts`
File TypeScript di riferimento per tipi Expo (non modificabile).

---

## 🔧 Tecnologie Utilizzate

### Framework e Librerie Core
- **React Native 0.81.5**: Framework per sviluppo app mobile
- **React 19.1.0**: Libreria UI
- **Expo SDK 54.0.21**: Piattaforma per sviluppo React Native
- **Expo Router 6.0.14**: Routing file-based per navigazione

### Navigazione
- **React Navigation**: Libreria di navigazione
- **@react-navigation/bottom-tabs**: Tab bar navigation
- **React Native Gesture Handler**: Gesture e swipe

### Stato e Persistenza
- **React Context API**: State management globale
- **AsyncStorage**: Persistenza dati locali

### Animazioni e UI
- **React Native Reanimated**: Animazioni performanti
- **Expo Haptics**: Feedback tattile
- **React Native SVG**: Grafica vettoriale

### Funzionalità Native
- **Expo Camera**: Accesso fotocamera
- **Expo Image Picker**: Selezione immagini
- **Expo Clipboard**: Accesso agli appunti

### Styling e Theme
- Sistema di temi light/dark personalizzato
- StyleSheet di React Native per styling
- Palette colori personalizzata per pizzeria

---

## 🎯 Funzionalità Principali

### Per gli Utenti
1. **Menu Interattivo**: Navigazione per categorie, aggiunta diretta al carrello
2. **Dettagli Pizza**: Personalizzazione completa con aggiunte e note
3. **Ruota della Fortuna**: Vincita offerte esclusive con meccanica di gioco
4. **Carrello Avanzato**: Gestione quantità, swipe per eliminare, note speciali
5. **Profilo Utente**: Dati personali editabili, foto profilo, storico ordini
6. **Autenticazione**: Login/registrazione con validazione form

### Per i Chef
1. **Gestione Ordini**: Visualizzazione e gestione di tutti gli ordini
2. **Stati Ordine**: Gestione stati (pending, completed)
3. **Autenticazione Separata**: Sistema di login dedicato per chef

### Caratteristiche Tecniche
- **Persistenza Multi-Utente**: Dati salvati per utente con chiavi univoche
- **Cooldown Ruota**: Sistema anti-abuso per la ruota della fortuna
- **Animazioni Fluide**: Transizioni e animazioni native performance
- **Theme Support**: Light e dark mode completi
- **Cross-Platform**: Funziona su iOS, Android e Web

---

## 📝 Note di Sviluppo

### Struttura Routing
L'app utilizza Expo Router con routing basato su file:
- File `_layout.tsx` definiscono layout nested
- File `(tabs)` e `(modals)` sono route groups
- File `.tsx` normali sono schermate accessibili

### Gestione Stato
Lo stato globale è gestito tramite Context API con due context principali:
- `AuthContext`: Autenticazione e profilo
- `OrderContext`: Carrello e ordini

### Persistenza Dati
I dati vengono salvati in AsyncStorage con chiavi per utente:
- `orders_{userId}`: Carrello corrente
- `ordersHistory_{userId}`: Storico ordini
- `redeemedOffers_{userId}`: Offerte riscattate
- `lastWheelSpin_{userId}`: Timestamp ultimo spin
- `globalOrders`: Ordini globali per chef

### Credenziali Test
- **Chef**: email: `chef@gmail.com`, password: `chef`
- **Utenti**: Qualsiasi email/password valide (sistema mock)

---

## 🚀 Avvio del Progetto

```bash
# Installa dipendenze
npm install

# Avvia in modalità sviluppo
npm start

# Avvia su Android
npm run android

# Avvia su iOS
npm run ios
```

---

## 📚 Risorse Aggiuntive

- [Documentazione Expo](https://docs.expo.dev/)
- [Documentazione Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentazione React Navigation](https://reactnavigation.org/)
- [Documentazione React Native](https://reactnative.dev/)

---

**Ultimo aggiornamento**: Documentazione completa del progetto App Pizzeria.
