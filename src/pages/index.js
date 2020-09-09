import React from "react"

import Layout from "../components/layout"
import QuizGame from "../components/quizgame"
import SEO from "../components/seo"

class Quiz extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      "playerName": "",
      "startedQuiz": false
    }
    this.setPlayerName = this.setPlayerName.bind(this)
    this.startQuiz = this.startQuiz.bind(this)
    this.resetQuiz = this.resetQuiz.bind(this)
  }

  componentDidMount() {
    const playerName = localStorage.getItem("playerName")
    this.setState({
      "playerName": playerName || "",
      "startedQuiz": !playerName ? false : true
    })
  }

  setPlayerName (e) {
    this.setState({
      "playerName": e.target.value
    })
  }

  startQuiz () {
    // store playername
    if (!this.state.playerName) return
    localStorage.setItem("playerName", this.state.playerName)
    this.setState({
      "startedQuiz": true
    })
  }

  resetQuiz () {
    // delete playername
    localStorage.removeItem("playerName")
    this.setState({
      "playerName": "",
      "startedQuiz": false
    })
  }

  preventDefault (e) {
    e.preventDefault()
  }

  render () {
    const startedQuiz = this.state.startedQuiz

    return (
      <Layout>
        <SEO title="Quiz" />
        {!startedQuiz ? (
          <>
            <h3
              style={{
                color: "#bbbbbb"
              }}
            > 
              Insert your name and start the game:
            </h3>
            <form onSubmit={this.preventDefault}>
              <input
                type="text"
                className="name-input"
                name="playerName"
                value={this.state.playerName}
                onChange={this.setPlayerName}
              />
            </form>
          </>
        ) : (
          <QuizGame/>
        )}
        <div
          style={{
            marginTop: "150px"
          }}
        >
          {!startedQuiz ? (
            <>
              <div
                className="start-btn"
                role="button"
                tabIndex={0}
                onClick={this.startQuiz}
              >
                Start
              </div>
            </>
          ) : (
            <>
              <div
                className="reset-btn"
                role="button"
                tabIndex={0}
                onClick={this.resetQuiz}
              >
                Reset
              </div>
            </>
          )}
        </div>
      </Layout>
    )
  }
}

export default Quiz
