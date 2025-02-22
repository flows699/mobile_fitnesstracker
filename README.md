# 💪 Iron Tracker

A modern workout tracking app built with React Native that helps you track your exercises, monitor progress, and achieve your fitness goals.

This project is for learning / practicing React Native, with the help of some AI.

## ✨ Features

- 📱 Track workouts and individual exercises
- 📊 Visual progress tracking with charts
- 💾 Local data persistence
- 🎨 Beautiful gradient UI
- 📈 Progress history and statistics
- ⚡ Quick exercise logging
- 🔄 Customizable workout routines

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation v6
- **Storage:** AsyncStorage
- **UI Components:**
  - Expo Linear Gradient
  - React Native Chart Kit
  - React Native SVG
  - React Native Gesture Handler
- **State Management:** React Context API

## 🚀 Installation

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/iron-tracker.git
cd iron-tracker
```

2. Install the project dependencies using npm:

```bash
npm install
```

3. Run the project:

```bash
npm run dev
```

### Run the app:

- 📱 Scan the QR code with Expo Go (Android)
- 📲 Scan the QR code with Camera app (iOS)
- 🤖 Press 'a' for Android emulator
- 🍎 Press 'i' for iOS simulator

## iOS Development

- macOS with Xcode installed
- iOS Simulator or physical iOS device
- Xcode Command Line Tools

## Android Development

- Android Studio with SDK installed
- Android Emulator or physical Android device
- Set up ANDROID_HOME environment variable

## Troubleshooting

Common issues and solutions:

- 🔄 Clear metro bundler cache: `npm start --reset-cache`
- 📦 Reinstall node modules: `rm -rf node_modules && npm install`
- ⬆️ Update Expo SDK: Follow instructions in [expo.dev/upgrade](https://expo.dev/upgrade)

## Environment Setup

No environment variables needed as all data is stored locally using AsyncStorage.
