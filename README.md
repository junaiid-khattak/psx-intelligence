# PSX Intelligence

A Bloomberg-lite application for the Pakistan Stock Exchange (PSX) providing professional-grade market intelligence, real-time data, AI-powered insights, and institutional-quality analytics.

## Features

- 📈 **Real-time Market Data** - Live PSX data with millisecond precision
- 🤖 **AI-Powered Insights** - Machine learning algorithms for trading signals
- 📊 **Advanced Charting** - Professional charting tools with technical indicators
- 🛡️ **Risk Management** - Portfolio analytics and risk assessment tools
- 🔐 **Secure Authentication** - User accounts and secure access
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **API**: tRPC for type-safe APIs
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Analytics**: Vercel Analytics
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

Before running this project locally, make sure you have:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn**/**pnpm** as alternatives)
- **Git** for version control
- **Supabase Account**: Sign up at [Supabase](https://supabase.com/) to get your credentials

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd psx-intelligence
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your environment variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Development redirect URL for Supabase auth
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL="http://localhost:3000/dashboard"

# Database (PostgreSQL via Supabase)
DATABASE_URL="your-database-url"

# API Keys (add as needed)
PSX_API_KEY="your-psx-api-key"
\`\`\`

**To get your Supabase credentials:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. For the service role key, copy it from the same API settings page

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

\`\`\`bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
\`\`\`

## Project Structure

\`\`\`
psx-intelligence/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── providers.tsx     # Context providers
│   └── theme-provider.tsx # Theme provider
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── supabase/         # Supabase client configuration
│       ├── client.ts     # Browser client
│       ├── server.ts     # Server client
│       └── middleware.ts # Auth middleware
├── public/               # Static assets
├── scripts/              # Database scripts
├── styles/               # Additional styles
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing code structure and naming conventions
- Use Tailwind CSS for styling
- Implement responsive design for all components
- Use semantic HTML elements

### Component Development

- Create reusable components in the `components/` directory
- Use shadcn/ui components when possible
- Implement proper TypeScript interfaces
- Add proper error handling and loading states

### API Development

- Use tRPC for type-safe API routes
- Implement proper error handling
- Add input validation with Zod schemas
- Follow RESTful principles where applicable

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Next.js template
- **AWS Amplify**: Configure build settings for Next.js

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Development auth redirect URL | No |
| `DATABASE_URL` | Database connection string | No |
| `PSX_API_KEY` | PSX API access key | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Styling not loading:**
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `layout.tsx`
- Verify PostCSS configuration

**Supabase connection issues:**
- Verify all Supabase environment variables are set correctly
- Check that your Supabase project is active
- Ensure Row Level Security (RLS) policies are properly configured

**Authentication not working:**
- Check that `middleware.ts` is properly configured
- Verify email confirmation is enabled in Supabase Auth settings
- Ensure redirect URLs are configured in Supabase Auth settings

**Build errors:**
- Run `npm run type-check` to identify TypeScript issues
- Check for missing dependencies
- Ensure all environment variables are set

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Visit [shadcn/ui documentation](https://ui.shadcn.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Supabase for database and authentication
