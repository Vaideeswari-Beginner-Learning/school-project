// Configuration for API endpoints
const CONFIG = {
    // Replace with your Render Backend URL once deployed
    // e.g., 'https://your-school-backend.onrender.com'
    API_BASE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api' 
        : 'https://school-project-1-9lz1.onrender.com/api'
};

console.log('API Base URL:', CONFIG.API_BASE);
