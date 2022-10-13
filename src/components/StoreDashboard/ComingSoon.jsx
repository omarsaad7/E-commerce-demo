import React, { Component } from 'react'
import { Styles } from '../General/StaticVariables/Styles.js'
export default class ComingSoon extends Component {
  render() {
    return (
      <div style={Styles.centered90}>
        <img
          src="/comingSoon.png"
          alt="coming Soon"
          width="100%"
          height="100%"
        />
      </div>
    )
  }
}
