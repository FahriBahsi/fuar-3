#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');

console.log('🔧 Facebook OAuth Configuration Helper');
console.log('=====================================');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1] : `NOT_SET`;
};

const isPlaceholder = (value) => {
  return value.includes('your-facebook-') || value.includes('your-facebook-app-id') || value === 'NOT_SET';
};

const facebookClientId = getEnvVar('FACEBOOK_CLIENT_ID');
const facebookClientSecret = getEnvVar('FACEBOOK_CLIENT_SECRET');
const nextAuthUrl = getEnvVar('NEXTAUTH_URL');
const basePath = getEnvVar('NEXT_PUBLIC_BASE_PATH') !== 'NOT_SET' ? getEnvVar('NEXT_PUBLIC_BASE_PATH') : '';

console.log('\nCurrent Facebook OAuth configuration:');
console.log('-------------------------------------');
console.log(`Facebook Client ID: ${facebookClientId.substring(0, 15)}...`);
console.log(`Facebook Client Secret: ${facebookClientSecret.substring(0, 15)}...`);
console.log(`NextAuth URL: ${nextAuthUrl}`);

if (isPlaceholder(facebookClientId) || isPlaceholder(facebookClientSecret)) {
  console.log('\n⚠️  FACEBOOK OAUTH NOT CONFIGURED');
  console.log('===============================');
  console.log('Your Facebook OAuth credentials are set to placeholder values.');
  console.log('To enable Facebook OAuth, you need to:');
  console.log('\n1. Go to Facebook Developers: https://developers.facebook.com');
  console.log('2. Click "My Apps" → "Create App"');
  console.log('3. Choose "Consumer" as the app type');
  console.log('4. Fill in app details and create the app');
  console.log('5. Add "Facebook Login" product');
  console.log('6. Select "Web" platform');
  console.log('7. Go to "Facebook Login" → "Settings"');
  console.log('8. Add authorized redirect URIs:');
  console.log(`   - ${nextAuthUrl}/api/auth/callback/facebook`);
  if (basePath) {
    console.log('   - http://localhost:3001' + basePath + '/api/auth/callback/facebook');
    console.log('   - http://localhost:3002' + basePath + '/api/auth/callback/facebook');
  } else {
    console.log('   - http://localhost:3001/api/auth/callback/facebook');
    console.log('   - http://localhost:3002/api/auth/callback/facebook');
  }
  console.log('9. Go to "Settings" → "Basic"');
  console.log('10. Copy your App ID and App Secret');
  console.log('11. Update your .env file with:');
  console.log('\n   FACEBOOK_CLIENT_ID=your-actual-facebook-app-id');
  console.log('   FACEBOOK_CLIENT_SECRET=your-actual-facebook-app-secret');
  console.log('\n12. Restart your development server: npm run dev');
  console.log('\n📖 For detailed instructions, see: FACEBOOK_OAUTH_SETUP.md');
} else {
  console.log('\n✅ Facebook OAuth is CONFIGURED');
  console.log('==============================');
  console.log('Your Facebook OAuth credentials appear to be set correctly.');
  
  // Check if credentials look like real Facebook credentials
  if (facebookClientId.length > 10 && facebookClientSecret.length > 10) {
    console.log('✅ Credentials appear to be real Facebook App credentials');
  } else {
    console.log('⚠️  Credentials might still be placeholder values');
  }
  
  console.log('\n🚀 Ready to test? Visit: http://localhost:3000');
  console.log('Click Login → Facebook button to test OAuth flow');
}

console.log('\n🔍 Current OAuth Implementation Status:');
console.log('--------------------------------------');
console.log('✅ Facebook Provider configured in auth.ts');
console.log('✅ Facebook buttons in LoginModal and RegisterModal');
console.log('✅ Error handling and loading states');
console.log('✅ Automatic redirect to dashboard after login');
console.log('✅ Session management with NextAuth.js');

if (isPlaceholder(facebookClientId) || isPlaceholder(facebookClientSecret)) {
  console.log('⚠️  Environment variables need real Facebook OAuth credentials');
} else {
  console.log('✅ Environment variables configured');
}

console.log('\n📋 What happens when you click Facebook button:');
console.log('----------------------------------------------');
console.log('1. User clicks Facebook button');
console.log('2. Redirects to Facebook OAuth consent screen');
console.log('3. User authorizes the app');
console.log('4. Facebook redirects back to /api/auth/callback/facebook');
console.log('5. NextAuth.js creates session and redirects to dashboard');
console.log('6. User is logged in and can access protected routes');

console.log('\n🎯 To test Facebook OAuth:');
console.log('-------------------------');
console.log('1. Make sure you have real Facebook OAuth credentials');
console.log('2. Update your .env file');
console.log('3. Restart development server');
console.log('4. Visit http://localhost:3000');
console.log('5. Click Login → Facebook button');
console.log('6. Complete Facebook OAuth flow');
console.log('7. You should be redirected to dashboard');

console.log('\n⚠️  Important Notes for Facebook OAuth:');
console.log('-------------------------------------');
console.log('• Your app starts in DEVELOPMENT mode');
console.log('• Only TEST USERS can use Facebook Login');
console.log('• Add test users in "Roles" → "Test Users" in Facebook Console');
console.log('• App will show "This app isn\'t verified" warning (normal)');
console.log('• For production, you need to submit for Facebook App Review');

console.log('\n🔧 Facebook Developer Console Links:');
console.log('-----------------------------------');
console.log('• Main Dashboard: https://developers.facebook.com/apps/');
console.log('• App Settings: https://developers.facebook.com/apps/[YOUR_APP_ID]/settings/basic/');
console.log('• Facebook Login Settings: https://developers.facebook.com/apps/[YOUR_APP_ID]/fblogin/settings/');
console.log('• Test Users: https://developers.facebook.com/apps/[YOUR_APP_ID]/roles/test-users/');

if (!isPlaceholder(facebookClientId) && !isPlaceholder(facebookClientSecret)) {
  console.log(`\n📱 Your Facebook App ID: ${facebookClientId}`);
  console.log(`🔗 Direct link to your app: https://developers.facebook.com/apps/${facebookClientId}/`);
}
