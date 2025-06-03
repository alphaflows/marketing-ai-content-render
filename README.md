# AI Content Generator

An AI-powered content generation tool that helps create marketing content based on reference articles, product information, and SEO requirements.

## Features

- Content generation based on multiple inputs:
  - Reference article links
  - Product information
  - Target SEO keywords
  - Content purpose/direction
- Web crawling for reference material
- LLM-powered content generation
- User management system
- Content history tracking
- Admin dashboard
- Content regeneration capability

## Tech Stack

- Frontend: React.js
- Backend: Python (FastAPI)
- Database: PostgreSQL
- Authentication: JWT
- Web Crawling: BeautifulSoup4, requests
- LLM Integration: OpenAI API

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── docker-compose.yml
```

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Configure your environment variables
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Set up the database:
   ```bash
   docker-compose up -d
   ```

5. Run the development servers:
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `npm start`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/content_generator
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## API Documentation

API documentation is available at `/docs` when running the backend server.

## License

MIT
