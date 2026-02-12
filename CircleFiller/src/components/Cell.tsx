import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { COLORS } from '../theme/colors'
import { CellValue } from '../game/types'

const SKR_LOGO = require('../../assets/images/skr-logo.png')

interface CellProps {
  value: CellValue
  size: number
  isWinning?: boolean
}

export function Cell({ value, size, isWinning = false }: CellProps) {
  const holeSize = size * 0.78
  const logoSize = holeSize * 0.48

  const hasChip = value !== 0
  const chipColor = value === 1 ? COLORS.accent : value === 2 ? COLORS.p1 : 'transparent'

  return (
    <View style={[styles.cell, { width: size, height: size }]}>
      {/* Hole punched into the board */}
      <View style={[styles.hole, {
        width: holeSize,
        height: holeSize,
        borderRadius: holeSize / 2,
      }]}>
        {hasChip && (
          <View style={[styles.chip, {
            width: holeSize - 2,
            height: holeSize - 2,
            borderRadius: (holeSize - 2) / 2,
            backgroundColor: chipColor,
          }]}>
            {/* Inner ring for depth */}
            <View style={[styles.chipRing, {
              width: holeSize - 10,
              height: holeSize - 10,
              borderRadius: (holeSize - 10) / 2,
              borderColor: isWinning ? COLORS.win : 'rgba(255,255,255,0.15)',
              borderWidth: isWinning ? 2 : 1,
            }]}>
              {/* Dark backing so white logo reads on light chips */}
              <View style={[styles.logoBacking, {
                width: logoSize + 2,
                height: logoSize + 2,
                borderRadius: (logoSize + 2) / 2,
              }]} />
              <Image
                source={SKR_LOGO}
                style={[styles.logo, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}
                resizeMode="contain"
              />
            </View>

            {/* Winning glow */}
            {isWinning && (
              <View style={[styles.winGlow, {
                width: holeSize - 2,
                height: holeSize - 2,
                borderRadius: (holeSize - 2) / 2,
                shadowColor: COLORS.win,
              }]} />
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hole: {
    backgroundColor: '#080812',
    alignItems: 'center',
    justifyContent: 'center',
    // Inset shadow effect — darker ring around hole edge
    borderWidth: 1.5,
    borderColor: '#06060e',
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  winGlow: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 14,
    shadowOpacity: 0.9,
    elevation: 10,
  },
  logoBacking: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  logo: {
    opacity: 0.5,
  },
})
