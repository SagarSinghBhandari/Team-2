# AI Driven Returns Optimizer - Frontend Dashboard

A modern, responsive investment portfolio optimizer dashboard built with React, Tailwind CSS, and Recharts. This frontend provides a clean interface for AI-driven investment analysis and portfolio management.

## 🚀 Features

### 📊 Dashboard Overview
- **User Profile Section**: Display user information, total investment, current portfolio value, and risk profile
- **Portfolio Visualization**: Interactive pie charts and line graphs showing asset allocation and growth
- **Past Analyses**: Quick access to previous portfolio analyses with summaries
- **Quick Actions**: Easy navigation to create new analyses or view history

### 📈 Analysis Management
- **New Analysis**: Form-based interface for creating new portfolio analyses
- **Analysis History**: Comprehensive view of all past analyses with filtering and search
- **Detailed Analysis View**: In-depth analysis pages with multiple chart types and performance metrics

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Fintech Aesthetic**: Professional design with modern color schemes
- **Interactive Charts**: Powered by Recharts for smooth data visualization
- **Intuitive Navigation**: Sidebar and topbar navigation with clear user flows

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.14
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Development**: ESLint for code quality

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Topbar.jsx       # Top navigation bar
│   ├── Dashboard.jsx    # Main dashboard component
│   └── AnalysisDetail.jsx # Detailed analysis view
├── pages/               # Page components
│   ├── NewAnalysis.jsx  # New analysis form
│   ├── History.jsx      # Analysis history
│   └── Settings.jsx     # User settings
├── data/                # Mock data
│   └── mockData.js      # Sample data for development
└── App.jsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Mock Data Structure

The application uses comprehensive mock data for development and testing:

### User Profile
```javascript
{
  name: "Rohan Mehta",
  riskProfile: "Moderate",
  totalInvestment: 500000,
  currentValue: 612000,
  totalReturns: 112000,
  returnPercentage: 22.4
}
```

### Portfolio Analysis
```javascript
{
  id: 1,
  title: "10-Year Moderate Risk Plan",
  allocation: { stocks: 40, bonds: 35, gold: 15, realEstate: 10 },
  expectedReturns: 8.5,
  returnsData: [...], // Time-series data
  monthlyReturns: [...] // Monthly return percentages
}
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Portfolio charts, primary actions)
- **Success Green**: #10b981 (Positive returns, success states)
- **Warning Yellow**: #facc15 (Moderate risk, warnings)
- **Danger Red**: #ef4444 (High risk, errors)
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable gray tones
- **Numbers**: Monospace for financial data

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds for primary actions
- **Charts**: Consistent color coding across all visualizations
- **Forms**: Clean inputs with focus states

## 🔌 API Integration Ready

The frontend is designed to easily integrate with backend APIs:

### Expected Endpoints
- `GET /api/user/profile` - User profile data
- `GET /api/analyses` - List of past analyses
- `POST /api/analyses` - Create new analysis
- `GET /api/analyses/:id` - Detailed analysis data
- `PUT /api/user/settings` - Update user preferences

### Data Flow
1. **Dashboard**: Fetches user profile and recent analyses
2. **New Analysis**: Submits form data to create analysis
3. **History**: Loads filtered list of analyses
4. **Analysis Detail**: Fetches detailed analysis data
5. **Settings**: Updates user preferences

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Collapsible sidebar navigation
- Touch-friendly button sizes
- Optimized chart sizes
- Simplified layouts for small screens

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔮 Future Enhancements

- **Real-time Data**: WebSocket integration for live portfolio updates
- **Advanced Charts**: More sophisticated financial visualizations
- **Export Features**: PDF reports and data export
- **Dark Mode**: Theme switching capability
- **PWA Support**: Offline functionality
- **Advanced Filtering**: More granular analysis filtering
- **Portfolio Comparison**: Side-by-side analysis comparison

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **React Router** for seamless navigation