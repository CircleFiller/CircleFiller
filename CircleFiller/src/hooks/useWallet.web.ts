// useWallet.web.ts — web stub: no MWA on web, return mock for visual testing

export function useWallet() {
  return {
    account: null,
    connect: () => console.log('[web] wallet connect stubbed'),
    disconnect: () => console.log('[web] wallet disconnect stubbed'),
  }
}
