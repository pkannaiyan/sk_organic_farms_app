# 🌿 SK Organic Farms - React Native App

A mobile shopping app for SK Organic Farms built with React Native and integrated with Shopify Storefront API.

## 📱 Features

- ✅ Browse products by categories
- ✅ Product search functionality
- ✅ Product details with variants
- ✅ Shopping cart management
- ✅ Secure checkout with Razorpay
- ✅ User authentication
- ✅ Order history
- ✅ Push notifications (Firebase)

## 🛠️ Tech Stack

- **React Native** 0.73.1
- **TypeScript**
- **Shopify Storefront API** (GraphQL)
- **Zustand** (State Management)
- **React Navigation** 6
- **Razorpay** (Payments)
- **Firebase** (Push Notifications)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 18
- npm or yarn
- Android Studio (for Android development)
- JDK 17
- React Native CLI

## 🚀 Getting Started

### Step 1: Clone and Install Dependencies

```bash
cd sk_organic_farms_app
npm install
```

### Step 2: Configure Shopify API

Edit `src/config/shopify.ts` and add your credentials:

```typescript
export const SHOPIFY_CONFIG = {
  STORE_DOMAIN: 'sk-nursery.myshopify.com',
  STOREFRONT_ACCESS_TOKEN: 'YOUR_TOKEN_HERE', // Get from Shopify Admin
  API_VERSION: '2024-01',
};
```

#### How to get Storefront Access Token:

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps" → "Create an app"
3. Name it "SK Organic Farms Mobile App"
4. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_customer_tags`
5. Install the app and copy the Storefront API access token

### Step 3: Configure Razorpay

Edit `src/config/shopify.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  KEY_ID: 'YOUR_RAZORPAY_KEY_ID',
  // Never put KEY_SECRET in client code!
};
```

#### How to get Razorpay credentials:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate new keys (use Test keys for development)

### Step 4: Android Setup

```bash
# Navigate to android folder
cd android

# Clean build
./gradlew clean

# Go back to root
cd ..
```

### Step 5: Run the App

```bash
# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android
```

## 📁 Project Structure

```
sk_organic_farms_app/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ProductCard.tsx
│   ├── config/              # App configuration
│   │   └── shopify.ts
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── ProductListScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── AccountScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── CollectionScreen.tsx
│   ├── services/            # API services
│   │   └── shopifyApi.ts
│   └── store/               # State management
│       └── useStore.ts
├── App.tsx                  # Main app component
├── index.js                 # Entry point
├── package.json
└── README.md
```

## 🔧 Configuration Files

### babel.config.js

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

### metro.config.js

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## 📦 Building for Production

### Generate Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Generate Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## 🔐 Signing the App

1. Generate a keystore:
```bash
keytool -genkey -v -keystore sk-organic-farms.keystore -alias sk-organic-farms -keyalg RSA -keysize 2048 -validity 10000
```

2. Place the keystore in `android/app/`

3. Edit `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=sk-organic-farms.keystore
MYAPP_UPLOAD_KEY_ALIAS=sk-organic-farms
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

4. Edit `android/app/build.gradle` to use signing config

## 📱 Publishing to Play Store

1. Create a Google Play Developer account ($25 one-time)
2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app
4. Upload your AAB file
5. Fill in store listing details
6. Submit for review

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

### Clear node modules
```bash
rm -rf node_modules
npm install
```

## 📞 Support

- **Store**: sk-nursery.myshopify.com
- **Email**: skofarms@gmail.com
- **Phone**: 6380464748

## 📄 License

This project is proprietary software for SK Organic Farms.

---

Built with ❤️ for SK Organic Farms

