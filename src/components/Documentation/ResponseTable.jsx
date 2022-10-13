import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

export default class ResponseTable extends Component {
  handleBadge(success) {
    if (success) return <Badge pill variant='success'>
    success
  </Badge>
    else return <Badge pill variant='danger'>
    failed
  </Badge>
  }
  render() {
    return (
      <Table striped bordered hover variant="dark" style={{width:'100%'}}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Response</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {this.props.responses &&
            this.props.responses.map((response) => (
              <tr>
                <td>
                  {response.code}
                  {'  '}{' '}{this.handleBadge(response.success)}
                  
                </td>

                <td>
                  {response.response &&
                    response.response
                      .split('\n')
                      .map((sampleLine) => <p>{sampleLine}</p>)}
                </td>
                <td>
                  {response.details}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    )
  }
}
