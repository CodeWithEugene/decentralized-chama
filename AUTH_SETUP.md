# Supabase Authentication Setup Guide

This guide will walk you through configuring all authentication methods for the Chama dApp.

## Overview

The application supports multiple authentication methods:
- **Email & Password** - Traditional email/password login
- **One-Time Password (OTP)** - Email-based OTP authentication
- **Google** - OAuth2 social login
- **Ethereum Wallet** - MetaMask wallet authentication
- **Solana Wallet** - Phantom wallet authentication

## Prerequisites

- Supabase project created and configured
- Project connected to v0 (already done ✓)
- Environment variables set up (already done ✓)

## Step 1: Configure Email & Password Authentication

This is enabled by default in Supabase. No additional setup needed.

### Testing

1. Go to `/auth/sign-up` and create an account with email/password
2. Verify the confirmation email in Supabase Auth dashboard
3. Login at `/auth` with your credentials

## Step 2: Configure Email OTP

Email OTP is enabled by default in Supabase.

### Configuration (Optional - in Supabase Dashboard)

1. Go to **Authentication → Providers**
2. Look for "Email" provider
3. Ensure OTP is enabled

### Testing

1. Go to `/auth` 
2. Click the "OTP" tab
3. Enter your email and click "Send OTP"
4. Check your email for the verification code
5. Enter the code to login

## Step 3: Configure Google OAuth

### In Supabase Dashboard

1. Go to **Authentication → Providers**
2. Find "Google" provider
3. Click "Enabled" toggle
4. You should see a "Client ID" and "Client Secret" fields
5. If empty, you need to create OAuth credentials

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Select "Web application"
6. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
7. Copy Client ID and Client Secret
8. Paste them into Supabase Google provider settings
9. Save

### Testing

1. Go to `/auth`
2. Click the "Social" tab
3. Click "Sign in with Google"
4. Follow Google login flow

## Step 4: Configure Ethereum (MetaMask)

Ethereum authentication is custom-implemented using message signing.

### Prerequisites

- User has MetaMask installed: https://metamask.io

### How It Works

1. User clicks "Connect Ethereum Wallet"
2. MetaMask prompts to connect account
3. App generates a message to sign
4. User signs message with MetaMask
5. Signature is used as password for Supabase auth
6. Account is created as: `eth_0x{address}@chama.local`
7. User is logged in

### Testing

1. Install [MetaMask Browser Extension](https://metamask.io)
2. Create a test wallet in MetaMask
3. Go to `/auth`
4. Click the "Social" tab
5. Click "Connect Ethereum Wallet"
6. Approve connection in MetaMask
7. Sign message in MetaMask
8. You should be redirected to dashboard

### Supported Networks

The app supports:
- Ethereum Mainnet
- Ethereum Sepolia (Testnet)
- Any EVM-compatible chain

To test with testnet:
1. Switch MetaMask to Sepolia testnet
2. Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com)
3. Follow the same login steps

## Step 5: Configure Solana (Phantom)

Solana authentication is custom-implemented using message signing.

### Prerequisites

- User has Phantom wallet installed: https://phantom.app

### How It Works

1. User clicks "Connect Solana Wallet"
2. Phantom prompts to connect account
3. App generates a message to sign
4. User signs message with Phantom
5. Signature is used as password for Supabase auth
6. Account is created as: `sol_{address}@chama.local`
7. User is logged in

### Testing

