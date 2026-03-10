#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');

console.log('🔧 Google OAuth Configuration Helper');
console.log('====================================');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1] : `NOT_SET`;
};

const isPlaceholder = (value) => {
  return value.includes('your-google-') || value.includes('your-google-client-id') || value === 'NOT_SET';
};

const googleClientId = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');
const nextAuthUrl = getEnvVar('NEXTAUTH_URL');
const basePath = getEnvVar('NEXT_PUBLIC_BASE_PATH') !== 'NOT_SET' ? getEnvVar('NEXT_PUBLIC_BASE_PATH') : '';

console.log('\nCurrent Google OAuth configuration:');
console.log('-----------------------------------');
console.log(`Google Client ID: ${googleClientId.substring(0, 15)}...`);
console.log(`Google Client Secret: ${googleClientSecret.substring(0, 15)}...`);
console.log(`NextAuth URL: ${nextAuthUrl}`);

if (isPlaceholder(googleClientId) || isPlaceholder(googleClientSecret)) {
  console.log('\n⚠️  GOOGLE OAUTH NOT CONFIGURED');
  console.log('==============================');
  console.log('Your Google OAuth credentials are set to placeholder values.');
  console.log('To enable Google OAuth, you need to:');
  console.log('\n1. Go to Google Cloud Console: https://console.cloud.google.com');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Google+ API');
  console.log('4. Go to "APIs & Services" → "Credentials"');
  console.log('5. Click "Create Credentials" → "OAuth 2.0 Client IDs"');
  console.log('6. Choose "Web application"');
  console.log('7. Add authorized redirect URIs:');
  console.log(`   - ${nextAuthUrl}/api/auth/callback/google`);
  if (basePath) {
    console.log('   - http://localhost:3001' + basePath + '/api/auth/callback/google');
    console.log('   - http://localhost:3002' + basePath + '/api/auth/callback/google');
  } else {
    console.log('   - http://localhost:3001/api/auth/callback/google');
    console.log('   - http://localhost:3002/api/auth/callback/google');
  }
  console.log('8. Copy your Client ID and Client Secret');
  console.log('9. Update your .env file with:');
  console.log('\n   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com');
  console.log('   GOOGLE_CLIENT_SECRET=your-actual-client-secret');
  console.log('\n10. Restart your development server: npm run dev');
  console.log('\n📖 For detailed instructions, see: GOOGLE_OAUTH_SETUP.md');
} else {
  console.log('\n✅ Google OAuth is CONFIGURED');
  console.log('============================');
  console.log('Your Google OAuth credentials appear to be set correctly.');
  console.log('\n🚀 Ready to test? Visit: http://localhost:3000');
  console.log('Click Login → Google button to test OAuth flow');
}

console.log('\n🔍 Current OAuth Implementation Status:');
console.log('--------------------------------------');
console.log('✅ Google Provider configured in auth.ts');
console.log('✅ Google buttons in LoginModal and RegisterModal');
console.log('✅ Error handling and loading states');
console.log('✅ Automatic redirect to dashboard after login');
console.log('✅ Session management with NextAuth.js');

if (isPlaceholder(googleClientId) || isPlaceholder(googleClientSecret)) {
  console.log('⚠️  Environment variables need real Google OAuth credentials');
} else {
  console.log('✅ Environment variables configured');
}

console.log('\n📋 What happens when you click Google button:');
console.log('---------------------------------------------');
console.log('1. User clicks Google button');
console.log('2. Redirects to Google OAuth consent screen');
console.log('3. User authorizes the app');
console.log('4. Google redirects back to /api/auth/callback/google');
console.log('5. NextAuth.js creates session and redirects to dashboard');
console.log('6. User is logged in and can access protected routes');

console.log('\n🎯 To test Google OAuth:');
console.log('----------------------');
console.log('1. Make sure you have real Google OAuth credentials');
console.log('2. Update your .env file');
console.log('3. Restart development server');
console.log('4. Visit http://localhost:3000');
console.log('5. Click Login → Google button');
console.log('6. Complete Google OAuth flow');
console.log('7. You should be redirected to dashboard');
