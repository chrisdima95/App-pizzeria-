# Componenti UI Personalizzati per la Pizzeria

Questa cartella contiene componenti UI personalizzati progettati specificamente per l'app della pizzeria, utilizzando una palette di colori calda e appetitosa.

## Componenti Disponibili

### PizzaButton
Bottone personalizzato con varianti e dimensioni predefinite.

```tsx
import { PizzaButton } from '@/components/ui';

<PizzaButton
  title="Aggiungi al carrello"
  onPress={() => {}}
  variant="primary"
  size="medium"
/>
```

**Props:**
- `title`: string - Testo del bottone
- `onPress`: () => void - Funzione chiamata al press
- `variant`: 'primary' | 'secondary' | 'accent' | 'outline' - Stile del bottone
- `size`: 'small' | 'medium' | 'large' - Dimensione del bottone
- `disabled`: boolean - Se il bottone è disabilitato

### PizzaCard
Card personalizzata con ombre e bordi arrotondati.

```tsx
import { PizzaCard } from '@/components/ui';

<PizzaCard variant="elevated" padding="medium">
  <Text>Contenuto della card</Text>
</PizzaCard>
```

**Props:**
- `children`: React.ReactNode - Contenuto della card
- `variant`: 'default' | 'elevated' | 'outlined' - Stile della card
- `padding`: 'small' | 'medium' | 'large' - Spaziatura interna

### PizzaBadge
Badge per mostrare stati o etichette.

```tsx
import { PizzaBadge } from '@/components/ui';

<PizzaBadge
  text="In preparazione"
  variant="warning"
  size="medium"
/>
```

**Props:**
- `text`: string - Testo del badge
- `variant`: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' - Colore del badge
- `size`: 'small' | 'medium' | 'large' - Dimensione del badge

### PizzaTitle
Titolo personalizzato con livelli e colori predefiniti.

```tsx
import { PizzaTitle } from '@/components/ui';

<PizzaTitle level={1} color="primary">
  Menu Pizze
</PizzaTitle>
```

**Props:**
- `children`: React.ReactNode - Contenuto del titolo
- `level`: 1 | 2 | 3 | 4 | 5 | 6 - Livello del titolo (h1-h6)
- `color`: 'primary' | 'secondary' | 'accent' | 'dark' | 'muted' - Colore del titolo

### PizzaPrice
Componente per mostrare i prezzi in modo consistente.

```tsx
import { PizzaPrice } from '@/components/ui';

<PizzaPrice
  amount={12.50}
  currency="€"
  size="large"
/>
```

**Props:**
- `amount`: number | string - Importo da mostrare
- `currency`: string - Simbolo della valuta (default: '€')
- `size`: 'small' | 'medium' | 'large' - Dimensione del prezzo
- `showCurrency`: boolean - Se mostrare il simbolo della valuta

### PizzaDivider
Separatore personalizzato per dividere le sezioni.

```tsx
import { PizzaDivider } from '@/components/ui';

<PizzaDivider
  color="primary"
  thickness="medium"
  margin="large"
/>
```

**Props:**
- `color`: 'light' | 'medium' | 'dark' | 'primary' | 'secondary' - Colore del separatore
- `thickness`: 'thin' | 'medium' | 'thick' - Spessore del separatore
- `orientation`: 'horizontal' | 'vertical' - Orientamento del separatore
- `margin`: 'small' | 'medium' | 'large' - Margine del separatore

### PizzaLoading
Componente di caricamento con animazione personalizzata.

```tsx
import { PizzaLoading } from '@/components/ui';

<PizzaLoading
  size="medium"
  color="primary"
  text="Caricamento..."
/>
```

**Props:**
- `size`: 'small' | 'medium' | 'large' - Dimensione del loading
- `color`: 'primary' | 'secondary' | 'accent' - Colore del loading
- `text`: string - Testo da mostrare sotto il loading

## Palette Colori

I componenti utilizzano la palette di colori definita in `@/constants/colors`:

- **Primary**: #703537 (Marrone scuro per bottoni e elementi principali)
- **Secondary**: #38A169 (Verde basilico standardizzato)
- **Accent**: #F6AD55 (Arancione caldo)
- **Success**: #22C55E (Verde brillante per successi - distintivo dal secondary)
- **Warning**: #F6AD55 (Arancione per avvisi)
- **Error**: #DC2626 (Rosso acceso per errori - distintivo dal rosso pomodoro)
- **Urgent**: #E53E3E (Rosso pomodoro per elementi di urgenza)
- **Highlight**: #F6E05E (Giallo mozzarella per highlights)

## Utilizzo

Per utilizzare i componenti, importali dal file index:

```tsx
import { PizzaButton, PizzaCard, PizzaBadge } from '@/components/ui';
```

Oppure importali singolarmente:

```tsx
import { PizzaButton } from '@/components/ui/pizza-button';
```
