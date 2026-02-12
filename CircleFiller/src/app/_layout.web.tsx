import '../global.css'

import { View, StyleSheet } from 'react-native'
import { Slot } from 'expo-router'

// Web layout: renders app inside a phone-sized frame (Seeker = ~412x915)
// No MobileWalletProvider — MWA is native-only
export default function Layout() {
  return (
    <View style={styles.desktop}>
      <View style={styles.deviceFrame}>
        <View style={styles.notch}>
          <View style={styles.notchPill} />
        </View>
        <View style={styles.screen}>
          <Slot />
        </View>
        <View style={styles.homeBar} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceFrame: {
    width: 412,
    height: 915,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#999',
    overflow: 'hidden',
    // @ts-ignore — web-only shadow
    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.08)',
  },
  notch: {
    height: 28,
    backgroundColor: '#060609',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  notchPill: {
    width: 80,
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
  },
  screen: {
    flex: 1,
  },
  homeBar: {
    height: 20,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
