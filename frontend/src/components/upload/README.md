# FileUpload Component Architecture

## Struktura Komponentów

### 📁 Główne komponenty
- **`FileUpload.tsx`** - Główny komponent kontenerowy
- **`hooks/useFileUpload.ts`** - Custom hook z logiką upload

### 📁 Upload moduły (/upload)
- **`UploadHeader.tsx`** - Nagłówek z tytułem i opisem
- **`UploadArea.tsx`** - Drag & drop area z input file
- **`UploadButton.tsx`** - Przycisk upload z success state
- **`UploadForm.tsx`** - Kontener łączący wszystkie elementy upload
- **`LoadingOverlay.tsx`** - Overlay podczas loading
- **`index.ts`** - Export wszystkich upload komponentów

## Podział Odpowiedzialności

### 🎯 FileUpload (główny komponent)
- Routing między upload a visualization
- Przekazywanie danych między komponentami
- Layout wysokiego poziomu

### 🎯 useFileUpload (custom hook)
- **State management**: selectedFile, columns, loading, etc.
- **File operations**: handleFileChange, handleDrop, handleDrag
- **API calls**: handleUpload
- **Reset operations**: handleDeleteFile

### 🎯 UploadHeader
- Prezentacja tytułu i opisu
- Ikona FileText
- Styling nagłówka

### 🎯 UploadArea
- Drag & drop functionality
- File input
- Visual feedback (dragActive)
- File type restrictions

### 🎯 UploadButton
- Upload akcja
- Loading states
- Success animation
- Button styling

### 🎯 LoadingOverlay
- Processing indicator
- Blur background
- Centered loader

### 🎯 UploadForm
- Łączy wszystkie upload elementy
- Card container
- Layout komponentów upload

## Korzyści z Refaktoryzacji

### ✅ Lepsze zarządzanie kodem
- **Modularność**: Każdy komponent ma jedną odpowiedzialność
- **Reużywalność**: Komponenty można łatwo używać w innych miejscach
- **Testowanie**: Łatwiejsze unit testy dla każdego modułu

### ✅ Lepsze developer experience
- **Mniejsze pliki**: Łatwiej nawigować i zrozumieć kod
- **Clear separation**: Logika oddzielona od prezentacji
- **Type safety**: Wszystkie interfaces są jasno zdefiniowane

### ✅ Lepsze performance
- **Custom hook**: Optymalizacja re-renderów
- **Lazy loading**: Komponenty ładowane tylko gdy potrzebne
- **Memory management**: Lepsza kontrola lifecycle

### ✅ Lepsze maintenance
- **Single Responsibility**: Łatwiej znajdować i naprawiać bugi
- **Consistency**: Wszystkie upload komponenty mają spójny styling
- **Extensibility**: Łatwo dodawać nowe funkcje

## Przykład użycia

```tsx
import FileUpload from './components/FileUpload';

// Główny komponent automatycznie używa wszystkich modułów
const App = () => <FileUpload />;
```

## Struktura plików

```
components/
├── FileUpload.tsx              # Główny komponent
├── upload/
│   ├── index.ts               # Exports
│   ├── UploadHeader.tsx       # Nagłówek
│   ├── UploadArea.tsx         # Drag & drop
│   ├── UploadButton.tsx       # Przycisk upload
│   ├── UploadForm.tsx         # Kontener
│   └── LoadingOverlay.tsx     # Loading state
└── hooks/
    └── useFileUpload.ts       # Upload logika
```
