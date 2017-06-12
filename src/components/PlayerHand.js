import React from 'react'
import Bet from './Bet'
import styles from '../css/Board.css'

export default class PlayerHand extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      hand: props.hand,
      folded: false
    }
  }

  onFold(){
    this.setState({ folded: true})
    this.props.fold()
  }


  solveHand(fullHand){
    //fullHand = ["2D", "QH", "6C", "9D", "6S", "0C"]
    const cardRanks = {
      "2" : 2,
      "3" : 3,
      "4" : 4,
      "5" : 5,
      "6" : 6,
      "7" : 7,
      "8" : 8,
      "9" : 9,
      "0" : 10,
      "J" : 11,
      "Q" : 12,
      "K" : 13,
      "A" : 14
    }
    const sortedHand = fullHand.sort( (firstCard, secondCard) => {
      return cardRanks[secondCard[0]] - cardRanks[firstCard[0]]
    })
    const flushCards = this.findFlush(sortedHand)
    const results = this.findPairsOrTrips(sortedHand)
    const pairsArray = results[0]
    const tripsArray = results[1]
    debugger
    if(flushCards.length > 0){
      return `${flushCards[0]} high flush`
    }else if(tripsArray.length >= 1 && pairsArray.length >= 1){
      return `Full House ${tripsArray[0]}s full of ${pairsArray[0]}s`
    }else if(tripsArray.length >= 1){
      return `Three of a Kind ${tripsArray[0]}s`
    }else if(pairsArray.length === 2){
      return `Two pairs ${pairsArray[0]}s and ${pairsArray[1]}s`
    }else if(pairsArray.length === 1){
      return `Pair of ${pairsArray[0]}s`
    }else{
      return `${sortedHand[0][0]} high`
    }
  }

  findPairsOrTrips(handArray){

    const object = {};
    const pairs = [];
    const trips = [];

    handArray.forEach( card => {
      if(!object[card[0]])
      object[card[0]] = 0;
      object[card[0]] += 1;
    })

    for (const cardValue in object) {
      if(object[cardValue] === 2) {
        pairs.push(cardValue);
      }else if(object[cardValue] === 3){
        trips.push(cardValue)
      }
    }
    return [pairs, trips]
  }

  findFlush(handArray){
    const object = {}
    const flushCards = []
    let flushSuit = ''

    handArray.forEach( card => {
      if (!object[card[1]])
      object[card[1]] = 0
      object[card[1]] += 1
    })
    for (const cardValue in object) {
      if(object[cardValue] === 5) {
        flushSuit = cardValue
      }
    }
    handArray.forEach( card => {
      if (card[1] === flushSuit)
        flushCards.push(card)
    })
    return flushCards
  }


  render(){
    console.log(this.props)
    if(this.state.hand && !this.state.folded){

      const fullHand = this.props.board.concat(this.props.hand)

      const codes = fullHand.map( card => card.code )

      console.log(codes)

      let currentHand = this.state.hand.map( (el, idx) => <img key={idx} className="card" src={el.image} alt="boohoo" width="100" height="120"/> )

      let handSolve = this.solveHand(codes)
      // debugger
      console.log(this.props.player)
      if(this.props.position === 1){

        return(
          <div >

            {currentHand}

            {handSolve ? <p className="board-text">{handSolve}</p> : null}
            <Bet player={this.props.player} bet={this.props.bet} updatePlayChips={this.props.updatePlayChips}/>
            <button className="btn btn-default" onClick={() => this.props.nextCard() }> Check </button>
            <button className="btn btn-default" onClick={() => this.onFold() }> Fold </button>
          </div>
        )
      }else{
        return(
          <div >
            {currentHand}

            {handSolve ? <p className="board-text">{handSolve}</p> : null}
          </div>
        )
      }
    }else{
      console.log(this.props.board.map( card => card.code) )
      return(
        <div>
          <p>You are currently sitting out</p>
        </div>
      )
    }
  }
}
