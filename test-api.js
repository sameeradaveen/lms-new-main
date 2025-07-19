// Simple test script to verify API endpoints
const testAPI = async () => {
  try {
    console.log('Testing API endpoints...');
    
    // Test server health
    const healthResponse = await fetch('http://localhost:3000/api/users');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const users = await healthResponse.json();
      console.log('Users found:', users.length);
    } else {
      console.log('Health check failed');
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
};

testAPI(); 