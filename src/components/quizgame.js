import React from "react"
import axios from 'axios'

import Utils from './utils'

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
      "nextArtists": []
    }
    this.goToNext = this.goToNext.bind(this)
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
          "currentArtists": this.getSongArtists(currentSong.track.artist_name)
        })
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
  }

  render () {

    const currentSongLyric = this.state.currentSong.track ? `${this.state.currentSong.track.lyrics_body}...` : ""

    return (
      <>
      <h3
        style={{
          color: "#bbbbbb"
        }}
      > 
        Guess the song and indicate the author of the following part of lyric in 20 seconds:
      </h3>
      <h1 className="lyric-card"> 
        {`“ ${currentSongLyric}`}
      </h1>
      <div
        style={{
          display: "flex",
          marginTop: "60px"
        }}
      >
        <div 
          className="btn-artist"
          role="button"
          tabIndex={0}
          onClick={this.goToNext}
        >
          <strong>
            <ul>
              <li>
                Rocco Hunt
              </li>
            </ul>
          </strong>
        </div>
        <div className="btn-artist">
          <strong>
            <ul>
              <li>
                Sfera Ebbasta
              </li>
            </ul>
          </strong>
        </div>
        <div className="btn-artist">
          <strong>
            <ul>
              <li>
                Tiziano Ferro
              </li>
            </ul>
          </strong>
        </div>  
      </div>
    </>
    )
  }
}

export default QuizGame
