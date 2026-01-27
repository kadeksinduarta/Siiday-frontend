# ⚡ Siiday - Your Aesthetic Habit Tracker

**Siiday** is a modern, high-performance habit tracking application designed to help you build consistency through beautiful data visualization and social accountability. Unlike complex productivity tools, Siiday focuses on keeping you in the flow with a sleek, dark-mode-first interface.

![Siiday Dashboard](https://github.com/kadeksinduarta/Siiday-frontend/blob/main/screenshot-dashboard.png?raw=true)
*(Note: Upload a screenshot of your dashboard to your repo and update this link)*

## ✨ Key Features

- **Weekly Habit Grid**: A clean, focused view of your week. Check off habits for "today" only to maintain integrity and focus.
- **One-Click Management**: Add, edit, and delete habits instantly with a smooth modal interface.
- **Habit Velocity Trends**: Visualize your momentum with a real-time line chart showing your consistency over the last 30 days.
- **Smart Analytics**: Track your "Daily Score", current streak, total completions, and weekly consistency percentage.
- **Social-Ready Share Cards**: Generate stunning, high-resolution (1080x1920) images of your weekly progress, perfect for sharing on Instagram Stories or WhatsApp Status.
- **Optimized for Mobile**: Responsive design that works perfectly on desktop and mobile browsers.

## 🛠 Tech Stack

**Frontend:**
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Image Generation**: `html-to-image`

**Backend:**
- **Framework**: [Laravel](https://laravel.com/) (PHP)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum / Socialite (Google Auth)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- PHP (v8.1+) & Composer
- MySQL Database

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/kadeksinduarta/Siiday-frontend.git
cd Siiday-frontend
```

#### 2. Backend Setup (Laravel)
Navigate to the backend directory (if separate, or within the project structure):
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
Configure your database credentials in `.env`, then run migrations:
```bash
php artisan migrate
```
Start the backend server:
```bash
php artisan serve
```

#### 3. Frontend Setup (Next.js)
Navigate to the frontend directory:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots

### Weekly Recap Card
Share your wins with a generated card that looks like this:
*(You can add a screenshot of the share card here)*

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
