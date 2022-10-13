import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import { Styles } from '../General/StaticVariables/Styles.js'

export default class BodyTable extends Component {
  render() {
    return (
      <Table striped bordered hover variant="dark" style={{width:'100%'}}>
        <thead>
          <tr>
            <th>Attribute</th>
            {/* <th>Description</th> */}
            <th>Sample</th>
          </tr>
        </thead>
        <tbody>
          {this.props.body &&
            this.props.body.fields.map((field) => (
              <tr>
                <td style={{width:'50%'}}>
                  {field.name}
                  {'  '}
                  {field.required && (
                    <Badge pill variant="warning">
                      required
                    </Badge>
                  )}
                  <br />
                  <div style={Styles.description}>{field.description}</div>
                  <ul>
                    {field.subfields &&
                      field.subfields.map((subfield) => (
                        <div>
                          <li>
                            {subfield.name} {'  '}
                            {subfield.required && (
                              <Badge pill variant="warning">
                                required
                              </Badge>
                            )}
                            <br />
                            <div style={Styles.description}>
                              {subfield.description}
                            </div>
                            <ul>
                              {subfield.subfields &&
                                subfield.subfields.map((subfield2) => (
                                  <li>
                                    {subfield2.name} {'  '}
                                    {subfield2.required && (
                                      <Badge pill variant="warning">
                                        required
                                      </Badge>
                                    )}
                                    <br />
                                    <div style={Styles.description}>
                                      {subfield2.description}
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </li>
                        </div>
                      ))}
                  </ul>
                </td>
                {/* <td>{field.description}</td> */}
                <td style={{width:'50%'}}>
                  {field.sample &&
                    field.sample.split('\n').map((sampleLine) => (
                      <p>{sampleLine}</p>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    )
  }
}
