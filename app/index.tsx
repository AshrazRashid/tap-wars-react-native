import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { height, width } = Dimensions.get("window");
const increment = 20;

export default function TapWarsGame() {
  const [winner, setWinner] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiCannon>(null);

  // Only use Animated.Value for heights
  const playerOneHeight = useRef(new Animated.Value(height / 2)).current;
  const playerTwoHeight = useRef(new Animated.Value(height / 2)).current;

  const animateHeights = (newP1: number, newP2: number) => {
    Animated.parallel([
      Animated.timing(playerOneHeight, {
        toValue: newP1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(playerTwoHeight, {
        toValue: newP2,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleTap = (player: "one" | "two") => {
    if (winner) return;

    playerOneHeight.stopAnimation((p1) => {
      playerTwoHeight.stopAnimation((p2) => {
        if (player === "one") {
          const newP1 = p1 + increment;
          const newP2 = p2 - increment;
          if (newP1 >= height) {
            animateHeights(height, 0);
            setWinner("PLAYER ONE");
            confettiRef.current?.start();
          } else {
            animateHeights(newP1, newP2);
          }
        } else {
          const newP2 = p2 + increment;
          const newP1 = p1 - increment;
          if (newP2 >= height) {
            animateHeights(0, height);
            setWinner("PLAYER TWO");
            confettiRef.current?.start();
          } else {
            animateHeights(newP1, newP2);
          }
        }
      });
    });
  };

  const resetGame = () => {
    animateHeights(height / 2, height / 2);
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.playerOne,
          {
            height: playerOneHeight,
            backgroundColor: "rgba(25, 118, 210, 0.8)",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.playerTouchable}
          onPress={() => handleTap("one")}
          activeOpacity={0.8}
          disabled={!!winner}
        >
          <Text style={[styles.text, { transform: [{ rotate: "180deg" }] }]}>
            PLAYER ONE
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.divider} />
      <Animated.View
        style={[
          styles.playerTwo,
          {
            height: playerTwoHeight,
            backgroundColor: "rgba(255, 97, 166, 0.8)",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.playerTouchable}
          onPress={() => handleTap("two")}
          activeOpacity={0.8}
          disabled={!!winner}
        >
          <Text style={styles.text}>PLAYER TWO</Text>
        </TouchableOpacity>
      </Animated.View>
      {winner && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>{winner} WINS 🎉</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: width / 2, y: height / 2 }}
        autoStart={false}
        fadeOut
        fallSpeed={2000}
        colors={["#FFD600", "#FF61A6", "#3DA9FC", "#00D084", "#FF9100"]}
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
  divider: {
    height: 2,
    backgroundColor: "#222",
    width: "100%",
    zIndex: 2,
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
