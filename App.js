import React, { Component } from 'react';
import { Dimensions, Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  
  render() {
    var block = [] 
    var numBlocks = 8
    for(var i =1; i<numBlocks; i++){
      var pos= i/(numBlocks-1)
      block.push(<Block startPos={pos} numBlocks={numBlocks}/>)
    }
    return (
      <TouchableWithoutFeedback onPress={this.tap}>
      <View style={styles.container2}>
      <View>
        {block}
      </View>
      <Ball/>
      </View>
      </TouchableWithoutFeedback>
    );
  }

  tap(){
    Alert.alert("helo")
  }
}

class Ball extends Component{
  render(){
    const marginTop = 100
    return(
    <View    style={{position: 'absolute',
    width:50,
    height:50,
    borderRadius: 100/2,
    backgroundColor: 'red',
    top:marginTop,
    left:15}}>
    </View>)
  }
}


class Block extends Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  this.state = {col:"red"}
  this.startPos = parseFloat(this.props.startPos)
  this.width = Dimensions.get('window').width/(this.props.numBlocks-2.75)
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
      duration: 4000*timeMulti,
      easing: Easing.linear
    }
  ).start(() => this.animate(0))
}

chooseCol(){
  var col = "red"
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
    outputRange: [Dimensions.get('window').width, -this.width]
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          marginLeft,
          height: 500,
          width: this.width,
          top: 300,
          backgroundColor: this.state.col,
          padding: 0,
          margin: 0}}>
      </Animated.View>
    </View>
)}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ecf0f1',
  },
  container2:{
    position: 'absolute',
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  }
});