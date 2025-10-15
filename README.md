# BackText

AI-powered background removal with custom text overlays. Upload an image, remove the background automatically, and add stylized text with full customization options.

🌐 **Live App**: [https://backtext.fun](https://backtext.fun)

## Features

- **AI Background Removal**: Automatic background removal using advanced AI
- **Custom Text Overlays**: Add text with multiple font options
- **Full Customization**: Adjust position, size, color, and opacity
- **Real-time Preview**: See changes instantly on the canvas
- **High-Quality Export**: Download your edited images
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables:
   ```env
   # Authentication
   AUTH_SECRET="your-auth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/backtext"
   
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

### Installation & Development

```bash
# Install dependencies
pnpm install

# Set up the database
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **AI Processing**: @imgly/background-removal
- **UI Components**: Radix UI

## Deployment

The app is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

## License

MIT License
