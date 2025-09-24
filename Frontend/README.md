# Humanize Pro Frontend

A modern Next.js application for AI content humanization with a beautiful, responsive UI.

## 🚀 Live Demo

The application is automatically deployed to GitHub Pages at:
**https://kylejuris.github.io/Humanize/**

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Authentication**: Supabase
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
Frontend/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KyleJuris/Humanize.git
cd Humanize/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

The application automatically deploys when you push to the `main` branch:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy the site
3. The site will be available at `https://kylejuris.github.io/Humanize/`

### Manual Deployment

To deploy manually:

```bash
npm run build
npm run deploy
```

## 🔧 Configuration

### GitHub Pages Setup

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The workflow will automatically deploy on push to main

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_api_url
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files
- `npm run deploy` - Build and prepare for deployment

## 🎨 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Authentication**: Secure user authentication with Supabase
- **Dashboard**: User dashboard with profile management
- **AI Humanizer**: Content humanization interface
- **Blog**: Content marketing blog
- **Pricing**: Subscription plans and billing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://kylejuris.github.io/Humanize/)
- [GitHub Repository](https://github.com/KyleJuris/Humanize)
- [Documentation](https://github.com/KyleJuris/Humanize/wiki)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.
