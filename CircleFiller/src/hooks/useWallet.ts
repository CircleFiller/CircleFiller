// useWallet.ts — stub until wallet packages are re-added
export function useWallet() {
  return {
    publicKey: null,
    connected: false,
    connect: () => console.log('[native] wallet not configured'),
    disconnect: () => console.log('[native] wallet not configured'),
  }
}
