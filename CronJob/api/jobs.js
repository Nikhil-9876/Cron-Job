// In-memory storage (Note: This resets on each deployment)
// For production, use Vercel KV, MongoDB, or PostgreSQL
import { permanentJobs, allowDynamicJobs } from './config.js';

let temporaryJobs = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Retrieve all jobs (permanent + temporary)
  if (req.method === 'GET') {
    const allJobs = [...permanentJobs, ...temporaryJobs];
    return res.status(200).json({ jobs: allJobs, allowDynamicJobs });
  }

  // POST - Create/Update a job
  if (req.method === 'POST') {
    if (!allowDynamicJobs) {
      return res.status(403).json({ error: 'Dynamic job creation is disabled. Edit config.js to add jobs.' });
    }

    const { url, interval } = req.body;

    if (!url || !interval) {
      return res.status(400).json({ error: 'URL and interval are required' });
    }

    if (interval < 60) {
      return res.status(400).json({ error: 'Minimum interval is 60 seconds (Vercel limitation)' });
    }

    // Check if this URL exists in permanent jobs
    const isPermanent = permanentJobs.some(job => job.url === url);
    if (isPermanent) {
      return res.status(400).json({ error: 'This URL is already configured as a permanent job in config.js' });
    }

    // Check if job already exists for this URL in temporary jobs
    const existingIndex = temporaryJobs.findIndex(job => job.url === url);
    
    const newJob = {
      id: Date.now().toString(),
      url,
      interval,
      active: true,
      lastRun: null,
      createdAt: new Date().toISOString(),
      temporary: true
    };

    if (existingIndex >= 0) {
      temporaryJobs[existingIndex] = { ...temporaryJobs[existingIndex], ...newJob };
    } else {
      temporaryJobs.push(newJob);
    }

    return res.status(200).json({ 
      message: 'Temporary job created successfully', 
      job: newJob 
    });
  }

  // DELETE - Remove a job
  if (req.method === 'DELETE') {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check if this is a permanent job
    const isPermanent = permanentJobs.some(job => job.url === url);
    if (isPermanent) {
      return res.status(400).json({ error: 'Cannot delete permanent jobs. Edit config.js to remove them.' });
    }

    temporaryJobs = temporaryJobs.filter(job => job.url !== url);
    
    return res.status(200).json({ message: 'Temporary job deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