1. Install [Phantom Browser Extension](https://phantom.app)
2. Create a test wallet in Phantom
3. Go to `/auth`
4. Click the "Social" tab
5. Click "Connect Solana Wallet"
6. Approve connection in Phantom
7. Sign message in Phantom
8. You should be redirected to dashboard

### Supported Networks

The app supports:
- Solana Mainnet
- Solana Devnet
- Solana Testnet

To test with devnet:
1. Switch Phantom to Devnet
2. Get devnet SOL from [Solana Faucet](https://faucet.solana.com)
3. Follow the same login steps

## File Structure

```
/app
  /auth
    page.tsx                 # Multi-tab auth page
    /callback
      route.ts              # OAuth callback handler
    /error
      page.tsx              # Error page
    /sign-up
      page.tsx              # Sign up page
  /dashboard
    layout.tsx              # Protected layout with auth check
    page.tsx                # Dashboard (requires auth)

/lib
  /supabase
    client.ts               # Browser client
    server.ts               # Server client
    proxy.ts                # Session proxy
    
/middleware.ts              # Auth middleware

/AUTH_SETUP.md             # This file
```

## Environment Variables

Your project already has these set:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

These are used by the Supabase clients to connect to your project.

## Security Notes

### Password Security

- Minimum 6 characters required
- Passwords are hashed with bcrypt before storage
- Never logged or exposed

### Wallet Authentication

- Message signing happens in the wallet (private key never leaves user's device)
- Signatures are stored as passwords (unique per wallet)
- If wallet is compromised, user can migrate to a new wallet with a new account

### Session Management

- Sessions are stored in secure HTTP-only cookies
- Cookies are automatically refreshed via middleware
- Session expires after 7 days (configurable in Supabase)

### OAuth

- OAuth tokens are never stored on client
- All token exchange happens server-side
- User data is fetched securely from OAuth provider

## Troubleshooting

### "Provider not configured" error

**Solution:** The OAuth provider isn't enabled in Supabase. Follow the provider-specific setup steps above.

### MetaMask connection fails

**Issues:**
- MetaMask not installed → Install from metamask.io
- Network mismatch → Switch to Ethereum network in MetaMask
- Wrong site → Ensure you're on the correct domain

**Solution:** Clear browser cache and try again

### Phantom connection fails

**Issues:**
- Phantom not installed → Install from phantom.app
- Wrong network → Check Phantom network selection
- Browser restrictions → Disable extensions blocking wallets

**Solution:** Switch Phantom to Mainnet and try again

### OAuth callback loop

**Issue:** Getting redirected back to auth repeatedly

**Solutions:**
1. Clear cookies and browser cache
2. Check redirect URI in OAuth provider settings
3. Ensure Supabase URL is correct in env variables
4. Check browser console for specific error

### Email confirmation not received

**Issue:** OTP or confirmation email not arriving

**Solutions:**
1. Check spam folder
2. Verify email address is spelled correctly
3. Wait a few seconds (email can be slow)
4. Check Supabase logs for delivery errors

## Environment Setup for Development

### Local Development

For local testing, Supabase provides test accounts:

1. Go to Supabase Dashboard → Authentication → Test Auth
2. Copy test credentials
3. Use them to test login flows without email confirmation

### Staging/Testing

For staging environment:

1. Create a separate Supabase project
2. Update environment variables
3. Run full test suite with all providers

## Next Steps

1. **Verify all authentication methods work:**
   - Create test accounts with each method
   - Login and logout successfully
   - Check Supabase dashboard to see user accounts

2. **Configure user profiles** (optional)
   - Create a `profiles` table with user metadata
   - Auto-create profiles on signup using database triggers
   - See SMART_CONTRACT_SETUP.md for example

3. **Add protected API routes** (optional)
   - Create API routes that require authentication
   - Use server-side Supabase client to verify JWT
   - Return user-specific data

4. **Implement email templates** (optional)
   - Customize confirmation emails in Supabase dashboard
   - Add branding and instructions
   - Set custom redirect URLs

## API Reference

### Client-side (`lib/supabase/client.ts`)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Email/Password
await supabase.auth.signInWithPassword({ email, password })
await supabase.auth.signUp({ email, password, options })

// OTP
await supabase.auth.signInWithOtp({ email, options })
await supabase.auth.verifyOtp({ email, token, type: 'email' })

// OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github', 'discord', etc.
  options: { redirectTo: window.location.origin + '/auth/callback' }
})

// Logout
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Server-side (`lib/supabase/server.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

## Support

For issues with:
- **Supabase configuration:** Visit supabase.com/docs/guides/auth
- **OAuth providers:** Check provider-specific documentation
- **Wallet integrations:** Visit MetaMask/Phantom developer docs
- **dApp issues:** Open a support ticket or check GitHub issues

## Checklist

- [ ] Google OAuth configured in Supabase
- [ ] Email/Password authentication tested
- [ ] OTP authentication tested
- [ ] Google login tested
- [ ] MetaMask wallet login tested
- [ ] Phantom wallet login tested
- [ ] Users can logout
- [ ] Protected routes prevent unauthorized access
- [ ] Sessions persist across page refreshes
- [ ] Sessions expire appropriately

Once all are checked, your authentication system is fully configured!
