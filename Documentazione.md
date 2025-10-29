# 🍕 App Pizzeria - Documentazione Completa della Struttura del Progetto

Documentazione dettagliata e completa di tutte le cartelle, file e configurazioni del progetto App Pizzeria.

---

## 📋 Indice

1. [Panoramica del Progetto](#panoramica-del-progetto)
2. [Struttura Completa delle Directory](#struttura-completa-delle-directory)
3. [Dettagli di Tutte le Cartelle](#dettagli-di-tutte-le-cartelle)
4. [Dettagli di Tutti i File](#dettagli-di-tutti-i-file)
5. [File di Configurazione](#file-di-configurazione)
6. [Tecnologie e Dipendenze](#tecnologie-e-dipendenze)
7. [Sistema di Routing](#sistema-di-routing)
8. [Gestione dello Stato](#gestione-dello-stato)
9. [Struttura Dati e Persistenza](#struttura-dati-e-persistenza)

---

## 📖 Panoramica del Progetto

**App Pizzeria** è un'applicazione mobile cross-platform sviluppata con **React Native** ed **Expo Router**, progettata per gestire ordini di pizze con funzionalità avanzate:

- Menu completo con categorie di pizze (Rosse, Bianche, Speciali)
- Sistema di autenticazione per clienti e chef
- Carrello e checkout avanzato
- Ruota della fortuna per offerte esclusive
- Gestione ordini e profilo utente
- Interfaccia moderna con supporto dark/light mode
- Animazioni fluide e feedback tattile

**Versione**: 1.0.0  
**Nome Progetto**: Navigation (interno)  
**Framework**: React Native 0.81.5 + Expo SDK 54.0.21

---

## 📁 Struttura Completa delle Directory

```
App-pizzeria-/
│
├── 📂 app/                          # Directory principale routing (Expo Router)
│   ├── 📄 _layout.tsx               # Layout root dell'applicazione
│   ├── 📄 index.tsx                 # Schermata benvenuto/splash
│   ├── 📄 login.tsx                 # Autenticazione utenti
│   ├── 📄 checkout.tsx              # Carrello e checkout
│   ├── 📄 pizza-details.tsx         # Dettagli pizza
│   ├── 📄 ordini.tsx                # Storico ordini utente
│   ├── 📄 chef-orders.tsx           # Gestione ordini chef
│   │
│   ├── 📂 (tabs)/                   # Route group per tab navigator
│       ├── 📄 _layout.tsx           # Layout tab navigator
│       ├── 📄 index.tsx             # Tab: Menu principale
│       ├── 📄 offerte.tsx           # Tab: Ruota offerte
│       ├── 📄 profilo.tsx           # Tab: Profilo utente
│       └── 📄 chef.tsx              # Tab: Login chef
│   
│
├── 📂 components/                   # Componenti React riutilizzabili
│   ├── 📄 ChefRecommendation.tsx    # Componente raccomandazione chef
│   ├── 📄 haptic-tab.tsx            # Wrapper tab con feedback haptic
│   ├── 📄 TabHeader.tsx             # Header personalizzato per tab
│   ├── 📄 themed-text.tsx           # Testo tematico (light/dark)
│   ├── 📄 themed-view.tsx           # View tematico (light/dark)
│   │
│   └── 📂 ui/                       # Componenti UI personalizzati
│       ├── 📄 index.ts               # Export centralizzato
│       ├── 📄 collapsible.tsx       # Componente espandibile
│       ├── 📄 cooldown-modal.tsx    # Modal cooldown ruota
│       ├── 📄 icon-symbol.tsx       # Icona simbolo generica
│       ├── 📄 icon-symbol.ios.tsx   # Icona simbolo iOS (SF Symbols)
│       ├── 📄 mascotte-icon.tsx     # Icona mascotte
│       ├── (rimosso) offer-carousel.tsx    # Carosello offerte (sostituito dalla ruota)
│       ├── 📄 pizza-badge.tsx       # Badge personalizzato
│       ├── 📄 pizza-button.tsx      # Pulsante tematico
│       ├── 📄 pizza-card.tsx        # Card pizza
│       ├── 📄 pizza-divider.tsx     # Divisore visivo
│       ├── 📄 pizza-loading.tsx     # Indicatore caricamento
│       ├── 📄 pizza-modal.tsx       # Modal personalizzato
│       ├── 📄 pizza-price.tsx       # Formattazione prezzi
│       ├── 📄 pizza-title.tsx       # Titolo tematico
│       ├── 📄 pizza-wheel.tsx       # Ruota della fortuna
│       └── 📄 README.md             # Documentazione componenti UI
│
├── 📂 contexts/                     # React Context API (State Management)
│   ├── 📄 AuthContext.tsx           # Context autenticazione
│   └── 📄 OrderContext.tsx          # Context ordini e carrello
│
├── 📂 hooks/                        # Custom React Hooks
│   ├── 📄 use-color-scheme.ts       # Hook tema light/dark
│   ├── 📄 use-color-scheme.web.ts  # Implementazione web tema
│   ├── 📄 use-pizza-modal.tsx       # Hook gestione modal
│   ├── 📄 use-theme-color.ts        # Hook colori tema
│   ├── 📄 use-transition-animations.tsx  # Hook animazioni transizione
│   └── 📄 use-wheel-cooldown.tsx    # Hook cooldown ruota
│
├── 📂 constants/                    # Costanti e configurazioni
│   ├── 📄 colors.ts                 # Palette colori completa
│   └── 📄 theme.ts                  # Configurazione tema light/dark
│
├── 📂 data/                         # Dati statici e contenuti
│   ├── 📄 pizzas.json               # Catalogo pizze (18 pizze)
│   └── 📄 offers.tsx                # Definizione offerte ruota
│
├── 📂 assets/                       # Risorse statiche
│   └── 📂 images/                   # Immagini dell'app
│       ├── 📄 icon.png              # Icona principale
│       ├── 📄 logo.png              # Logo applicazione
│       ├── 📄 Mascotte.png          # Immagine mascotte
│       ├── 📄 MascotteLogo.png      # Logo con mascotte
│       ├── 📄 ruota.png             # Immagine ruota fortuna
│       ├── 📄 favicon.png           # Favicon web
│       ├── 📄 android-icon-background.png   # Sfondo icona Android
│       ├── 📄 android-icon-foreground.png   # Primo piano icona Android
│       └── 📄 android-icon-monochrome.png   # Icona monocromatica Android
│
├── 📂 types/                        # Definizioni TypeScript
│   └── 📄 images.d.ts               # Dichiarazioni moduli immagini
│
├── 📂 .vscode/                      # Configurazione Visual Studio Code
│   ├── 📄 settings.json             # Impostazioni editor
│   └── 📄 extensions.json           # Estensioni consigliate
│
├── 📂 .git/                         # Repository Git (metadati)
│
├── 📄 package.json                  # Configurazione npm e dipendenze
├── 📄 package-lock.json             # Lock file dipendenze
├── 📄 app.json                      # Configurazione Expo
├── 📄 tsconfig.json                 # Configurazione TypeScript
├── 📄 babel.config.js               # Configurazione Babel
├── 📄 eslint.config.js              # Configurazione ESLint
├── 📄 .gitignore                    # File ignorati da Git
└── 📄 README.md                     # Documentazione esistente
```

---

## 📂 Dettagli di Tutte le Cartelle

### 📁 `app/` - Directory Principale Routing

Directory principale dell'applicazione che utilizza **Expo Router** con routing basato su file. Ogni file `.tsx` rappresenta una schermata navigabile.

**Caratteristiche**:
- Routing basato su file (file-based routing)
- Supporto per route groups: `(tabs)`, `(modals)`
- Layout nested tramite `_layout.tsx`
- Navigazione automatica basata sulla struttura file

#### File Principali:

**`_layout.tsx`**
- Layout root dell'applicazione
- Configurazione provider globali (AuthProvider, OrderProvider) che rendono disponibili dei dati a tutti gli altri componenti che si trovano al loro interno
- Setup tema light/dark mode
- Configurazione Stack navigator (struttura a plia delle schermate)
- Gestione animazioni e transizioni

**`index.tsx`**
- Schermata di benvenuto/splash
- Logo applicazione con mascotte
- Caricamento iniziale (2 secondi)
- Redirect automatico alle tab dopo caricamento

**`login.tsx`**
- Autenticazione utenti normali
- Login (email, password)
- Registrazione (nome, cognome, email, password)
- Validazione form con messaggi errore
- Gestione sessioni separate utente/chef
- Redirect automatico se già autenticati

**`checkout.tsx`**
- Schermata carrello e checkout
- Lista articoli con quantità e prezzo
- Controlli quantità/rimozione
- Swipe to delete articoli
- Riepilogo totale ordine
- Conferma ordine (utenti loggati e ospiti)
- Svuotamento carrello

**`pizza-details.tsx`**
- Dettagli completi pizza
- Immagine e descrizione
- Selezione quantità (1-10)
- Personalizzazioni (mozzarella extra, doppio pomodoro, senza glutine, ecc.)
- Note speciali ordine
- Calcolo prezzo totale con personalizzazioni
- Aggiunta al carrello con animazioni

**`ordini.tsx`**
- Storico ordini utente
- Lista ordini confermati
- Dettagli ogni ordine (pizze, quantità, prezzi)
- Totale per ordine
- Accesso riservato utenti autenticati

**`chef-orders.tsx`**
- Gestione ordini per chef
- Visualizzazione tutti gli ordini (da tutti gli utenti)
- Gestione stati ordine (pending, completed)
- Filtri per stato
- Aggiornamento stati in tempo reale

#### 📁 `app/(tabs)/` - Tab Navigator

Route group per navigazione a tab. Le tab sono visibili in fondo allo schermo.

**`_layout.tsx`**
- Configurazione tab navigator
- 4 tab principali: Menu, Offerte, Profilo, Chef
- Icone personalizzate per tab
- Animazioni haptic feedback
- Gestione colori tema light/dark

**`index.tsx`** - Tab Menu
- Header con mascotte
- Barra filtri categorie (Rosse, Bianche, Speciali)
- Card consigliata chef (random ad ogni avvio)
- Lista pizze filtrate per categoria
- Controlli quantità da lista
- Pulsante carrello flottante con badge

**`offerte.tsx`** - Tab Offerte
- Ruota della fortuna interattiva
- Spin per vincere offerte casuali
- Cooldown tra giri (anti-abuso)
- Gestione offerte riscattate
- Requisito autenticazione per riscattare

**`profilo.tsx`** - Tab Profilo
- Avatar personalizzabile (foto profilo)
- Dati personali editabili
- Gestione foto (camera/galleria)
- Link ai propri ordini
- Pulsante logout
- Gestione utenti ospiti

**`chef.tsx`** - Tab Chef
- Login chef dedicato
- Credenziali test (chef@gmail.com / chef)
- Redirect automatico se già autenticato
- Controllo sessioni separate


---

### 📁 `components/` - Componenti Riutilizzabili

Contiene tutti i componenti React riutilizzabili dell'applicazione.

**`ChefRecommendation.tsx`**
- Pizza consigliata dallo chef
- Utilizzato nella schermata menu principale
- Randomizzazione ad ogni avvio

**`haptic-tab.tsx`**
- Wrapper per tab button
- Feedback haptic (vibrazioni) al touch
- Migliora UX con feedback tattile

**`TabHeader.tsx`**
- Header personalizzato per schermate tab
- Titolo schermata
- Opzione show/hide mascotte
- Stile consistente app

**`themed-text.tsx`**
- Componente testo tematico
- Adattamento automatico light/dark mode
- Colori tema appropriati

**`themed-view.tsx`**
- Componente view tematico
- Adattamento automatico light/dark mode
- Sfondo appropriato per tema

#### 📁 `components/ui/` - Componenti UI Personalizzati

Componenti UI specifici per l'app pizzeria con stile tematico.

**`index.ts`**
- Export centralizzato componenti UI
- Facilita import in altri file
- Barrel export pattern

**`collapsible.tsx`**
- Componente espandibile/contraibile
- Mostra/nasconde contenuti
- Animazioni fluide

**`cooldown-modal.tsx`**
- Modal countdown ruota fortuna
- Mostra tempo rimanente cooldown
- Prevenzione abusi

**`icon-symbol.tsx`** e **`icon-symbol.ios.tsx`**
- Componenti icone simboliche
- Versione generica tutte piattaforme
- Versione iOS con SF Symbols nativi

**`mascotte-icon.tsx`**
- Icona personalizzata mascotte
- Utilizzata in header e navigazione

**`offer-carousel.tsx`**
- Rimosso. In precedenza mostrava un carosello offerte; ora le offerte sono gestite esclusivamente dalla ruota (`components/ui/pizza-wheel.tsx`).

**`pizza-badge.tsx`**
- Badge personalizzato
- Contrassegno elementi ("Nuovo", "In Offerta")
- Stile tematico

**`pizza-button.tsx`**
- Pulsante personalizzato
- Stile tematico pizzeria
- Varianti e stati

**`pizza-card.tsx`**
- Card personalizzata per pizze
- Mostra immagine, nome, prezzo
- Utilizzata in menu principale

**`pizza-divider.tsx`**
- Divisore visivo tematico
- Separazione sezioni

**`pizza-loading.tsx`**
- Indicatore caricamento personalizzato
- Stile tematico pizzeria
- Animazioni

**`pizza-modal.tsx`**
- Modal personalizzato
- Supporto titolo, messaggio
- Pulsanti personalizzabili
- Stile tematico

**`pizza-price.tsx`**
- Formattazione prezzi
- Mostra prezzi modo consistente
- Supporto valute

**`pizza-title.tsx`**
- Titolo personalizzato
- Stile tematico
- Tipografia consistente

**`pizza-wheel.tsx`**
- Componente principale ruota fortuna
- Animazione rotazione (5 secondi)
- Selezione casuale offerta
- Gestione cooldown
- Validazione offerte già riscattate
- Feedback visivo e animazioni

**`README.md`**
- Documentazione specifica componenti UI
- Guida utilizzo componenti

---

### 📁 `contexts/` - State Management

Gestione stato globale applicazione tramite React Context API.

**`AuthContext.tsx`**
- Context autenticazione
- Stato utente e chef separati
- Funzioni login/logout (utenti normali e chef)
- Registrazione nuovi utenti
- Aggiornamento dati utente
- Persistenza sessioni con AsyncStorage
- Callback reset ruota e logout
- Gestione sessioni separate

**`OrderContext.tsx`**
- Context gestione ordini
- Carrello corrente (ordini in attesa)
- Storico ordini completati
- Offerte riscattate
- Timestamp ultimo utilizzo ruota (cooldown)
- Funzioni aggiungere/rimuovere/modificare ordini
- Conferma ordine (utenti loggati e ospiti)
- Persistenza dati per utente con AsyncStorage
- Ordini globali per chef
- Gestione multi-utente

---

### 📁 `hooks/` - Custom Hooks

Hooks personalizzati React per funzionalità riutilizzabili.

**`use-color-scheme.ts`**
- Rileva tema preferito utente
- Light/dark mode detection
- Hook per sistema operativo

**`use-color-scheme.web.ts`**
- Implementazione web-specific
- Adattamento browser/OS

**`use-pizza-modal.tsx`**
- Gestione modal personalizzati
- Funzioni show/hide modal
- Stato modal centralizzato

**`use-theme-color.ts`**
- Ottiene colori tema corrente
- Basato su schema selezionato
- Accesso palette colori

**`use-transition-animations.tsx`**
- Hook snellito per animazioni di transizione
- Espone `startAnimations()` per avviare animazioni globali
- Espone `backgroundAnimatedStyle` per animazione background
- Animazioni legacy per card/chef/cart/categorie rimosse (non più utilizzate)

**`use-wheel-cooldown.tsx`**
- Gestione cooldown ruota fortuna
- Calcola tempo rimanente prima rigiro
- Validazione cooldown attivo
- Persistenza timestamp

---

### 📁 `constants/` - Costanti e Configurazioni

Costanti e configurazioni applicazione.

**`colors.ts`**
- Palette colori completa pizzeria
- Colori principali (primary, secondary, accent)
- Colori stato (success, warning, error, info)
- Colori speciali (urgent, highlight)
- Scala grigi
- Colori specifici pizza (crust, sauce, cheese, basil, pepperoni)
- Gradienti predefiniti
- Ombre per elevazione

**`theme.ts`**
- Configurazione completa tema light/dark
- Colori testi, sfondi, icone
- Colori tab bar
- Colori personalizzati pizzeria
- Font supportati (iOS, Android, Web)
- Spacing e dimensioni

---

### 📁 `data/` - Dati e Contenuti

File JSON e dati statici applicazione.

**`pizzas.json`**
- Catalogo completo pizze
- 18 pizze diverse con dettagli completi
- Informazioni per pizza:
  - `id`: ID univoco (stringa)
  - `name`: Nome pizza
  - `price`: Prezzo (stringa, es. "8.50")
  - `description`: Descrizione breve
  - `image`: URL immagine
  - `ingredients`: Array di ingredienti (stringa[])
  - `fullDescription`: Descrizione completa
  - `category`: Categoria (rosse/bianche/speciali)
  - `nutrition`: Oggetto valori nutrizionali (calorie, carbs, protein, fat come stringhe, es. "250 kcal", "30g")

**`offers.tsx`**
- Definizione offerte ruota fortuna
- Array `wheelOffers` con 12 offerte di pizze
- Organizzate per categoria pizza:
  - **classic**: Pizze classiche (Margherita, Quattro Stagioni, Capricciosa, Prosciutto e Funghi)
  - **spicy**: Pizze piccanti (Diavola)
  - **vegan**: Pizze vegane (Marinara)
  - **premium**: Pizze premium (Bufala, Bresaola e Rucola)
  - **cheese**: Pizze ai formaggi (Quattro Formaggi)
  - **vegetarian**: Pizze vegetariane (Ortolana)
  - **seafood**: Pizze con pesce (Tonno e Cipolle)
  - **rustic**: Pizze rustiche (Patate e Salsiccia)
- Ogni offerta include: id, nome, prezzo scontato, prezzo originale, descrizione, emoji, sconto percentuale, categoria
- Funzione `getAllOffers()` per ottenere tutte le offerte disponibili

---

### 📁 `assets/` - Risorse Statiche

Risorse statiche applicazione (immagini, font, ecc.).

#### 📁 `assets/images/` - Immagini

**`icon.png`**
- Icona principale applicazione
- Utilizzata come icona app su dispositivi

**`logo.png`**
- Logo applicazione
- Utilizzato in splash screen e header

**`Mascotte.png`**
- Immagine mascotte
- Personaggio identificativo app

**`MascotteLogo.png`**
- Logo con mascotte integrata
- Versione combinata logo + mascotte

**`ruota.png`**
- Immagine ruota fortuna
- Utilizzata nella schermata offerte

**`favicon.png`**
- Favicon per versione web
- Icona browser

**`android-icon-background.png`**
- Sfondo icona Android (adaptive icon)
- Parte background icona adattiva

**`android-icon-foreground.png`**
- Primo piano icona Android (adaptive icon)
- Parte principale icona adattiva

**`android-icon-monochrome.png`**
- Versione monocromatica icona Android
- Per temi scuri Android

---

### 📁 `types/` - Definizioni TypeScript

Definizioni tipo TypeScript personalizzate.

**`images.d.ts`**
- Dichiarazioni moduli immagini
- Permette import file PNG, JPG, JPEG, WEBP
- Estensione sistema tipo TypeScript
- Supporto import immagini type-safe

---

---

### 📁 `.vscode/` - Configurazione Visual Studio Code

Configurazione editor Visual Studio Code.

**`settings.json`**
- Impostazioni editor
- Code actions on save:
  - Fix all automatico
  - Organize imports
  - Sort members
- Ottimizzazione workflow sviluppo

**`extensions.json`**
- Estensioni consigliate VSCode
- `expo.vscode-expo-tools`: Estensione Expo
- Migliora sviluppo app Expo

---

## 📄 Dettagli di Tutti i File

### File di Configurazione Root

#### `package.json`

File configurazione npm che definisce:

**Metadati Progetto**:
- Nome: "navigation" (interno)
- Versione: 1.0.0
- Main entry: "expo-router/entry"
- Private: true

**Script Disponibili**:
- `npm start`: Avvia server sviluppo Expo
- `npm run android`: Avvia su Android
- `npm run ios`: Avvia su iOS
- `npm run lint`: Esegue linting codice

**Dipendenze Principali**:
- React Native 0.81.5
- React 19.1.0
- Expo SDK 54.0.21
- Expo Router 6.0.14 (file-based routing)
- React Navigation 7.x
- AsyncStorage 2.2.0
- React Native Reanimated 4.1.1
- Expo Haptics 15.0.7
- React Native Gesture Handler 2.28.0
- Expo Camera 17.0.8
- Expo Image Picker 17.0.8
- React Native SVG 15.12.1

**DevDependencies**:
- TypeScript 5.9.2
- ESLint 9.25.0
- ESLint Config Expo 10.0.0
- Babel Plugin Module Resolver 5.0.2

#### `package-lock.json`

Lock file dipendenze npm. Blocca versioni esatte dipendenze per installazioni riproducibili. Generato automaticamente da npm.

#### `app.json`

Configurazione Expo applicazione:

**Metadati Base**:
- Nome: "Navigation"
- Slug: "Navigation"
- Versione: 1.0.0
- Orientamento: portrait
- User Interface Style: automatic (light/dark)

**Icone e Asset**:
- Icon: "./assets/images/icon.png"
- Scheme: "navigation"
- Splash screen configurazione

**iOS Configuration**:
- Supports Tablet: true

**Android Configuration**:
- Adaptive Icon con background, foreground, monochrome
- Background Color: "#E6F4FE"
- Edge to Edge: enabled
- Predictive Back Gesture: disabled

**Plugin Expo**:
- expo-router: Routing file-based
- expo-splash-screen: Splash screen personalizzato
- expo-camera: Permessi fotocamera

**Experiments**:
- Typed Routes: true (typing route Expo Router)
- React Compiler: true

**SDK Version**: 54.0.0

#### `tsconfig.json`

Configurazione TypeScript:

**Compiler Options**:
- Base URL: "."
- Paths alias: "@/*" -> "./*"
- JSX: react-jsx
- Module: ESNext
- Module Resolution: Bundler
- ES Module Interop: true
- Allow Synthetic Default Imports: true
- Skip Lib Check: true

**Types**:
- react
- react-native

**Include**:
- Tutti file .ts e .tsx
- .expo/types/**/*.ts
- expo-env.d.ts
- types/**/*.d.ts

**Extends**: expo/tsconfig.base

#### `babel.config.js`

Configurazione Babel:

**Presets**:
- babel-preset-expo

**Plugins**:
- module-resolver:
  - Root: "./"
  - Alias: "@" -> "./"
- react-native-reanimated/plugin (deve essere ultimo)

**Cache**: Enabled

#### `eslint.config.js`

Configurazione ESLint:

- Utilizza config Expo flat
- Ignora: dist/*
- Estende regole Expo standard

#### `.gitignore`

File ignorati da Git:

**Dipendenze**:
- node_modules/

**Expo**:
- .expo/
- dist/
- web-build/
- expo-env.d.ts

**Native**:
- .kotlin/
- *.orig.*
- *.jks, *.p8, *.p12, *.key, *.mobileprovision

**Metro**:
- .metro-health-check*

**Debug**:
- npm-debug.*, yarn-debug.*, yarn-error.*

**macOS**:
- .DS_Store
- *.pem

**Locale**:
- .env*.local

**TypeScript**:
- *.tsbuildinfo

**Altri**:
- app-example/
- /ios, /android (generati)

---

## 🔧 Tecnologie e Dipendenze

### Framework e Librerie Core

- **React Native 0.81.5**: Framework sviluppo app mobile cross-platform
- **React 19.1.0**: Libreria UI dichiarativa
- **Expo SDK 54.0.21**: Piattaforma sviluppo React Native
- **Expo Router 6.0.14**: Routing file-based per navigazione

### Navigazione

- **React Navigation 7.1.8**: Libreria navigazione
- **@react-navigation/bottom-tabs 7.4.0**: Tab bar navigation
- **React Native Gesture Handler 2.28.0**: Gesture recognition e swipe

### Stato e Persistenza

- **React Context API**: State management globale (nativo React)
- **AsyncStorage 2.2.0**: Persistenza dati locali (chiave-valore)

### Animazioni e UI

- **React Native Reanimated 4.1.1**: Animazioni performanti native
- **Expo Haptics 15.0.7**: Feedback tattile (vibrazioni)
- **React Native SVG 15.12.1**: Grafica vettoriale
- **React Native Worklets 0.5.1**: Worklets per animazioni

### Funzionalità Native

- **Expo Camera 17.0.8**: Accesso fotocamera
- **Expo Image Picker 17.0.8**: Selezione immagini galleria
- **Expo Clipboard 8.0.7**: Accesso appunti sistema
- **Expo Constants 18.0.9**: Costanti dispositivo/app
- **Expo Linking 8.0.8**: Deep linking

### UI e Styling

- **Expo Image 3.0.10**: Componente immagine ottimizzato
- **Expo Linear Gradient 15.0.7**: Gradienti lineari
- **Expo Font 14.0.9**: Caricamento font personalizzati
- **Expo Status Bar 3.0.8**: Gestione status bar
- **React Native Safe Area Context 5.6.0**: Safe area insets
- **React Native Screens 4.16.0**: Screens native performance

### Icone e Simboli

- **@expo/vector-icons 15.0.2**: Libreria icone
- **Expo Symbols 1.0.7**: SF Symbols iOS

### Altri

- **Expo Splash Screen 31.0.10**: Splash screen
- **Expo System UI 6.0.8**: Sistema UI
- **Expo Web Browser 15.0.8**: Browser web
- **React Native Web 0.21.0**: Supporto web
- **React DOM 19.1.0**: DOM rendering per web

---

## 🗺️ Sistema di Routing

L'applicazione utilizza **Expo Router** con routing basato su file system.

### Principi Base

- **File = Route**: Ogni file `.tsx` in `app/` diventa route navigabile
- **Layout Nested**: File `_layout.tsx` definiscono layout per directory e sottodirectory
- **Route Groups**: Cartelle `(tabs)` e `(modals)` sono route groups (non influenzano URL)
- **Dynamic Routes**: Supporto route dinamiche (non utilizzate in questo progetto)

### Struttura Routing

```
app/
├── _layout.tsx           → Layout root (Stack Navigator)
├── index.tsx             → Route: / (splash)
├── login.tsx             → Route: /login
├── checkout.tsx          → Route: /checkout
├── pizza-details.tsx     → Route: /pizza-details
├── ordini.tsx            → Route: /ordini
├── chef-orders.tsx       → Route: /chef-orders
├── (tabs)/
│   ├── _layout.tsx       → Layout Tab Navigator
│   ├── index.tsx         → Route: /(tabs) o /
│   ├── offerte.tsx       → Route: /(tabs)/offerte
│   ├── profilo.tsx       → Route: /(tabs)/profilo
│   └── chef.tsx          → Route: /(tabs)/chef
└── (modals)/
    └── (nessuna route attiva)
```

### Navigazione

- **Stack Navigation**: Per schermate full-screen
- **Tab Navigation**: Per tab bar inferiore
- **Modal Presentation**: Per modals sopra altre schermate

---

## 🔄 Gestione dello Stato

Lo stato globale è gestito tramite **React Context API** con due context principali.

### AuthContext

**Stato Gestito**:
- `user`: Utente corrente (null se non autenticato)
- `chef`: Chef corrente (null se non autenticato)
- `isLoading`: Stato caricamento
- `isAuthenticated`: Boolean che indica se l'utente è autenticato
- `isChefAuthenticated`: Boolean che indica se il chef è autenticato

**Funzioni**:
- `login(email, password)`: Login utente normale
- `register(name, surname, email, password)`: Registrazione nuovo utente
- `chefLogin(email, password)`: Login chef
- `logout()`: Logout utente normale
- `chefLogout()`: Logout chef
- `updateUser(userData)`: Aggiornamento dati profilo
- `registerResetCallback(callback)`: Registra callback per reset cooldown ruota
- `registerLogoutCallback(callback)`: Registra callback per pulizia dati al logout

**Persistenza**:
- Sessioni salvate in AsyncStorage
- Chiavi: `user`, `authToken` (per utenti normali)
- Chiavi: `chef`, `chefToken` (per chef)
- Restore automatico all'avvio

### OrderContext

**Stato Gestito**:
- `orders`: Carrello corrente (array ordini)
- `completedOrders`: Storico ordini completati (array di array)
- `redeemedOffers`: Offerte già riscattate (array di ID)
- `lastWheelSpinTimestamp`: Timestamp ultimo spin ruota (null o number)
- `hasOfferInCart`: Boolean che indica se c'è un'offerta nel carrello

**Funzioni**:
- `addToOrder(item)`: Aggiunge al carrello (item senza campo status)
- `removeFromOrder(id)`: Rimuove dal carrello
- `updateQuantity(id, quantity)`: Aggiorna quantità item carrello
- `clearOrder()`: Svuota carrello
- `confirmOrder()`: Conferma ordine (per utenti autenticati)
- `confirmOrderAsGuest()`: Conferma ordine come ospite (non autenticato)
- `resetWheelCooldown()`: Resetta cooldown ruota
- `getAllOrders()`: Ottiene tutti gli ordini globali (per chef)
- `setOrders`: Setter diretto per gestione manuale ordini

**Persistenza**:
- Dati salvati per utente con chiavi univoche
- `orders_{userId}`: Carrello corrente
- `ordersHistory_{userId}`: Storico ordini completati
- `redeemedOffers_{userId}`: Offerte riscattate
- `lastWheelSpin_{userId}`: Timestamp ultimo spin ruota
- `globalOrders`: Ordini globali (chiave condivisa per tutti gli utenti/ospiti)

---

## 💾 Struttura Dati e Persistenza

### Struttura Dati Pizza

```typescript
interface Pizza {
  id: string;
  name: string;
  price: string; // Es. "8.50"
  description: string;
  image: string;
  ingredients: string[];
  fullDescription: string;
  category: 'rosse' | 'bianche' | 'speciali';
  nutrition: {
    calories: string; // Es. "250 kcal"
    carbs: string;    // Es. "30g"
    protein: string;  // Es. "12g"
    fat: string;      // Es. "8g"
  };
}
```

### Struttura Ordine (OrderItem)

```typescript
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "pending" | "completed";
  notes?: string;
  userEmail?: string; // Email utente che ha effettuato l'ordine
}
```

**Nota**: Gli ordini completati sono array di `OrderItem[]` (ogni elemento rappresenta uno "snapshot" completo del carrello al momento della conferma).

### Struttura Offerta

```typescript
interface Offer {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  emoji: string;
  discount?: number;
  category: string; // Es. "classic", "spicy", "vegan", "premium", "cheese", "vegetarian", "seafood", "rustic"
}
```

### Chiavi AsyncStorage

**Per Utente Autenticato**:
- `user`: Dati utente (JSON)
- `authToken`: Token autenticazione utente
- `orders_{userId}`: Carrello corrente
- `ordersHistory_{userId}`: Storico ordini completati
- `redeemedOffers_{userId}`: Offerte riscattate
- `lastWheelSpin_{userId}`: Timestamp ultimo spin ruota

**Per Chef**:
- `chef`: Dati chef (JSON)
- `chefToken`: Token autenticazione chef

**Globali**:
- `globalOrders`: Ordini globali per chef (tutti gli ordini di tutti gli utenti e ospiti)

### Note Implementazione

- **Multi-utente**: Dati isolati per utente tramite `userId` nelle chiavi
- **Ospiti**: Supporto ordini per utenti non autenticati (non persistiti)
- **Chef**: Accesso a ordini globali (tutti gli utenti)
- **Cooldown**: Timestamp salvato per prevenire abusi ruota

---

## 🎯 Funzionalità Principali

### Per Utenti

1. **Menu Interattivo**
   - Navigazione categorie (Rosse, Bianche, Speciali)
   - Filtri categoria
   - Aggiunta diretta carrello
   - Card raccomandazione chef

2. **Dettagli Pizza**
   - Visualizzazione completa
   - Personalizzazione (quantità, aggiunte, note)
   - Calcolo prezzo totale

3. **Ruota della Fortuna**
   - Vincita offerte esclusive
   - Meccanica gioco interattiva
   - Cooldown anti-abuso
   - Validazione offerte già riscattate

4. **Carrello Avanzato**
   - Gestione quantità
   - Swipe to delete
   - Note speciali
   - Riepilogo totale

5. **Profilo Utente**
   - Dati personali editabili
   - Foto profilo (camera/galleria)
   - Storico ordini

6. **Autenticazione**
   - Login/registrazione
   - Validazione form
   - Gestione sessioni

### Per Chef

1. **Gestione Ordini**
   - Visualizzazione tutti ordini
   - Gestione stati (pending/completed)
   - Filtri per stato

2. **Autenticazione Separata**
   - Login dedicato chef
   - Sessioni separate da utenti

### Caratteristiche Tecniche

- **Persistenza Multi-Utente**: Dati isolati per utente
- **Cooldown Ruota**: Sistema anti-abuso
- **Animazioni Fluide**: Transizioni native performance
- **Theme Support**: Light e dark mode completi
- **Cross-Platform**: iOS, Android, Web
- **Feedback Tattile**: Haptic feedback per migliorare UX

---

## 📝 Credenziali Test

Per testing applicazione:

**Chef**:
- Email: `chef@gmail.com`
- Password: `chef`

**Utenti**:
- Qualsiasi email/password valide (sistema mock)
- Formato email valido richiesto
- Password minimo 6 caratteri

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

# Esegui linting
npm run lint

```

---

## 📚 Risorse Aggiuntive

- [Documentazione Expo](https://docs.expo.dev/)
- [Documentazione Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentazione React Navigation](https://reactnavigation.org/)
- [Documentazione React Native](https://reactnative.dev/)
- [Documentazione React Context](https://react.dev/reference/react/useContext)

---

**Ultimo aggiornamento**: Documentazione completa e dettagliata della struttura del progetto App Pizzeria.

**Versione Documentazione**: 1.0.0  
**Data Creazione**: 2024

