import React, { Component } from 'react';
import { Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  render() {
    return (
        <Block />
    );
  }
}

class Block extends Component {
	constructor(props) {
		super(props)
		this.animatedValue = new Animated.Value(0)
  this.state = {col:"red"}
	}
	componentDidMount () {
  this.animate(0.5)
}

animate (pos) {
  this.setState({col: this.chooseCol()})
  this.animatedValue.setValue(pos)
  Animated.timing(
    this.animatedValue,
    {
      toValue: 1,
      duration: 2750,
      easing: Easing.linear
    }
  ).start(() => this.animate(0))
}

chooseCol(){
	var col = "red"
	var num = Math.random()
	// Alert.alert(num)
  if(num<0.75){
  	col = "green"
  }
  if(num<0.5){
  	col="black"
  }
  if(num<0.25){
  	col = "yellow"
  }

  return col
} 

render () { 
  const marginLeft = this.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [380, -19]
  })

	return (
    <View style={styles.container}>
      <Animated.View
        style={{
          marginLeft,
          height: 5,
          width: 20,
          top: 300,
          backgroundColor: this.state.col}}>
      </Animated.View>
    </View>
)}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  }
});
