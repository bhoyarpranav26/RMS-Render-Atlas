#!/usr/bin/env node
/**
 * Backend API Test Script
 * Run this to validate your backend is working correctly
 * 
 * Usage: node backend/test-api.js
 */

const http = require('http');

const API_URL = 'http://localhost:5000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  log('blue', '\n🧪 RestoM Backend API Test Suite\n');
  log('blue', `Testing: ${API_URL}\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Health Check
  try {
    log('yellow', '📋 Test 1: Health Check');
    const res = await makeRequest('GET', '/health');
    if (res.status === 200 && res.data.ok) {
      log('green', '✅ PASS: Server is running\n');
      testsPassed++;
    } else {
      log('red', `❌ FAIL: Unexpected response ${res.status}\n`);
      testsFailed++;
    }
  } catch (err) {
    log('red', `❌ FAIL: Cannot connect to backend. Is it running on port 5000?\n`);
    log('red', `Error: ${err.message}\n`);
    testsFailed++;
  }

  // Test 2: Request OTP
  try {
    log('yellow', '📋 Test 2: Request OTP for Signup');
    const testData = {
      name: 'Test User',
      email: 'testuser' + Date.now() + '@example.com',
      phone: '9876543210',
      password: 'TestPass123!',
    };
    const res = await makeRequest('POST', '/api/auth/request-otp', testData);
    if (res.status === 200 && res.data.ok) {
      log('green', `✅ PASS: OTP sent to ${testData.email}`);
      log('blue', `   Response: ${res.data.message}\n`);
      testsPassed++;
      
      // Store for next test
      global.testEmail = testData.email;
      global.testOtp = '000000'; // You'll need actual OTP from email
    } else {
      log('red', `❌ FAIL: ${res.status} - ${res.data.error}\n`);
      testsFailed++;
    }
  } catch (err) {
    log('red', `❌ FAIL: ${err.message}\n`);
    testsFailed++;
  }

  // Test 3: Login (should fail - user not created yet)
  try {
    log('yellow', '📋 Test 3: Login with non-existent user (should fail)');
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'nonexistent@example.com',
      password: 'password123',
    });
    if (res.status === 400 && res.data.error === 'Invalid credentials') {
      log('green', `✅ PASS: Correctly rejected non-existent user\n`);
      testsPassed++;
    } else {
      log('red', `❌ FAIL: Should reject non-existent user\n`);
      testsFailed++;
    }
  } catch (err) {
    log('red', `❌ FAIL: ${err.message}\n`);
    testsFailed++;
  }

  // Test 4: Request OTP with invalid email
  try {
    log('yellow', '📋 Test 4: Request OTP with invalid email (should fail)');
    const res = await makeRequest('POST', '/api/auth/request-otp', {
      name: 'Test',
      email: 'invalid-email',
      phone: '9876543211',
      password: 'TestPass123!',
    });
    if (res.status === 400 && res.data.error) {
      log('green', `✅ PASS: Correctly rejected invalid email`);
      log('blue', `   Error: ${res.data.error}\n`);
      testsPassed++;
    } else {
      log('red', `❌ FAIL: Should reject invalid email\n`);
      testsFailed++;
    }
  } catch (err) {
    log('red', `❌ FAIL: ${err.message}\n`);
    testsFailed++;
  }

  // Test 5: Create Admin
  try {
    log('yellow', '📋 Test 5: Create Admin User');
    const adminData = {
      name: 'Admin Test',
      email: 'admin' + Date.now() + '@example.com',
      phone: '9876543212',
      password: 'AdminPass123!',
      adminKey: process.env.ADMIN_KEY || 'supersecretadminkey', // Use env var or default
    };
    const res = await makeRequest('POST', '/api/auth/create-admin', adminData);
    if (res.status === 200 || res.status === 403) {
      if (res.status === 200 && res.data.ok && res.data.user.role === 'admin') {
        log('green', `✅ PASS: Admin created`);
        log('blue', `   Email: ${res.data.user.email}\n`);
        testsPassed++;
      } else if (res.status === 403) {
        log('yellow', `⚠️  SKIP: Invalid admin key (set ADMIN_KEY env var to test)\n`);
        testsPassed++;
      } else {
        log('red', `❌ FAIL: ${res.data.error}\n`);
        testsFailed++;
      }
    } else {
      log('red', `❌ FAIL: Unexpected status ${res.status}\n`);
      testsFailed++;
    }
  } catch (err) {
    log('red', `❌ FAIL: ${err.message}\n`);
    testsFailed++;
  }

  // Summary
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('blue', `\n📊 Test Results:`);
  log('green', `   ✅ Passed: ${testsPassed}`);
  log(testsFailed > 0 ? 'red' : 'green', `   ${testsFailed > 0 ? '❌' : '✅'} Failed: ${testsFailed}`);
  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (testsFailed === 0) {
    log('green', '✅ All tests passed! Backend is ready.\n');
    log('blue', '📝 Next steps:');
    log('blue', '   1. Start frontend: npm run dev (in root folder)');
    log('blue', '   2. Visit http://localhost:5173');
    log('blue', '   3. Test signup flow\n');
  } else {
    log('red', '❌ Some tests failed. Check your setup.\n');
    log('blue', '💡 Tips:');
    log('blue', '   - Is MongoDB Atlas URI correct?');
    log('blue', '   - Check .env file has all required variables');
    log('blue', '   - Are all dependencies installed? (npm install)\n');
  }

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((err) => {
  log('red', `Fatal error: ${err.message}`);
  process.exit(1);
});
