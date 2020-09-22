import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default class Player extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      playerName : localStorage.getItem("playerName"),
      playerPoints : JSON.parse(localStorage.getItem("playersRanking"))
    }
  }

  render () {
    return (
      <Layout>
        <SEO title="Player" />
        <h1>{this.state.playerName}</h1>
        <h1
          className="points-text"
        >
          {this.state.playerPoints[this.state.playerName]} points
        </h1>
      </Layout>
    )
  }

}