# Timer App - Frontend

A sleek and efficient timer application built with React, TypeScript, and Vite. Track your tasks, manage labels, and visualize your productivity history.

## 🚀 Features

- **Customizable Timers**: Create and manage different timer durations.
- **Label Management**: Categorize your sessions with custom labels.
- **Productivity History**: View detailed history of your timed sessions with charts and lists.
- **Tab Notifications**: Get notified when a timer finishes, even if you're on another tab.
- **Import/Export**: Easily backup or migrate your data via CSV.
- **User Authentication**: Secure your data with registration and login.
- **Responsive Design**: Modern UI built with Tailwind CSS.

## 🛠️ Technologies Used

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/), [HeroUI](https://heroui.com/)
- **Data Fetching**: [Axios](https://axios-http.com/)
- **State Management**: React Hooks (Custom hooks for settings, labels, history, etc.)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. Navigate to the `timer_frontend` directory:
   ```bash
   cd timer_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the TypeScript code and builds the production-ready assets.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.
- `npm run deploy`: Deploys the application to GitHub Pages.

## 📂 Project Structure

- `src/components`: Reusable UI components organized by feature.
- `src/hooks`: Custom React hooks for business logic and state management.
- `src/pages`: Main application views/routes.
- `src/types`: TypeScript interfaces and types.
- `src/utils`: Helper functions for time formatting, CSV handling, etc.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
