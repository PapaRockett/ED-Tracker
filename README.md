# ED Tracker (Expo SDK 54, Android)

This project is a mobile app for Android using **Expo SDK 54**.

## What it does

- Tracks shift **start times Monday-Friday only**.
- Uses a **5-week repeating cycle**.
- Uses a dropdown picker for each day with options: **8:00 AM, 9:00 AM, 5:00 PM, 6:30 PM**.
- Highlights the **current cycle day** in the app.
- Includes an Android **home screen widget** that shows the active week and marks today's weekday.

## Run in VS Code + QR flow

```bash
npm install
npm run start
```

Then scan the QR code in Expo Go.

## Home-screen widget setup (important)

Android widgets require native code, so they are **not available in Expo Go**.

1. Build/install a development build (example: `npx expo run:android` or EAS dev build).
2. Open the installed app once and set your schedule.
3. Long-press Android home screen.
4. Tap **Widgets**.
5. Choose **ED Tracker**.
6. Place the widget on the home screen.
