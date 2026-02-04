// Store execution logs (in-memory for now)
let logs = [];
const MAX_LOGS = 100;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Retrieve logs
  if (req.method === 'GET') {
    return res.status(200).json({ logs });
  }

  // POST - Add a log entry
  if (req.method === 'POST') {
    const { url, status, message } = req.body;

    const newLog = {
      id: Date.now().toString(),
      url,
      status,
      message,
      timestamp: new Date().toISOString()
    };

    logs.unshift(newLog);
    
    // Keep only last 100 logs
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(0, MAX_LOGS);
    }

    return res.status(200).json({ message: 'Log added', log: newLog });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
