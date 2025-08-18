import { useRef, useState } from "react";
import {
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

// Custom square component for confetti

export default function TapWarsGame() {
  const [playerOneHeight, setPlayerOneHeight] = useState(height / 2);
  const [playerTwoHeight, setPlayerTwoHeight] = useState(height / 2);
  const [winner, setWinner] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiCannon>(null);

  const increment = 20; // pixels moved per tap

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
      <TouchableOpacity
        style={[styles.playerOne, { height: playerOneHeight }]}
        onPress={() => handleTap("one")}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, { transform: [{ rotate: "180deg" }] }]}>
          PLAYER ONE
        </Text>
      </TouchableOpacity>

      {/* Player Two Area */}
      <TouchableOpacity
        style={[styles.playerTwo, { height: playerTwoHeight }]}
        onPress={() => handleTap("two")}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>PLAYER TWO</Text>
      </TouchableOpacity>

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
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  playerTwo: {
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
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
