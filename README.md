# DailyDo

A personal task manager built with React Native, Expo and TypeScript.

## Features

- Add, edit, complete and delete tasks
- Due date, priority and category for every task
- Swipe left to delete, with an Undo option
- Category filter and pull-to-refresh
- Motivational quote fetched from a public API (loading and error states)
- Tasks saved on the device with AsyncStorage
- Light and dark mode toggle
- Input validation, haptic feedback and animations

## Folder structure

- `src/app/` : screens (Expo Router file-based routing)
- `src/components/` : reusable UI (TaskCard, TaskInput, AppButton, Chip, QuoteCard, UndoSnackbar, ScreenHeader)
- `src/constants/` : colors, categories, priorities
- `src/context/` : ThemeContext and TasksContext (global state)
- `src/hooks/` : custom hooks (useTasks, useTheme, useQuote)
- `src/utils/` : date helpers
- `scripts/` : script that generates the app icon and splash images

## Navigation

- Root `_layout.tsx` uses a Stack: `(tabs)`, `task/[id]` and `edit-task` (modal).
- `(tabs)/_layout.tsx` has 3 tabs: Today, New task, Profile.
- Tapping a task opens `task/[id]` and the id is read with `useLocalSearchParams`.

## Run the project

```bash
npm install
npx expo start --tunnel ngrok
```

Scan the QR code with the Expo Go app.
