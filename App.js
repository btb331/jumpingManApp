import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

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
		startAnimation()
	}

	 startAnimation(){
	 	this.moveAnimation = new Animated.ValueXY({x:400, y:300})
	    Animated.timing(this.moveAnimation, {
	      toValue: {x: -10, y: 300},
	      duration: 5000,
	      easing: Easing.linear
	    }).start(this.startAnimation())
	}


	render() {
	    return (
	      <View style={styles.container}>
	        <Animated.View style={[styles.rectangle, this.moveAnimation.getLayout()]}>    
	        </Animated.View>
	      </View>
	    );
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
rectangle: {
    width: 10,
    height: 10,
    backgroundColor: 'red'
},
  button: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
  }
});
