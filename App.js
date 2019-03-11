import React, { Component } from 'react';
import { Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  
  render() {
    var block = [] 
    for(var i =0; i<21; i++){
      var pos= i/20
      block.push(<Block startPos={pos}/>)
    }
    return (
      <View>
        {block}
      </View>
    );
  }
}

class Block extends Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  this.state = {col:"red"}
  this.startPos = parseFloat(this.props.startPos)
  }

  componentDidMount () {
  this.animate(this.startPos)
}

animate (pos) {
  this.setState({col: this.chooseCol()})
  this.animatedValue.setValue(pos)
  var timeMulti = (1-pos)
  if(pos==0 || pos == 1){
    timeMulti = 1
  }
  Animated.timing(
    this.animatedValue,
    {
      toValue: 1,
      duration: 3000*timeMulti,
      easing: Easing.linear
    }
  ).start(() => this.animate(0))
}

chooseCol(){
  var col = "white"
  var num = Math.random()
  // Alert.alert(num)
  if(num<0.7){
    col="black"
  }

  return col
} 

render () { 
  const marginLeft = this.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [420, -19]
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          marginLeft,
          height: 500,
          width: 21,
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