// Hardcoded cron jobs that will always run
// These jobs are permanent and survive all redeployments

export const permanentJobs = [
  {
    id: 'job-1',
    url: 'https://nikhilsol9876-deepfake-audio-detector.hf.space/health',
    interval: 86400, // 24 hours
    active: true,
    description: 'Health check for main API'
  },
  // Add more jobs here:
  // {
  //   id: 'job-2',
  //   url: 'https://mywebsite.com/ping',
  //   interval: 300, // 5 minutes
  //   active: true,
  //   description: 'Keep website alive'
  // },
];

// Enable/disable the web interface for adding temporary jobs
export const allowDynamicJobs = true;
