import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Circle {
  x: number;
  y: number;
  radius: number;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function Game() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [currentCircle, setCurrentCircle] = useState<Circle | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const router = useRouter();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkCollision = (newCircle: Circle, existingCircles: Circle[]) => {
    // Edge collision
    if (
      newCircle.x - newCircle.radius < 0 ||
      newCircle.x + newCircle.radius > width ||
      newCircle.y - newCircle.radius < 100 || // Offset for header
      newCircle.y + newCircle.radius > height - 100 // Offset for footer
    ) {
      return true;
    }

    // Other circles collision
    for (const circle of existingCircles) {
      const dist = Math.sqrt(
        Math.pow(newCircle.x - circle.x, 2) + Math.pow(newCircle.y - circle.y, 2)
      );
      if (dist < newCircle.radius + circle.radius) {
        return true;
      }
    }
    return false;
  };

  const startGrowing = (x: number, y: number) => {
    if (isGameOver) return;

    const newCircle: Circle = {
      x,
      y,
      radius: 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    if (checkCollision(newCircle, circles)) {
      setIsGameOver(true);
      return;
    }

    setCurrentCircle(newCircle);

    timerRef.current = setInterval(() => {
      setCurrentCircle((prev) => {
        if (!prev) return null;
        const next = { ...prev, radius: prev.radius + 2 };
        if (checkCollision(next, circles)) {
          stopGrowing();
          setIsGameOver(true);
          return prev;
        }
        return next;
      });
    }, 16);
  };

  const stopGrowing = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (currentCircle) {
      setCircles((prev) => [...prev, currentCircle]);
      setScore((prev) => prev + Math.floor(currentCircle.radius));
      setCurrentCircle(null);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        startGrowing(locationX, locationY);
      },
      onPanResponderRelease: () => {
        stopGrowing();
      },
      onPanResponderTerminate: () => {
        stopGrowing();
      },
    })
  ).current;

  const resetGame = () => {
    setCircles([]);
    setCurrentCircle(null);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity onPress={resetGame}>
          <Text style={styles.resetButton}>Reset</Text>
        </TouchableOpacity>
      </View>

      {circles.map((circle, index) => (
        <View
          key={index}
          style={[
            styles.circle,
            {
              left: circle.x - circle.radius,
              top: circle.y - circle.radius,
              width: circle.radius * 2,
              height: circle.radius * 2,
              borderRadius: circle.radius,
              backgroundColor: circle.color,
            },
          ]}
        />
      ))}

      {currentCircle && (
        <View
          style={[
            styles.circle,
            {
              left: currentCircle.x - currentCircle.radius,
              top: currentCircle.y - currentCircle.radius,
              width: currentCircle.radius * 2,
              height: currentCircle.radius * 2,
              borderRadius: currentCircle.radius,
              backgroundColor: currentCircle.color,
              opacity: 0.7,
            },
          ]}
        />
      )}

      {isGameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={resetGame}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#333',
    zIndex: 10,
  },
  backButton: {
    color: '#fff',
    fontSize: 18,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetButton: {
    color: '#fff',
    fontSize: 18,
  },
  circle: {
    position: 'absolute',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    zIndex: 100,
  },
  gameOverText: {
    color: '#FF6B6B',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScore: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
