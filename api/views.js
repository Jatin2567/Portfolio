// Vercel Serverless Function: Real-Time Edge Visitor Counter
export default async function handler(req, res) {
  try {
    // Atomically increment and fetch real visitor count
    const response = await fetch('https://countapi.mileshilliard.com/api/v1/hit/jatin_aggarwal_portfolio_live', {
      headers: { 'User-Agent': 'Vercel-Edge-Visitor-Tracker/1.0' }
    });
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    return res.status(200).json({
      success: true,
      views: data.value || 1,
      edgeRegion: req.headers['x-vercel-id'] || 'iad1',
      timestamp: Date.now()
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      views: 1,
      edgeRegion: 'fallback',
      timestamp: Date.now()
    });
  }
}
