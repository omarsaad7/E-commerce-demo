import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
export default class HeadersTable extends Component {


  render() {
    return (
      <Table striped bordered hover variant="dark" style={{width:'100%'}}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        {this.props.headers&&this.props.headers.map((header) => (
          <tr>
          <td >{header.key}</td>
          <td >{header.value}</td>
        </tr>
        ))}
        </tbody>
      </Table>
    )
  }
}
