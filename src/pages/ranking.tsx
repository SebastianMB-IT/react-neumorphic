// If you don't want to use TypeScript you can delete this file!
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

type DataState = {
  ranking: object[]
}

export default class Ranking extends React.Component<{}, DataState> {

  constructor (props) {
    super(props)
    this.state = {
      ranking: []
    }
  }

  getRanking() {
    let ranking: object = JSON.parse(localStorage.getItem("playersRanking")) || {}
    let rankingArray: object[] = []
    for (let player in ranking) {
      rankingArray.push({
        name: player,
        score: ranking[player]
      })
    }
    this.setState({
      ranking: rankingArray
    })
  }

  componentDidMount() {
    this.getRanking()
  }

  render() {
    const rankingList = this.state.ranking.map((player, i) => {
      return (
        <li key={i}>
          {player["name"]}
          <span className="score">
            {player["score"]} points
          </span>
        </li>
      )
    })
    return (
      <Layout>
        <SEO title="Ranking" />
        <h2>Best players ranking:</h2>
        <ol className="ranking-list">
          {rankingList ? rankingList : ""}
        </ol>
      </Layout>
    )
  }
}