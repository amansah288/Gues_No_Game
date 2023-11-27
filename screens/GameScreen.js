import { View, StyleSheet, Alert, FlatList, useWindowDimensions } from "react-native";
import Title from "../components/ui/Title";
import { useState, useEffect } from "react";
import NumberCointainer from "../components/game/NumberCointainer";
import PrimaryButton from "../components/ui/PrimaryButton";
import Card from "../components/ui/Card";
import InstructionText from "../components/ui/InstructionText";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import GuessLogItem from "../components/game/GuessLogItem";

function generateRandomBetween(min, max, exclude) {
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
}

let minBoundary = 1;
let maxBoundary = 100;

function GameScreen({ userNumber, onGameOver }) {
  const initialGuess = generateRandomBetween(1, 100, userNumber);
  const [CurrentGuess, setCurrentGuess] = useState(initialGuess);
  const [GuessRound,setGuessRound] = useState([initialGuess])
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    if (CurrentGuess === userNumber) {
      onGameOver(GuessRound.length);
    }
  }, [CurrentGuess, userNumber, onGameOver]);

  useEffect(() => {
    minBoundary=1;
    maxBoundary=100;
  },[]);

  function nextGuessHandler(direction) {
    //direction => 'lower' or 'greater'

    if (
      (direction === "lower" && CurrentGuess < userNumber) ||
      (direction === "greater" && CurrentGuess > userNumber)
    ) {
      Alert.alert("Don't Lie", "you know that this is wrong...", [
        { text: "sorry", style: "cancel" },
      ]);
      return;
    }
    if (direction === "lower") {
      maxBoundary = CurrentGuess;
      const newRndNumber = generateRandomBetween(
        minBoundary,
        maxBoundary,
        CurrentGuess
      );
    } else {
      minBoundary = CurrentGuess + 1;
    }
    //console.log(minBoundary, maxBoundary);
    const newRndNumber = generateRandomBetween(
      minBoundary,
      maxBoundary,
      CurrentGuess
    );
    setCurrentGuess(newRndNumber);
    setGuessRound(prevGuessRounds => [newRndNumber,...prevGuessRounds]);
  }

  const guessRoundsListLength = GuessRound.length;

  let content = (<>
    <NumberCointainer>{CurrentGuess}</NumberCointainer>
      <Card>
        <InstructionText style={styles.instructionText}>
          Higher or Lower
        </InstructionText>
        <View style={styles.buttonsContainers}>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
              <Ionicons name="md-remove" size={24} color="white" />
            </PrimaryButton>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
              <Ionicons name="md-add" size={24} color="white" />
            </PrimaryButton>
          </View>
        </View>
      </Card>
  </>);

  if(width > 500){
    content=(
      <>
      
      <View style={styles.buttonContainerWide}>
      <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
              <Ionicons name="md-remove" size={24} color="white" />
            </PrimaryButton>
          </View>
        <NumberCointainer>{CurrentGuess}</NumberCointainer>
        <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
              <Ionicons name="md-add" size={24} color="white" />
            </PrimaryButton>
          </View> 
      </View>
    
    </>
    );
  }

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      {content}
      <View style={styles.listContainer}>
        {/* {GuessRound.map(GuessRound => <Text key={GuessRound} >{GuessRound}</Text>)} */}
        <FlatList
          data={GuessRound}
          renderItem={(itemData) => (
          <GuessLogItem 
          roundNumber={guessRoundsListLength - itemData.index} 
          guess={itemData.item} 
          />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
}

export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    alignItems:'center',
  },
  instructionText: {
    marginBottom: 12,
  },
  buttonsContainers: {
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
  },
  listContainer:{
    flex:1,
    padding:16,
  },
  buttonContainerWide:{
    flexDirection: 'row',
    alignItems:'center',
  },
});
