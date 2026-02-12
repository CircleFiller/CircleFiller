import React from 'react'
import { View, Pressable, Text, useWindowDimensions, StyleSheet } from 'react-native'
import { COLORS } from '../theme/colors'
import { Board as BoardType, ROWS, COLS } from '../game/types'
import { Cell } from './Cell'

const FRAME_PAD = 10

interface BoardProps {
  board: BoardType
  winningCells: [number, number][]
  onColumnPress: (col: number) => void
  disabled?: boolean
}

export function Board({ board, winningCells, onColumnPress, disabled = false }: BoardProps) {
  const { width: screenWidth } = useWindowDimensions()
  const boardWidth = Math.min(screenWidth - 32, 400)
  const cellSize = Math.floor((boardWidth - FRAME_PAD * 2) / COLS)
  const gridWidth = cellSize * COLS
  const totalWidth = gridWidth + FRAME_PAD * 2

  const isWinning = (row: number, col: number) =>
    winningCells.some(([r, c]) => r === row && c === col)

  return (
    <View style={styles.wrapper}>
      {/* Column drop indicators */}
      <View style={[styles.dropRow, { width: gridWidth, marginLeft: FRAME_PAD }]}>
        {Array.from({ length: COLS }).map((_, col) => (
          <Pressable
            key={col}
            onPress={() => !disabled && onColumnPress(col)}
            style={({ pressed }) => [
              styles.dropZone,
              { width: cellSize },
              pressed && !disabled && styles.dropZoneActive,
            ]}
          >
            <Text style={styles.dropArrow}>▾</Text>
          </Pressable>
        ))}
      </View>

      {/* Main board body */}
      <View style={[styles.boardBody, { width: totalWidth, padding: FRAME_PAD }]}>
        {board.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((cell, colIdx) => (
              <Pressable
                key={colIdx}
                onPress={() => !disabled && onColumnPress(colIdx)}
                style={({ pressed }) => [
                  pressed && !disabled && styles.cellPressed,
                ]}
              >
                <Cell
                  value={cell}
                  size={cellSize}
                  isWinning={isWinning(rowIdx, colIdx)}
                />
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      {/* Tray / base — where chips collect */}
      <View style={[styles.tray, { width: totalWidth + 12 }]}>
        <View style={styles.trayInner} />
      </View>

      {/* Feet */}
      <View style={[styles.feetRow, { width: totalWidth + 12 }]}>
        <View style={styles.foot}>
          <View style={styles.footBase} />
        </View>
        <View style={styles.foot}>
          <View style={styles.footBase} />
        </View>
      </View>
    </View>
  )
}

const BOARD_COLOR = '#1e1e3a'
const BOARD_EDGE = '#2a2a50'
const BOARD_HIGHLIGHT = '#33335a'

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },

  // ── Drop indicators ──
  dropRow: {
    flexDirection: 'row',
    height: 20,
    marginBottom: 2,
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneActive: {
    opacity: 1,
  },
  dropArrow: {
    color: COLORS.accent,
    fontSize: 14,
    opacity: 0.25,
  },

  // ── Board body ──
  boardBody: {
    backgroundColor: BOARD_COLOR,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cellPressed: {
    opacity: 0.7,
  },

  // ── Tray (bottom catch area) ──
  tray: {
    height: 10,
    backgroundColor: BOARD_EDGE,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trayInner: {
    width: '80%',
    height: 1,
    backgroundColor: BOARD_HIGHLIGHT,
    opacity: 0.3,
    borderRadius: 1,
  },

  // ── Feet ──
  feetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 0,
  },
  foot: {
    alignItems: 'center',
  },
  footBase: {
    width: 40,
    height: 8,
    backgroundColor: BOARD_EDGE,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopWidth: 1,
    borderTopColor: BOARD_HIGHLIGHT,
  },
})
