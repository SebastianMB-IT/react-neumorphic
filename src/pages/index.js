import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />

    <h3
      style={{
        color: "#bbbbbb"
      }}
    > 
      Guess the song and indicate the author of the following sentence in 20 seconds:
    </h3>

    <h1 className="lyric-card">“ Hi people</h1>

    <div
        style={{
          display: "flex",
          marginTop: "60px"
        }}
    >
      <div
        className="btn-artist"
      >
        <strong>
          <ul>
            <li>
              Rocco Hunt
            </li>
          </ul>
        </strong>
      </div>
      <div
        className="btn-artist"
      >
        <strong>
          <ul>
            <li>
              Sfera Ebbasta
            </li>
          </ul>
        </strong>
      </div>
      <div
        className="btn-artist"
      >
        <strong>
          <ul>
            <li>
              Tiziano Ferro
            </li>
          </ul>
        </strong>
      </div>  
    </div>

    <div
        style={{
          marginTop: "150px"
        }}
    >
      <div
        className="reset-btn"
      >
        Reset
      </div>
    </div>


  </Layout>
)

export default IndexPage
