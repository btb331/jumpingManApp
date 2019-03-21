import React, { Component } from 'react';
import { Dimensions, Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  
  constructor() {
    super();
    this.state = { animatedBall: new Animated.Value(0), blockValues:[]}
    this.tap = this.tap.bind(this)
    this.numBlocks = 8
    this.blockWidth = Dimensions.get('window').width/(this.numBlocks-2.1)
    this.lastBlock = "0"
    var cols = [
      "red", "yellow", "green", "black", "white", "orange", "purple", "pink", "grey"
    ]
    for(var i = 0; i<this.numBlocks; i++){
      this.state.blockValues.push({aniValue:new Animated.Value(0), col:cols[i]})
    }
    this.jumping = false
  }

  componentDidMount(){
    for(var i = 0; i<this.numBlocks; i++){
      this.animateBlock(this.state.blockValues[i]['aniValue'], i/8, i)
    }
  }

  chooseCol(){
  var col = "white"
  var num = Math.random()
  // Alert.alert(num)
  if(num<0.65){
    col="black"
  }

  return col
} 

  animateBlock(animateValue, startValue, blockNum){
    var copyState = [...this.state.blockValues]
    copyState[blockNum]['col']= this.chooseCol()
    this.setState({blockValues:copyState})
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
      this.animateBlock(animateValue, 0, blockNum)
      this.lastBlock = this.myMod((blockNum - 2), 8)
      this.deathcheck()
    })
  }

  myMod(n, m) {
    return ((n % m) + m) % m;
  }

  bounce () {
    this.state.animatedBall.setValue(0)
    this.jumping=true
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
      })]).start(()=>{
        this.jumping=false
        this.deathcheck()
        })
  }

  deathcheck(){
    if(this.state.blockValues[this.lastBlock]['col']=="white" && !this.jumping){
      Alert.alert("You Dead")
    }
  }

  tap(){
    this.bounce(0)
  }

  render() {

   

    const top = this.state.animatedBall.interpolate({
      inputRange: [0, 1],
      outputRange: [250, 100]
    })

  var left = []

  for(i=0; i<this.numBlocks; i++){
    left.push(this.state.blockValues[i]['aniValue'].interpolate({
      inputRange: [0, 1],
      outputRange: [Dimensions.get('window').width, -this.blockWidth]
    }))
  }

  var blocks = []

  for(var i = 0; i<this.numBlocks; i++){
    blocks.push(<Block left={left[i]} width={this.blockWidth} col={this.state.blockValues[i]['col']}/>)
  }

   
    return (
      <TouchableWithoutFeedback onPress={this.tap}>
        <View style={styles.container2}>
        <View>
        {blocks}
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
          backgroundColor: this.props.col,
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