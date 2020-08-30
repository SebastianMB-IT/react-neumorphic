import React from "react"

import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 1080,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <Link className="button" activeClassName="active-button" to="/">Quiz</Link>
        <Link className="button" activeClassName="active-button" to="/ranking/">Ranking</Link>
        <Link className="button" activeClassName="active-button" to="/player/">Player</Link>
        <main
          style={{
            marginTop: `100px`,
          }}
        >{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
