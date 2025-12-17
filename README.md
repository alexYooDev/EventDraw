# 🎰 Luck of a Draw - Customer Feedback Roulette

A full-stack web application that gamifies customer feedback collection through a roulette-style winner selection system. Customers submit feedback and are automatically entered for a chance to win prizes through an animated roulette wheel.

## Features

### Customer-Facing
- **Feedback Submission** - Simple, clean form for customers to submit their feedback
- **Public Access** - Customers can access the feedback page via a shareable link (no login required)
- **Email Entry** - Customers provide their email to be notified if they win

### Business Owner (Admin)
- **Roulette Wheel** - Animated wheel to randomly select winners from eligible customers
- **Winner Notification** - Option to send winner notifications immediately or queue for later
- **Customer Management** - View all customers, their feedback, and winner status
- **Password Protection** - Simple authentication to secure admin dashboard

## Tech Stack

### Frontend
- **React** 19.2.0 with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** v4 - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** (Neon) - Cloud-hosted PostgreSQL database
- **Alembic** - Database migration tool
- **Pydantic** - Data validation

## Project Structure

```
luck-of-a-draw/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── AdminAuth.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── CustomerList.tsx
│   │   │   ├── RouletteWheel.tsx
│   │   │   └── WinnerDisplay.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── PublicFeedbackPage.tsx
│   │   ├── services/        # API services
│   │   │   ├── api.ts
│   │   │   └── customerService.ts
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── customer.ts
│   │   └── App.tsx          # Main app with routing
│   └── package.json
│
└── backend/                  # FastAPI backend application
    ├── app/
    │   ├── api/v1/          # API endpoints
    │   │   └── endpoints/
    │   │       └── customers.py
    │   ├── core/            # Core configuration
    │   │   ├── config.py
    │   │   └── database.py
    │   ├── models/          # Database models
    │   │   └── customer.py
    │   ├── repositories/    # Data access layer
    │   │   └── customer_repository.py
    │   ├── schemas/         # Pydantic schemas
    │   │   ├── customer.py
    │   │   └── notification.py
    │   └── main.py          # FastAPI app entry point
    └── requirements.txt
```

## Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+
- **PostgreSQL** database (or use Neon cloud database)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PROJECT_NAME="Luck of a Draw API"
   API_V1_PREFIX="/api/v1"
   DATABASE_URL="postgresql://user:password@host:port/database"
   CORS_ORIGINS=["http://localhost:5173", "http://localhost:5174"]
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5174`

## Usage

### For Customers

1. **Access the feedback page** at `http://localhost:5174/`
2. **Fill out the form** with name, email, and feedback
3. **Submit** - You'll receive a confirmation message
4. **Wait for notification** - If selected as a winner, you'll be notified via email

### For Business Owners

1. **Access the admin dashboard** at `http://localhost:5174/admin`
2. **Enter admin password** (default: `admin123`)
   - **IMPORTANT**: Change this password in `frontend/src/components/AdminAuth.tsx`
3. **Draw Winner**
   - Click "Spin the Wheel" to randomly select a winner
   - Choose to send notification immediately or later
4. **View Customers**
   - See all customers and their feedback
   - Winners are highlighted with a badge

## API Endpoints

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/customers/` | Create a new customer |
| GET | `/api/v1/customers/` | Get all customers (with pagination) |
| GET | `/api/v1/customers/{id}` | Get customer by ID |
| PUT | `/api/v1/customers/{id}` | Update customer |
| DELETE | `/api/v1/customers/{id}` | Delete customer |
| GET | `/api/v1/customers/winner/random` | Get random non-winner |
| POST | `/api/v1/customers/{id}/mark-winner` | Mark customer as winner |
| POST | `/api/v1/customers/notify-winner` | Send winner notification |

## Generating Customer Feedback Links

To share the feedback form with customers:

1. **Development**: `http://localhost:5174/`
2. **Production**: Deploy the frontend and share the production URL

You can create custom URLs with query parameters for tracking:
```
http://localhost:5174/?source=email&campaign=spring2024
```

## Security Considerations

### Current Implementation (Development Only)
- Simple password protection on admin dashboard
- Password stored in frontend code
- Session-based authentication using sessionStorage

### For Production
1. **Implement proper authentication**
   - Use JWT tokens
   - Validate credentials on the backend
   - Add user management system

2. **Environment variables**
   - Move admin password to environment variables
   - Use secure password hashing (bcrypt, argon2)

3. **HTTPS**
   - Use HTTPS in production
   - Secure cookies with httpOnly and secure flags

4. **Rate limiting**
   - Add rate limiting to prevent abuse
   - Implement CAPTCHA on public forms

## Email Integration

The notification system is currently simulated. To implement real email notifications:

1. **Choose an email service**
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Add email configuration**
   ```python
   # backend/app/core/config.py
   EMAIL_API_KEY: str
   EMAIL_FROM: str
   EMAIL_FROM_NAME: str
   ```

3. **Implement email sending**
   ```python
   # backend/app/services/email_service.py
   async def send_winner_notification(customer: Customer):
       # Integrate with your email service
       pass
   ```

4. **Update the notification endpoint**
   Call the email service in `/api/v1/customers/notify-winner`

## Testing

### Frontend
```bash
cd frontend
npm test              # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Backend
```bash
cd backend
pytest                # Run tests
pytest --cov          # Run with coverage
```

## Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variable: `VITE_API_BASE_URL`
4. Deploy

### Backend (Railway/Render/Heroku)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables (DATABASE_URL, etc.)
4. Deploy

## Future Enhancements

- [ ] Email notification integration
- [ ] Admin user management
- [ ] Multiple prize tiers
- [ ] Winner history and analytics
- [ ] Scheduled drawings
- [ ] Custom branding/theming
- [ ] Export customer data (CSV/Excel)
- [ ] Automated email campaigns
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and FastAPI**
