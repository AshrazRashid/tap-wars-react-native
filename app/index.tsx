import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { height, width } = Dimensions.get("window");

// Define your color palette
const confettiColors = ["#FFD600", "#FF61A6", "#3DA9FC", "#00D084", "#FF9100"];

export default function TapWarsGame() {
  const [playerOneHeight, setPlayerOneHeight] = useState(height / 2);
  const [playerTwoHeight, setPlayerTwoHeight] = useState(height / 2);
  const [winner, setWinner] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiCannon>(null);

  // Animated values for smooth height transitions
  const animatedPlayerOneHeight = useRef(
    new Animated.Value(height / 2)
  ).current;
  const animatedPlayerTwoHeight = useRef(
    new Animated.Value(height / 2)
  ).current;

  const increment = 20; // pixels moved per tap
  const animationDuration = 150; // milliseconds for smooth animation - reduced from 300ms

  // Update animated values when state changes
  useEffect(() => {
    Animated.spring(animatedPlayerOneHeight, {
      toValue: playerOneHeight,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [playerOneHeight, animatedPlayerOneHeight]);

  useEffect(() => {
    Animated.spring(animatedPlayerTwoHeight, {
      toValue: playerTwoHeight,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [playerTwoHeight, animatedPlayerTwoHeight]);

  const handleTap = (player: "one" | "two") => {
    if (winner) return;

    if (player === "one") {
      const newP1 = playerOneHeight + increment;
      const newP2 = playerTwoHeight - increment;
      if (newP1 >= height) {
        setPlayerOneHeight(height);
        setPlayerTwoHeight(0);
        setWinner("PLAYER ONE");
        confettiRef.current?.start();
      } else {
        setPlayerOneHeight(newP1);
        setPlayerTwoHeight(newP2);
      }
    } else {
      const newP2 = playerTwoHeight + increment;
      const newP1 = playerOneHeight - increment;
      if (newP2 >= height) {
        setPlayerTwoHeight(height);
        setPlayerOneHeight(0);
        setWinner("PLAYER TWO");
        confettiRef.current?.start();
      } else {
        setPlayerTwoHeight(newP2);
        setPlayerOneHeight(newP1);
      }
    }
  };

  const resetGame = () => {
    setPlayerOneHeight(height / 2);
    setPlayerTwoHeight(height / 2);
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      {/* Player One Area */}
      <Animated.View
        style={[
          styles.playerOne,
          {
            height: animatedPlayerOneHeight,
            backgroundColor: "#FF6B6B",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.playerTouchable}
          onPress={() => handleTap("one")}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, { transform: [{ rotate: "180deg" }] }]}>
            PLAYER ONE
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Player Two Area */}
      <Animated.View
        style={[
          styles.playerTwo,
          {
            height: animatedPlayerTwoHeight,
            backgroundColor: "#4ECDC4",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.playerTouchable}
          onPress={() => handleTap("two")}
          activeOpacity={0.8}
        >
          <Text style={styles.text}>PLAYER TWO</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Winner Banner */}
      {winner && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>{winner} WINS 🎉</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confetti */}
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: width / 2, y: height / 2 }}
        autoStart={false}
        fadeOut
        fallSpeed={2000}
        colors={confettiColors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1a1a1a",
  },
  playerOne: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  playerTwo: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  playerTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  winnerBanner: {
    position: "absolute",
    top: "45%",
    left: "20%",
    right: "20%",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  winnerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: "#FFD93D",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
