// This function runs on a schedule defined in vercel.json
// It checks all active jobs and executes those that need to run

import { permanentJobs } from './config.js';

let temporaryJobs = []; // Temporary jobs from web interface
// Note: In production, use a shared database

export default async function handler(req, res) {
  // Verify this is called by Vercel Cron (optional security)
  const authHeader = req.headers.authorization;
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // For now, we'll allow execution without secret for testing
    // return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = [];
  const now = Date.now();

  // Combine permanent hardcoded jobs with temporary ones
  const allJobs = [...permanentJobs, ...temporaryJobs];

  for (const job of allJobs) {
    if (!job.active) continue;

    // Check if enough time has passed since last run
    const shouldRun = !job.lastRun || 
                      (now - new Date(job.lastRun).getTime()) >= job.interval * 1000;

    if (shouldRun) {
      try {
        const response = await fetch(job.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Vercel-Cron-Job'
          }
        });

        job.lastRun = new Date().toISOString();
        
        results.push({
          url: job.url,
          status: 'success',
          statusCode: response.status,
          timestamp: job.lastRun
        });
      } catch (error) {
        results.push({
          url: job.url,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  return res.status(200).json({
    message: 'Cron execution completed',
    executedJobs: results.length,
    results
  });
}
