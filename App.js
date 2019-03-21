import React, { Component } from 'react';
import { Dimensions, Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  
  constructor() {
    super();
    this.state = { animatedBall: new Animated.Value(0), blockAniValues:[new Animated.Value(0), new Animated.Value(0)] }
    this.tap = this.tap.bind(this)
    var numBlocks = 8
    this.blockWidth = Dimensions.get('window').width/(numBlocks-2.75)
    this.lastBlock = "0"
  }

  componentDidMount(){
    this.animateBlock(this.state.blockAniValues[0], 0, "1")
    this.animateBlock(this.state.blockAniValues[1], 0.5, "2")
  }

  componentWillUpdate () {

  }

  animateBlock(animateValue, startValue, blockNum){
    animateValue.setValue(startValue)
    var timeMulti = (1-startValue)
    if(startValue==0 || startValue == 1){
      timeMulti = 1
    }
    Animated.timing(
      animateValue,
      {
        toValue: 1,
        duration: 4000*timeMulti,
        easing: Easing.linear
      }
    ).start(() => {
      this.animateBlock(animateValue, 0)
      this.lastBlock = blockNum
    })
  }

  restartanimation(){

  }

  bounce () {
    this.state.animatedBall.setValue(0)
    var duration = 500
    Animated.sequence([
      Animated.timing(
      this.state.animatedBall,
      {
        toValue: 1,
        duration: duration,
        easing: Easing.linear
      }
    ), 
    Animated.timing(
      this.state.animatedBall,
      {
        toValue: 0,
        duration: duration,
        easing: Easing.linear
      })]).start()
  }

  tap(){
    this.bounce(0)
    Alert.alert(this.lastBlock)
  }

  render() {
    

    const top = this.state.animatedBall.interpolate({
      inputRange: [0, 1],
      outputRange: [250, 100]
    })

  const left = [this.state.blockAniValues[0].interpolate({
      inputRange: [0, 1],
      outputRange: [Dimensions.get('window').width, -this.blockWidth]
    }),
    this.state.blockAniValues[1].interpolate({
      inputRange: [0, 1],
      outputRange: [Dimensions.get('window').width, -this.blockWidth]
    })
  ]




    console.log(left)
    
    return (
      <TouchableWithoutFeedback onPress={this.tap}>
        <View style={styles.container2}>
        <View>
          <Block left={left[0]} width={this.blockWidth} pos={0}/>
          <Block left={left[1]} width={this.blockWidth} pos={1}/>
        </View>
        <Ball topMargin={top}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  
}

class Ball extends Component{
  render(){
    return(
    <View>
      <Animated.View 
        style={{position: 'absolute',
        width:50,
        height:50,
        borderRadius: 100/2,
        backgroundColor: 'red',
        top: this.props.topMargin,
        left:15}}>
      </Animated.View>
    </View>)
  }
}


class Block extends Component {
  constructor(props) {
    super(props)
    this.state = {col:"red"}
  }

// animate (pos) {
//   this.setState({col: this.chooseCol()})
//   this.animatedValue.setValue(pos)
//   var timeMulti = (1-pos)
//   if(pos==0 || pos == 1){
//     timeMulti = 1
//   }
//   Animated.timing(
//     this.animatedValue,
//     {
//       toValue: 1,
//       duration: 4000*timeMulti,
//       easing: Easing.linear
//     }
//   ).start(() => this.animate(0))
// }

// chooseCol(){
//   var col = "white"
//   var num = Math.random()
//   // Alert.alert(num)
//   if(num<0.7){
//     col="black"
//   }

//   return col
// } 

render () { 

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          height: 500,
          width: this.props.width,
          top: 300,
          backgroundColor: this.state.col,
          padding: 0,
          margin: 0,
          left: this.props.left}}>
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