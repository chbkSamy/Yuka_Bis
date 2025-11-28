```markdown
# 🛒 Scanner Alimentaire - Installation Complète Étape par Étape

[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-brightgreen)](https://expo.dev)
[![React Native 0.81.5](https://img.shields.io/badge/RN-0.81.5-blue.svg)](https://reactnative.dev)

**Scanner de codes-barres alimentaires avec vérification régimes (Vegan, Halal, Casher)**

## 🚀 INSTALLATION COMPLÈTE (ZÉRO RECHERCHE)

### **ÉTAPE 1 : Prérequis (5 min)**

```
# 1. Vérifier Node.js 18+
node --version
# Doit afficher v18.x.x ou supérieur

# 2. Installer Expo CLI globalement
npm install -g @expo/cli@latest

# 3. Vérifier installation
npx expo --version
```

### **ÉTAPE 2 : Cloner & Installer (2 min)**

```
# 1. Cloner le projet
git clone https://github.com/VOTRE_USERNAME/scanner-alimentaire.git
cd scanner-alimentaire

# 2. Installer TOUTES les dépendances
npm install

# 3. Vérifier pas d'erreurs
npx expo doctor
```

### **ÉTAPE 3 : Premier Lancement (1 min)**

```
# 4. Lancer le projet
npx expo start

# 5. Scanner QR code avec Expo Go (iOS/Android)
# Télécharger Expo Go depuis App Store / Play Store
```

### **ÉTAPE 4 : Permissions (premier scan)**

```
📱 App → Scanner produit → Autoriser CAMÉRA
🌐 Internet → Autorisé par défaut
```

## ✅ TEST IMMÉDIAT (30 secondes)

```
1. Ouvrir Expo Go → Scanner QR code généré
2. Appuyer "Scanner"
3. Scanner NUTELLA (3017620422003)
4. Résultat : ❌ ILLICITE (lait, oeuf)
5. Scanner EAU (3178901000123)
6. Résultat : ✅ LICITE
```

## 🛠️ TOUTES LES COMMANDES UTILES

```
# 🔄 Redémarrer proprement
npx expo start --clear

# 📱 Android
npm run android

# 🍎 iOS (Mac uniquement)
npm run ios

# 🌐 Web
npm run web

# 🔍 Vérifier config
npx expo doctor

# 💅 Lint & format
npm run lint

# 🗑️ Reset base de données (dev)
npm run reset-project
```

## 📱 PROBLÈMES COURANTS & SOLUTIONS

| ❌ ERREUR | ✅ COMMANDE |
|-----------|-------------|
| Camera bloquée | `npx expo start --clear` |
| Metro bloqué | `npx expo start --clear` |
| SQLite erreur | `npm run reset-project` |
| "Product not found" | **NORMAL** - Base collaborative |
| Permissions refusées | Désinstaller/reinstaller Expo Go |

## 🚀 BUILD APK/APP STORE (Production)

```
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Se connecter Expo
eas login

# 3. Configurer build (1 seule fois)
eas build:configure

# 4. Générer APK + App Store
eas build --platform all
```

## 📊 CE QUI EST INSTALLÉ AUTOMATIQUEMENT

```
✅ expo-camera@17.0.9 → Scanner codes-barres
✅ expo-sqlite@16.0.9 → Base locale produits
✅ expo-router@6.0.13 → Navigation file-based
✅ New Architecture → Performances x2
✅ TypeScript → Code typé
✅ Reanimated v4 → Animations fluides
```

## 🔌 APIs (ZÉRO CONFIG)

| API | URL | Statut |
|-----|-----|--------|
| Open Food Facts | `https://world.openfoodfacts.org/api/v2/product/{barcode}.json` | ✅ Gratuit 100req/s |
| SQLite Local | Cache + historique | ✅ Illimité |

## 📁 ARBORESCENCE PROJET

```
📁 app/                 ← Pages (Scanner, Détails)
📁 components/          ← UI (ThemedText, IconSymbol)
📁 database/            ← queries/products.ts
📁 utils/               ← diet.ts (logique régimes)
📁 assets/images/       ← Icones + splash
📄 app.json             ← Config Expo
```

## 🎯 FONCTIONNALITÉS

```
✅ Scanner EAN-13/8, UPC-A
✅ Vérif Vegan/Vegetarian/Halal/Kosher
✅ Nutri-Score coloré
✅ Ingrédients highlightés (rouge)
✅ Historique SQLite offline
✅ Permissions françaises
```

