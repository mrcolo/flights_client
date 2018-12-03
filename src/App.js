import React, { Component } from 'react';
import logo from './logo.svg';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { Button } from 'semantic-ui-react'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Map
        centerAroundCurrentLocation
        className="map"
        google={this.props.google}
        style={{ height: '100%', position: 'relative', width: '100%' }}
        zoom={14}
      >
      <Marker
  title={'The marker`s title will appear as a tooltip.'}
  name={'SOMA'}
  position={{lat: 37.778519, lng: -122.405640}} />
      </Map>
        </header>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBUqByN8IXznxHU8gOgELH9GIrlnlrMXZk")
})(App)
