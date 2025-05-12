# EventBuddy

EventBuddy is a social platform that helps you find companions to attend local events like concerts, festivals, sports games, and more. Never attend an event alone again!

## Features

- **Event Discovery**: Browse through a curated list of local events
- **Find Event Buddies**: Connect with like-minded people interested in the same events
- **Interest Matching**: Get matched with users who share similar interests
- **In-app Messaging**: Communicate with potential event buddies directly in the app
- **User Profiles**: Customize your profile to highlight your interests and preferences

## Tech Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Authentication**: Firebase Authentication with Google Sign-in
- **Database**: MongoDB for data storage
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for lightweight client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB connection string
- Firebase project (for authentication)

### Environment Setup

The application requires the following environment variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://console.firebase.google.com/)
2. Add a new web app to your Firebase project
3. Enable Google authentication in the Authentication section
4. Add your development and production domains to the Authorized Domains list
5. Copy your Firebase configuration details for the environment variables

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:5000`

### Deployment to Firebase

The project is pre-configured for Firebase deployment with both hosting (frontend) and functions (backend API). Follow these steps to deploy:

#### Quick Deployment

1. Install Firebase CLI globally:
   ```
   npm install -g firebase-tools
   ```
   
2. Run the provided deployment script:
   ```
   ./deploy.sh
   ```

#### Manual Deployment Steps

If you prefer to deploy manually or need more control:

1. Login to Firebase:
   ```
   firebase login
   ```
   
2. Set up Firebase environment variables:
   ```
   ./firebase-config.sh
   ```
   This script will prompt you for your MongoDB connection string and set it in Firebase Functions environment.
   
3. Build the project:
   ```
   npm run build
   ```
   
4. Deploy to Firebase:
   ```
   firebase deploy
   ```

#### Deploying Only Frontend or Backend

- To deploy only the frontend:
  ```
  firebase deploy --only hosting
  ```

- To deploy only the backend:
  ```
  firebase deploy --only functions
  ```

#### Environment Variables in Firebase

Firebase Functions uses a different environment variables system than your local development environment. To set Firebase environment variables:

```
firebase functions:config:set mongodb.uri="your-mongodb-connection-string"
```

To get your current Firebase environment variables:
```
firebase functions:config:get
```

Once deployed, your app will be available at `https://your-project-id.web.app` and the API at `https://your-project-id.web.app/api/`

## Project Structure

```
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and services
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
├── server/               # Backend code
│   ├── models/           # MongoDB data models
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database access layer
└── shared/               # Shared types and utilities
    └── schema.ts         # Database schema definitions
```

## API Documentation

The application provides the following API endpoints:

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `GET /api/events/featured` - Get featured events
- `GET /api/users/:id` - Get user profile
- `POST /api/buddy-requests` - Create a buddy request
- `GET /api/buddy-requests/:userId` - Get user's buddy requests
- `POST /api/messages` - Send a message
- `GET /api/messages/:user1Id/:user2Id` - Get conversation between two users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.