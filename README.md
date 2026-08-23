# Nexaro

Nexaro is a full-stack web application built to serve as a dynamic marketplace where users can post jobs (tasks) and workers can complete them efficiently. The platform streamlines the process of job posting, bidding, and completion, making it a fast and reliable solution for task management.

## Features

- **User Roles:** Distinct roles for Admin, Job Posters, and Workers.
- **Authentication:** Secure login using JWT, Google Auth, and OTP-based verification.
- **Task Management:** Posters can create, manage, and track tasks.
- **Bidding System:** Workers can place bids on available tasks.
- **Real-time Communication:** Powered by Socket.io for instant updates and notifications.
- **Secure Payments:** Integrated with PayPal for seamless transactions and wallet management.
- **Location Services:** Task mapping and location tracking using Leaflet and Geohashing.
- **Reviews & Ratings:** Built-in review system to ensure quality and trust between users.

## Tech Stack

### Front-end
- **Framework:** React with Vite
- **Styling:** Tailwind CSS & Shadcn UI
- **State Management:** Redux Toolkit & Zustand
- **Routing:** React Router DOM
- **Maps:** Leaflet & React-Leaflet
- **Other Tools:** React Hook Form, Socket.io-client, Axios

### Back-end
- **Environment:** Node.js & Express.js
- **Database:** MongoDB (Mongoose)
- **Caching:** Redis
- **Authentication:** JWT, Google Auth Library, bcrypt
- **Real-time:** Socket.io
- **File Uploads:** Multer & Cloudinary
- **Emails:** NodeMailer

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venkiteshns/Nexaro.git
   cd Nexaro
   ```

2. **Setup Back-end:**
   ```bash
   cd back-end
   npm install
   # Create a .env file and add your environment variables
   npm run dev
   ```

3. **Setup Front-end:**
   ```bash
   cd ../front-end
   npm install
   # Create a .env file and add your environment variables
   npm run dev
   ```

## License
This project is licensed under the ISC License.
