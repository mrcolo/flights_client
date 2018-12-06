import React, { Component } from 'react';
import logo from './logo.svg';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { Button, Grid, Input, Container, Label, Segment, Header } from 'semantic-ui-react'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Segment vertical>
                <Header> ✈️ FLIGHT PLANNER ✈️</Header>
                <Input label='From' style={{padding: 10}} size='big'/>
                <Input label='To' style={{padding: 10}} size='big'/>
                <Button color='yellow' size='big' >
                  Get Itinerary
                </Button>
          </Segment>
            <Map
              centerAroundCurrentLocation
              className="map"
              google={this.props.google}
              style={{ height: '100%', position: 'relative', width: '100%' }}
              zoom={14}
            >
            </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBUqByN8IXznxHU8gOgELH9GIrlnlrMXZk")
})(App)
