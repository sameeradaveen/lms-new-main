const fs = require('fs');
const path = require('path');

// Test file access
function testFileAccess() {
  console.log('🔍 Testing file access...\n');
  
  const uploadsDir = path.join(__dirname, 'uploads');
  console.log('📁 Uploads directory:', uploadsDir);
  console.log('📁 Directory exists:', fs.existsSync(uploadsDir));
  
  if (fs.existsSync(uploadsDir)) {
    console.log('📁 Directory permissions:', fs.statSync(uploadsDir).mode.toString(8));
    
    const files = fs.readdirSync(uploadsDir);
    console.log('📄 Files in directory:', files.length);
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  📄 ${file}: ${stats.size} bytes, permissions: ${stats.mode.toString(8)}`);
      
      // Test read access
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log(`    ✅ Readable`);
      } catch (err) {
        console.log(`    ❌ Not readable:`, err.message);
      }
    });
  }
  
  // Test specific file
  const testFile = '8baf3756f8c987636af34908e59f71f9';
  const testFilePath = path.join(uploadsDir, testFile);
  console.log(`\n🎯 Testing specific file: ${testFile}`);
  console.log(`📄 Full path: ${testFilePath}`);
  console.log(`📄 Exists: ${fs.existsSync(testFilePath)}`);
  
  if (fs.existsSync(testFilePath)) {
    const stats = fs.statSync(testFilePath);
    console.log(`📄 Size: ${stats.size} bytes`);
    console.log(`📄 Permissions: ${stats.mode.toString(8)}`);
    
    try {
      fs.accessSync(testFilePath, fs.constants.R_OK);
      console.log(`✅ File is readable`);
    } catch (err) {
      console.log(`❌ File is not readable:`, err.message);
    }
  }
}

testFileAccess(); 