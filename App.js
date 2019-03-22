import React, { Component } from 'react';
import { Dimensions, Alert, Animated, TouchableWithoutFeedback, Text, View, StyleSheet, Easing} from 'react-native';

export default class App extends React.Component {
  
  	constructor() {
	  	super();

	    //set the number of block and width
	    this.numBlocks = 8
	    this.blockWidth = Dimensions.get('window').width/(this.numBlocks-2.1)

      this.state = { animatedBall: new Animated.Value(0), blockValues:[], score:-this.numBlocks+1, highScore:0}
	    this.tap = this.tap.bind(this)

	    //last block is the block on the left of the screen so know when ball goes over hole
	    this.lastBlock = "0"

	    //set up the animation values for each block
	    for(var i = 0; i<this.numBlocks; i++){
	      this.state.blockValues.push({aniValue:new Animated.Value(0), col:"red"})
	    }

	    this.jumping = false
	    this.alive = true

	    this.blankCount = 0
  	}

  	componentDidMount(){
  	//start animation once block mounts
	   for(var i = 0; i<this.numBlocks; i++){
	    	this.animateBlock(this.state.blockValues[i]['aniValue'], i/8, i, true)
	    }
  	}

	chooseCol(){
  	//function to choose the random colour
  		var col = "white"
	  	var num = Math.random()

	  	if(num<0.60|this.blankCount>3){
	    	col="black"
	    	this.blankCount = 0
	  	}else{
	  		this.blankCount++
	  	}
	  	return col
	} 

  	animateBlock(animateValue, startValue, blockNum, firstTime){
  		//this function animates the blocks, and choosing the colour, its callbacked at the end to make the animation recurseve

	  	//if its the first time make it all red., otherwise choose a colour
	  	if(!firstTime){
	    	var copyState = [...this.state.blockValues]
	    	copyState[blockNum]['col']= this.chooseCol()
	    	this.setState({blockValues:copyState})
        //increment the score
      	this.setState({score:this.state.score+1})
	    }
    	animateValue.setValue(startValue)

    	

      	//when first called need to adjust the duration 
    	var timeMulti = (1-startValue)
    	if(startValue==0 || startValue == 1){
      		timeMulti = 1
    	}

    	//animated the animatedValue
    	Animated.timing(
      	animateValue,
      	{toValue: 1,
	        duration: 4000*timeMulti,
	        easing: Easing.linear
      	}).start(() => {
      		//if alive continue the animation and check if player should die 
    		if(this.alive){
	      		this.animateBlock(animateValue, 0, blockNum, false)
	      		this.deathcheck()
      		}
      	//lastblock is the one 2 back from one going off the screen
      	this.lastBlock = this.myMod((blockNum - 2), 8)
    	})
  	}

  	//own mod function as native one can't handle negative values
  	myMod(n, m) {
    	return ((n % m) + m) % m;
  	}

  	bounce () {
  		//if its already jumping don't allow to jumpinh again
  		if(this.jumping){
  			return
  		}

	    this.state.animatedBall.setValue(0)
	    this.jumping=true

	    var duration = 450

	    //sequence for the ball to go up and then down.
	    Animated.sequence([
	     	Animated.timing(
	      	this.state.animatedBall,
	      	{toValue: 1,
	        	duration: duration,
	        	easing: Easing.linear
	      	}
	    ), 
	    Animated.timing(
	     	this.state.animatedBall,
	      	{toValue: 0,
	        	duration: duration,
	        	easing: Easing.linear
	      	})]
	    ).start(()=>{
	        this.jumping=false
	        this.deathcheck()
		})
  	}

  	deathcheck(){
  		//checks if block ball is white and if the ball is not jumping
    	if(this.state.blockValues[this.lastBlock]['col']=="white" && !this.jumping){
	      	this.alive = false

		    this.stopAnimation()

	      	Alert.alert("You Dead", "You scored " + this.state.score, [{text:'Try again', onPress: () => {this.startAnimation()}}] , { onDismiss: () => {this.startAnimation()} })

	      	if(this.state.score > this.state.highScore){
	      		this.setState({highScore:this.state.score})
	      	}
    	}
  	}

  	startAnimation(){
  		//called to restart animation after player dies
	  	this.setState({score:-this.numBlocks+1})
	  	this.state.blockValues=[]

	  	for(var i = 0; i<this.numBlocks; i++){
	      this.state.blockValues.push({aniValue:new Animated.Value(0), col:"red"})
	    }

	    for(var i = 0; i<this.numBlocks; i++){
	      this.animateBlock(this.state.blockValues[i]['aniValue'], i/8, i, true)
	    }
	    this.alive=true
  	}

  	stopAnimation(){
    	for(var i = 0; i<this.numBlocks; i++){
      	this.state.blockValues[i]['aniValue'].stopAnimation()
    	}
  	}

  	tap(){
    	this.bounce(0)
  	}


  	render() {

  		//used to animate the ball
	    const top = this.state.animatedBall.interpolate({
	      inputRange: [0, 1],
	      outputRange: [250, 100]
	    })

  		var left = []

	  	//loop though the blockValues and interpolate
		for(i=0; i<this.numBlocks; i++){
		    left.push(this.state.blockValues[i]['aniValue'].interpolate({
		      inputRange: [0, 1],
		      outputRange: [Dimensions.get('window').width, -this.blockWidth]
		    }))
		}

  		var blocks = []

	  	//create blocks with width and colour props
	  	for(var i = 0; i<this.numBlocks; i++){
	    	blocks.push(<Block left={left[i]} width={this.blockWidth} col={this.state.blockValues[i]['col']}/>)
	  	}

      var score

      if(this.state.score<0){
        score = 0
      }else{
        score = this.state.score
      }

   
	    return (
	      	<TouchableWithoutFeedback onPress={this.tap}>
	        	<View style={styles.container2}>

	        		<Text style={styles.highScore}>Top Score: {this.state.highScore}</Text>

	        		<Text style={styles.score}>{score}</Text>

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
	        	style={
	        		{position: 'absolute',
	        		width:50,
		        	height:50,
		        	borderRadius: 100/2,
		        	backgroundColor: 'red',
		        	top: this.props.topMargin,
		        	left:15}
		        }>
      		</Animated.View>
    	</View>)
  	}
}




class Block extends Component {

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
		)
	}
}



const styles = StyleSheet.create({
	container: {
    	flex: 1,
  	},

  	container2:{
	    position: 'absolute',
	    top:0,
	    bottom: 0,
	    left: 0,
	    right: 0,
	    backgroundColor: 'white'
  	},

  	score:{
	  	textAlign: 'center',
	    top:50,
	    fontSize: 28
  	},

  	highScore:{
	  	textAlign: 'right',
	    top:25,
	    fontSize: 18,
      right:10
  	}
});