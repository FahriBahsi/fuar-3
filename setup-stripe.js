#!/usr/bin/env node

/**
 * Stripe Setup Helper Script
 * This script helps you configure Stripe keys for the Direo application
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Stripe Configuration Helper');
console.log('===============================\n');

const envPath = path.join(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found! Please create one first.');
  process.exit(1);
}

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('Current Stripe configuration:');
console.log('-----------------------------');

// Extract current Stripe keys
const publishableKeyMatch = envContent.match(/NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=(.+)/);
const secretKeyMatch = envContent.match(/STRIPE_SECRET_KEY=(.+)/);
const webhookSecretMatch = envContent.match(/STRIPE_WEBHOOK_SECRET=(.+)/);

const publishableKey = publishableKeyMatch ? publishableKeyMatch[1] : 'Not set';
const secretKey = secretKeyMatch ? secretKeyMatch[1] : 'Not set';
const webhookSecret = webhookSecretMatch ? webhookSecretMatch[1] : 'Not set';

console.log(`Publishable Key: ${publishableKey.substring(0, 20)}...`);
console.log(`Secret Key: ${secretKey.substring(0, 20)}...`);
console.log(`Webhook Secret: ${webhookSecret.substring(0, 20)}...\n`);

// Check if keys are placeholder values
const isPlaceholder = (key) => {
  return key.includes('your-') || 
         key.includes('_test_key_') || 
         key.includes('_test_webhook_') ||
         key.includes('replace_with_real');
};

const hasPlaceholders = isPlaceholder(publishableKey) || 
                       isPlaceholder(secretKey) || 
                       isPlaceholder(webhookSecret);

if (hasPlaceholders) {
  console.log('⚠️  STRIPE NOT CONFIGURED');
  console.log('========================');
  console.log('Your Stripe keys are set to placeholder values.');
  console.log('To enable Stripe payments, you need to:');
  console.log('');
  console.log('1. Sign up for a Stripe account at https://stripe.com');
  console.log('2. Go to Dashboard → Developers → API Keys');
  console.log('3. Copy your test keys (starts with pk_test_ and sk_test_)');
  console.log('4. Update the following lines in your .env file:');
  console.log('');
  console.log('   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here');
  console.log('   STRIPE_SECRET_KEY=sk_test_your_actual_key_here');
  console.log('   STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here');
  console.log('');
  console.log('5. Restart your development server: npm run dev');
  console.log('');
  console.log('📖 For detailed instructions, see: STRIPE_SETUP_GUIDE.md');
  console.log('');
  console.log('✅ Current checkout system works with:');
  console.log('   • Bank Transfer payments');
  console.log('   • PayPal payments (when configured)');
  console.log('   • Demo payment processing');
} else {
  console.log('✅ STRIPE CONFIGURED');
  console.log('===================');
  console.log('Your Stripe keys appear to be configured correctly!');
  console.log('Credit card payments should work properly.');
}

console.log('\n🚀 Ready to test? Visit: http://localhost:3000/checkout');
