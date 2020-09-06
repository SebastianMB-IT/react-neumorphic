import React from "react"
import axios from "axios"

import Utils from "./utils"

class QuizGame extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      "apiBaseUrl": "https://1ze71eiyh4.execute-api.eu-central-1.amazonaws.com/MXMApiEndpoint/musixmatch-proxy/",
      "songs": [],
      "songsOffset": 0,
      "songsPage": 1,
      "songsCountry": "us",
      "currentSong": {},
      "nextSong": {},
      "timer": 20,
      "artists": [],
      "currentArtists": [],
      "nextArtists": [],
      "gameloading" : true,
      "missingtime": 20,
      "timer": "",
      "selectedArtist": "",
      "hasReplied": false,
      "isCorrect": false
    }
    this.responseCheck = this.responseCheck.bind(this)
  }

  componentDidMount () {
    this.getSongs()
  }

  getSongs () {
    const url = `${this.state.apiBaseUrl}chart.tracks.get?chart_name=top&page=${this.state.songsPage}&page_size=10&country=${this.state.songsCountry}&f_has_lyrics=1`
    axios.get(url)
      .then(res => {
        this.setState({
          "songs": res.data.track_list
        })
        if (Object.keys(this.state.currentSong).length === 0) {
          this.setFirstSong()
        }
        this.setNextSong()
      })
  }

  startCountdown () {
    this.setState({
      "timer": setInterval(() => {
        if (this.state.missingtime < 1) {
          this.goToNext()
        } else {
          this.setState(({ missingtime }) => ({
            "missingtime": missingtime - 1
          }))
        }
      }, 1000)
    })
  }

  resetCountdown () {
    clearInterval(this.state.timer)
    this.setState({
      "missingtime": 20
    })
    this.startCountdown()
  }

  getSongArtists (songArtist) {
    let allArtists = [] 
    let currentArtists = [] 
    for (let s in this.state.songs) {
      if (this.state.songs[s].track.artist_name !== songArtist) {
        allArtists.push(this.state.songs[s].track.artist_name)
      }
    }
    allArtists = Utils.shuffle(allArtists)
    currentArtists.push(songArtist)
    currentArtists.push(allArtists[0])
    currentArtists.push(allArtists[1])
    return Utils.shuffle(currentArtists)
  }

  resetResponse () {
    this.setState({
      "selectedArtist": "",
      "hasReplied": false,
      "isCorrect": false
    })
  }

  setFirstSong () {
    if (this.state.songs.length === 0) return
    let currentSong = this.state.songs[this.state.songsOffset]
    const url = `${this.state.apiBaseUrl}track.lyrics.get?track_id=${currentSong.track.track_id}`
    axios.get(url)
      .then(res => {
        let fullLyric = res.data.lyrics.lyrics_body
        currentSong.track.lyrics_body = fullLyric.substring(0, fullLyric.indexOf(" ", 80) + 1)
        this.setState({
          "currentSong": currentSong,
          "currentArtists": this.getSongArtists(currentSong.track.artist_name),
          "gameloading": false
        })
        this.startCountdown()
      })
  }

  setNextSong () {
    if (this.state.songs.length === 0) return
    let nextSong = this.state.songs[this.state.songsOffset + 1]
    const url = `${this.state.apiBaseUrl}track.lyrics.get?track_id=${nextSong.track.track_id}`
    axios.get(url)
      .then(res => {
        let fullLyric = res.data.lyrics.lyrics_body
        nextSong.track.lyrics_body = fullLyric.substring(0, fullLyric.indexOf(" ", 85) + 1)
        this.setState({
          "nextSong": nextSong,
          "nextArtists": this.getSongArtists(nextSong.track.artist_name)
        })
      })
  }

  goToNext () {
    if (this.state.songsOffset === this.state.songs.length - 2) {
      this.setState({
        "currentSong": this.state.nextSong,
        "currentArtists": this.state.nextArtists,
        "songsPage": this.state.songsPage + 1,
        "songsOffset": 0
      }, () => {
        this.getSongs()
      })
    } else {
      this.setState({
        "currentSong": this.state.nextSong,
        "currentArtists": this.state.nextArtists,
        "songsOffset": this.state.songsOffset + 1
      }, () => {
        this.setNextSong()
      })
    }
    this.resetResponse()
    this.resetCountdown()
  }

  updateUserScore () {
    let playerName = localStorage.getItem("playerName")
    let ranking = JSON.parse(localStorage.getItem("playersRanking")) || {}
    ranking[playerName] = ranking[playerName] ? ranking[playerName] + 1 : 1
    localStorage.setItem("playersRanking", JSON.stringify(ranking));
  }

  responseCheck (artist) {
    // Check if the author is correct
    let songArtist = this.state.songs[this.state.songsOffset].track.artist_name
    if (artist == songArtist) {
      // correct
      this.setState({
        "selectedArtist": artist,
        "hasReplied": true,
        "isCorrect": true
      })
      this.updateUserScore()
    } else {
      // not correct
      this.setState({
        "selectedArtist": artist,
        "hasReplied": true,
        "isCorrect": false
      })
    }
    setTimeout(() => {
      this.goToNext()
    }, 1500)
  }

  render () {
    const currentSongLyric = this.state.currentSong.track ? `${this.state.currentSong.track.lyrics_body}...` : ""
    const artistsList = this.state.currentArtists.map((artist, i) => {
      let btnClass = "btn-artist"
      if (artist == this.state.selectedArtist && this.state.hasReplied && this.state.isCorrect) {
        btnClass = `${btnClass} correct`
      } else if (artist == this.state.selectedArtist && this.state.hasReplied && !this.state.isCorrect) {
        btnClass = `${btnClass} not-correct`
      }
      return (
        <div 
          className={btnClass}
          role="button"
          key={i}
          tabIndex={0}
          onClick={() => this.responseCheck(artist)}
        >
          <strong>
            <ul>
              <li>
                {artist}
              </li>
            </ul>
          </strong>
        </div>
      )
    })

    return (
      <>
        <h3
          style={{
            color: "#bbbbbb"
          }}
        > 
          {`Guess the song and indicate the author of the following part of lyric in ${this.state.missingtime} seconds:`}
        </h3>
        <h1 className="lyric-card"> 
          {this.state.gameloading ? `Loading...` : `“ ${currentSongLyric}`}
        </h1>
        <div
          style={{
            display: "flex",
            marginTop: "60px"
          }}
        >
          {artistsList}
        </div>
      </>
    )
  }
}

export default QuizGame
