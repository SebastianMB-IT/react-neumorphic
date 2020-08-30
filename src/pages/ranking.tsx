// If you don't want to use TypeScript you can delete this file!
import React from "react"

import { PageProps } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

type DataProps = {
  site: {
    buildTime: string
  }
}

const Ranking: React.FC<PageProps<DataProps>> = ({ data, path }) => (
  <Layout>
    <SEO title="Ranking" />
    <h2>Best users ranking:</h2>
    <div className="lyric-card">
      <ul>
        <li>
          Sebastian Marius Besel
        </li>
        <li>
          Francesco Filippini
        </li>
        <li>
          Jader Rossi
        </li>
      </ul>
    </div>
  </Layout>
)

export default Ranking