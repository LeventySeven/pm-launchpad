/**
 * Wallet & Admin Diagnostics Helper
 * 
 * Usage from browser console:
 *   import('/lib/debug/walletDiagnostics.ts').then(m => m.runDiagnostics())
 * 
 * Or add to window for easier access in development
 */

import { trpcClient } from '@/src/utils/trpcClient';

export interface DiagnosticsResult {
  timestamp: string;
  user: {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId?: string;
    email?: string;
    solanaWalletAddress?: string | null;
    solanaCluster?: string | null;
    solanaWalletConnectedAt?: string | null;
  };
  walletAdapter: {
    isConnected: boolean;
    publicKey?: string | null;
  };
  sync: {
    isSynced: boolean;
    hasMismatch: boolean;
    needsLink: boolean;
  };
  issues: string[];
  recommendations: string[];
}

export async function runDiagnostics(): Promise<DiagnosticsResult> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Get user from auth.me
  let authUser: {
    id: string;
    email: string;
    isAdmin: boolean;
    solanaWalletAddress: string | null;
    solanaCluster: string | null;
    solanaWalletConnectedAt: string | null;
  } | null = null;

  try {
    authUser = await trpcClient.auth.me.query();
  } catch (err) {
    issues.push('Failed to fetch user - not authenticated');
  }

  // Get wallet adapter state (if available in window)
  const solanaWallet = (window as unknown as { solana?: { isConnected?: boolean; publicKey?: { toBase58?: () => string } } }).solana;
  const adapterConnected = solanaWallet?.isConnected ?? false;
  const adapterPubkey = solanaWallet?.publicKey?.toBase58?.() ?? null;

  const result: DiagnosticsResult = {
    timestamp: new Date().toISOString(),
    user: {
      isAuthenticated: !!authUser,
      isAdmin: authUser?.isAdmin ?? false,
      userId: authUser?.id,
      email: authUser?.email,
      solanaWalletAddress: authUser?.solanaWalletAddress ?? null,
      solanaCluster: authUser?.solanaCluster ?? null,
      solanaWalletConnectedAt: authUser?.solanaWalletConnectedAt ?? null,
    },
    walletAdapter: {
      isConnected: adapterConnected,
      publicKey: adapterPubkey,
    },
    sync: {
      isSynced: false,
      hasMismatch: false,
      needsLink: false,
    },
    issues,
    recommendations,
  };

  // Analyze sync status
  const dbPubkey = authUser?.solanaWalletAddress;
  
  if (adapterConnected && adapterPubkey) {
    if (dbPubkey && dbPubkey === adapterPubkey) {
      result.sync.isSynced = true;
    } else if (dbPubkey && dbPubkey !== adapterPubkey) {
      result.sync.hasMismatch = true;
      issues.push('Wallet mismatch: connected wallet differs from DB');
      recommendations.push('Disconnect and reconnect the correct wallet, or clear DB wallet');
    } else if (!dbPubkey) {
      result.sync.needsLink = true;
      issues.push('Wallet connected but not saved to DB');
      recommendations.push('Check console for [wallet-sync] errors. Try refreshing the page.');
    }
  }

  // Check authentication
  if (!authUser) {
    issues.push('User not authenticated');
    recommendations.push('Log in first, then connect wallet');
  }

  // Check admin status
  if (authUser && !authUser.isAdmin) {
    issues.push('User is not an admin');
    recommendations.push('Run SQL: UPDATE users SET is_admin = true WHERE id = \'' + authUser.id + '\';');
  }

  // Check wallet for admin operations
  if (authUser?.isAdmin && !dbPubkey) {
    issues.push('Admin user has no wallet linked');
    recommendations.push('Connect a Solana wallet to enable on-chain operations');
  }

  // Print results
  console.log('\n========================================');
  console.log('🔍 WALLET & ADMIN DIAGNOSTICS');
  console.log('========================================\n');
  
  console.log('📋 USER STATUS:');
  console.log('  - Authenticated:', result.user.isAuthenticated);
  console.log('  - Admin:', result.user.isAdmin);
  console.log('  - User ID:', result.user.userId || 'N/A');
  console.log('  - Email:', result.user.email || 'N/A');
  console.log('  - DB Wallet:', result.user.solanaWalletAddress || 'Not linked');
  console.log('  - DB Cluster:', result.user.solanaCluster || 'N/A');
  
  console.log('\n💳 WALLET ADAPTER:');
  console.log('  - Connected:', result.walletAdapter.isConnected);
  console.log('  - Public Key:', result.walletAdapter.publicKey || 'N/A');
  
  console.log('\n🔄 SYNC STATUS:');
  console.log('  - Synced:', result.sync.isSynced ? '✅ Yes' : '❌ No');
  console.log('  - Mismatch:', result.sync.hasMismatch ? '⚠️ Yes' : '✅ No');
  console.log('  - Needs Link:', result.sync.needsLink ? '⚠️ Yes' : '✅ No');
  
  if (issues.length > 0) {
    console.log('\n❌ ISSUES FOUND:');
    issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    recommendations.forEach((rec, i) => console.log(`  ${i + 1}. ${rec}`));
  }
  
  if (issues.length === 0) {
    console.log('\n✅ All checks passed! Ready for admin testing.');
  }
  
  console.log('\n========================================\n');
  
  return result;
}

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { walletDiagnostics?: typeof runDiagnostics }).walletDiagnostics = runDiagnostics;
}

export default runDiagnostics;
