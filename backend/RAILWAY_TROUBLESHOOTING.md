# Railway Deployment Troubleshooting Guide

## Server Not Responding

If your Railway deployment at `eventdraw-production.up.railway.app` fails to respond, check these common issues:

### 1. **Environment Variables Not Set**

Railway requires the following environment variables to be configured:

#### Required:
- `DATABASE_URL` - PostgreSQL connection string from Railway's database service
  - Example: `postgresql://user:password@host:port/database`
  - Railway automatically provides this if you add a PostgreSQL database to your project

#### How to Add Environment Variables in Railway:
1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab  
4. Add the required environment variables
5. Redeploy your service

### 2. **Database Not Provisioned**

If you haven't added a PostgreSQL database:

1. In Railway dashboard, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable
4. Your app will redeploy and connect to the database

### 3. **Port Binding Issues**

Railway automatically provides the `PORT` environment variable. Our Dockerfile correctly uses it:
```dockerfile
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### 4. **Alembic Migrations Failing**

If migrations fail, the server won't start. Check Railway logs:
1. Go to your service in Railway
2. Click "Deployments" tab  
3. Click on the latest deployment
4. Check the "Deploy Logs" for errors like:
   - `sqlalchemy.exc.OperationalError` - Database connection failed
   - `ValidationError` - Missing required environment variables
   - `ModuleNotFoundError` - Missing Python packages

### 5. **Check Deployment Logs**

Always check Railway logs to see the actual error:
```
Railway Dashboard → Your Service → Deployments → Latest → Deploy Logs
```

Common errors:
- `pydantic_core._pydantic_core.ValidationError: DATABASE_URL` → DATABASE_URL not set
- `Connection refused` → Database not reachable
- `Port already in use` → Port binding issue (unlikely on Railway)

### 6. **Health Check Endpoint**

Our app has a health check at the root endpoint `/`:
```python
@app.get("/")
async def root():
    return {
        "message": "Luck of a Draw Roulette API",
        "status": "running | healthy"
    }
```

If the server starts successfully, visiting `https://eventdraw-production.up.railway.app/` should return this JSON.

### 7. **Quick Fix Checklist**

- [ ] DATABASE_URL environment variable is set in Railway
- [ ] PostgreSQL database is provisioned and running
- [ ] Latest commit is deployed on Railway
- [ ] No errors in Railway deploy logs
- [ ] Health check endpoint (/) returns 200 OK

### 8. **Testing Locally**

To test if the issue is Railway-specific, run locally with Railway's database:

```bash
cd backend

# Get DATABASE_URL from Railway dashboard
export DATABASE_URL="postgresql://..."
export PORT=8000

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then visit `http://localhost:8000/` - if it works locally, the issue is Railway configuration.

## Next Steps

1. **Check Railway logs** for specific error messages
2. **Verify DATABASE_URL** is set in Railway environment variables  
3. **Ensure PostgreSQL** database is provisioned and connected
4. Share any error messages from Railway logs for more specific help
