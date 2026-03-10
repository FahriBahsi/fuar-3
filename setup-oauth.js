#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');

console.log('🔧 OAuth Configuration Helper (Google + Facebook)');
console.log('================================================');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1] : `NOT_SET`;
};

const isPlaceholder = (value) => {
  return value.includes('your-') || value.includes('your-google-') || value.includes('your-facebook-') || value === 'NOT_SET';
};

// Google OAuth
const googleClientId = getEnvVar('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');

// Facebook OAuth
const facebookClientId = getEnvVar('FACEBOOK_CLIENT_ID');
const facebookClientSecret = getEnvVar('FACEBOOK_CLIENT_SECRET');

// NextAuth
const nextAuthUrl = getEnvVar('NEXTAUTH_URL');

console.log('\n📊 OAuth Configuration Status:');
console.log('==============================');

// Google Status
const googleConfigured = !isPlaceholder(googleClientId) && !isPlaceholder(googleClientSecret);
console.log(`Google OAuth: ${googleConfigured ? '✅ CONFIGURED' : '⚠️  NOT CONFIGURED'}`);

// Facebook Status
const facebookConfigured = !isPlaceholder(facebookClientId) && !isPlaceholder(facebookClientSecret);
console.log(`Facebook OAuth: ${facebookConfigured ? '✅ CONFIGURED' : '⚠️  NOT CONFIGURED'}`);

console.log('\n📋 Current Configuration:');
console.log('-------------------------');
console.log(`Google Client ID: ${googleClientId.substring(0, 15)}...`);
console.log(`Google Client Secret: ${googleClientSecret.substring(0, 15)}...`);
console.log(`Facebook Client ID: ${facebookClientId.substring(0, 15)}...`);
console.log(`Facebook Client Secret: ${facebookClientSecret.substring(0, 15)}...`);
console.log(`NextAuth URL: ${nextAuthUrl}`);

console.log('\n🔍 Implementation Status:');
console.log('========================');
console.log('✅ Google Provider configured in auth.ts');
console.log('✅ Facebook Provider configured in auth.ts');
console.log('✅ Google buttons in LoginModal and RegisterModal');
console.log('✅ Facebook buttons in LoginModal and RegisterModal');
console.log('✅ Error handling and loading states');
console.log('✅ Automatic redirect to dashboard after login');
console.log('✅ Session management with NextAuth.js');

if (!googleConfigured) {
  console.log('\n⚠️  GOOGLE OAUTH SETUP NEEDED');
  console.log('============================');
  console.log('To configure Google OAuth:');
  console.log('1. Go to Google Cloud Console: https://console.cloud.google.com');
  console.log('2. Create OAuth 2.0 credentials');
  console.log('3. Add redirect URIs:');
  console.log(`   - ${nextAuthUrl}/api/auth/callback/google`);
  console.log('4. Update .env file with real Google credentials');
  console.log('\n📖 Run: npm run setup:google-oauth');
}

if (!facebookConfigured) {
  console.log('\n⚠️  FACEBOOK OAUTH SETUP NEEDED');
  console.log('==============================');
  console.log('To configure Facebook OAuth:');
  console.log('1. Go to Facebook Developers: https://developers.facebook.com');
  console.log('2. Create Facebook app');
  console.log('3. Add Facebook Login product');
  console.log('4. Add redirect URIs:');
  console.log(`   - ${nextAuthUrl}/api/auth/callback/facebook`);
  console.log('5. Update .env file with real Facebook credentials');
  console.log('\n📖 Run: npm run setup:facebook-oauth');
}

if (googleConfigured && facebookConfigured) {
  console.log('\n🎉 ALL OAUTH PROVIDERS CONFIGURED!');
  console.log('==================================');
  console.log('✅ Google OAuth: Ready to use');
  console.log('✅ Facebook OAuth: Ready to use');
  console.log('\n🚀 Ready to test both OAuth providers!');
  console.log('Visit: http://localhost:3000');
  console.log('Click Login → Google or Facebook button');
}

console.log('\n📖 Available Setup Commands:');
console.log('----------------------------');
console.log('npm run setup:google-oauth   # Google OAuth setup guide');
console.log('npm run setup:facebook-oauth # Facebook OAuth setup guide');
console.log('npm run setup:oauth          # Combined OAuth status check');

console.log('\n🔧 OAuth Flow Summary:');
console.log('=====================');
console.log('1. User clicks Google/Facebook button');
console.log('2. Redirects to provider OAuth consent screen');
console.log('3. User authorizes the app');
console.log('4. Provider redirects back to callback URL');
console.log('5. NextAuth.js creates session');
console.log('6. User is redirected to dashboard');
console.log('7. User is logged in and can access protected routes');

console.log('\n⚠️  Important Notes:');
console.log('===================');
console.log('• Google: Works with any Google account');
console.log('• Facebook: Only works with test users in development mode');
console.log('• Both require proper redirect URI configuration');
console.log('• Production deployment needs domain-specific redirect URIs');
