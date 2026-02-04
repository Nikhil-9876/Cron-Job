# Vercel Cron Job Scheduler

A serverless cron job scheduler that runs automatically on Vercel's infrastructure. Create scheduled HTTP requests that run 24/7 without keeping your browser open!

## Features

✅ **Serverless Execution** - Runs on Vercel's servers, not in your browser
✅ **24/7 Operation** - Jobs run automatically even when nobody is viewing the page
✅ **Real-time Dashboard** - View and manage all active cron jobs
✅ **Activity Logs** - Track all job executions with timestamps
✅ **Easy Management** - Add or remove jobs with a simple interface

## How It Works

1. **Frontend (React + Vite)** - User interface to manage cron jobs
2. **Serverless API Routes** - Node.js functions that run on Vercel
3. **Vercel Cron** - Executes the job checker every minute
4. **Automatic Execution** - Jobs run based on their configured intervals

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add serverless cron functionality"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the Vite configuration
5. Click **Deploy**

That's it! Your cron job scheduler is now live and running 24/7.

### Step 3: Verify Cron is Working

After deployment, check the "Functions" tab in your Vercel dashboard to see the scheduled cron executions.

## Important Notes

### Storage Limitation ⚠️

The current implementation uses **in-memory storage**, which means:
- Jobs and logs are stored in server memory
- Data is **lost on each new deployment**
- For production use, you should integrate a database

### Recommended for Production

For persistent storage, integrate one of these:

1. **Vercel KV** (Redis) - Fastest option, built into Vercel
2. **MongoDB Atlas** - Free tier available
3. **PostgreSQL** (Neon, Supabase) - Free tiers available
4. **Vercel Postgres** - Native integration

### Interval Limitations

- Minimum interval: **60 seconds**
- Cron checker runs: **Every 1 minute**
- Best practice: Use intervals that are multiples of 60 seconds

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will run at `http://localhost:5173`

## API Endpoints

- `POST /api/jobs` - Create a new cron job
- `GET /api/jobs` - Get all active jobs
- `DELETE /api/jobs` - Delete a job
- `GET /api/logs` - Get execution logs
- `POST /api/logs` - Add a log entry (internal use)
- `GET /api/execute-cron` - Cron execution endpoint (called by Vercel)

## Project Structure

```
CronJob/
├── api/                    # Serverless functions
│   ├── jobs.js            # Job management API
│   ├── execute-cron.js    # Cron execution logic
│   └── logs.js            # Logging API
├── src/
│   ├── App.jsx            # Main React component
│   ├── App.css            # Styles
│   └── main.jsx           # React entry point
├── vercel.json            # Vercel configuration & cron schedule
└── package.json
```

## Environment Variables (Optional)

For added security, you can set a `CRON_SECRET` in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `CRON_SECRET` with a random string

This prevents unauthorized access to the cron execution endpoint.

## License

MIT

## Contributing

Feel free to open issues or submit pull requests!
