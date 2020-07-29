import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Sebastian Marius Besel</h1>
    <h1
      className="points-text"
    >
      25 points
    </h1>
  </Layout>
)

export default SecondPage
