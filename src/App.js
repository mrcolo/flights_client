import React, { Component } from 'react';
import logo from './logo.svg';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { Button, Input, Segment, Header, Container, Menu, Label } from 'semantic-ui-react'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airports: [],
      airport_names: [],
      currentItinerary: [],
      curr_start: '',
      curr_end: '',
      user_lat: Number,
      user_long: Number
    };
  }

   componentWillMount() {
     this.handleBegin();
   }

  returnCurrentPos = async(position) => {
    this.setState({
      user_lat: position.coords.latitude,
      user_long: position.coords.longitude
    });
  }

  handleBegin = async () => {
      //Gets user's current location.
      navigator.geolocation.getCurrentPosition(this.returnCurrentPos)

      //Simple demonstration of how to push.
      // let temp = this.state.airports;
      // temp.push({lat: this.state.user_lat, lng: this.state.user_long})
      // this.setState({
      //   airports: temp
      // });
  }

  handleStartChange = async (e,data) => {
    await this.handleAutoComplete(data.value);


    const result = data.value.slice(0,3)
    this.setState({
      curr_start: result
    });
  }

  handleEndChange = async (e,data) => {
    await this.handleAutoComplete(data.value);

    const result = data.value.slice(0,3)
    this.setState({
      curr_end: result
    });
  }

  handleButtonClick = async () => {
    alert(this.state.curr_start + ' to ' + this.state.curr_end)
    const {curr_start, curr_end} = this.state;
    const url = "https://b7b0cfe0.ngrok.io/compute"
    const body = {
      start: curr_start,
      end: curr_end
    }

    await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(body)
    })

  }

  handleAutoComplete = async (curr_input) => {
    if(curr_input !== ''){
      const url = "https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey=4AmXBV32ASqGFcyq5eYK3O04RsatzXID&term=" + curr_input
      const query = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
      })

      this.setState({
        airport_names: await query.json(),
      });
    }
  }

  handleItinerary = async() => {

  }

  render() {
    const {airports, airport_names, user_lat, user_long} = this.state

    return (
      <div className="App">
          <Menu fixed='top'>
                <Header  style={{paddingTop: 20, paddingLeft: 10, fontSize: 30}}>✈️</Header>
                  <Input list='airports' label='From' onChange={this.handleStartChange}  style={{padding: 10}} size='big'/>
                  <datalist id='airports'>
                    {
                      airport_names && airport_names.map(name => (
                        <option value={name.value + ' - ' + name.label} />))
                    }
                  </datalist>
                <Input list='airports' label='To' onChange={this.handleEndChange} style={{padding: 10}} size='big'/>
                <datalist id='airports'>
                  {
                    airport_names && airport_names.map(name => (
                      <option value={name.value}>name.value + ' - ' + name.label</option>))
                  }
                </datalist>
                <div style={{paddingTop: 15, paddingRight: 150}}>
                  <Button fluid onClick={this.handleButtonClick} color='yellow' size='medium' >
                    Get Itinerary
                  </Button>
                </div>
          </Menu>
            <Map
              centerAroundCurrentLocation
              className="map"
              google={this.props.google}
              style={{ height: '100%', position: 'relative', width: '100%' }}
              zoom={14}
            >

            <Marker
              name={'Your Position'}
              position={{lat: user_lat, lng: user_long}}
              icon={{
                url: "http://pluspng.com/img-png/you-are-here-png-hd-you-are-here-icon-512.png",
                anchor: new this.props.google.maps.Point(32,32),
                scaledSize: new this.props.google.maps.Size(64,64)
              }}
            />

            {
              airports.map(airportPos => <Marker
                    position={airportPos}
                    icon={{
                      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-VJgmGgOSXcqYUKzL67aAKaj05fEMxJrFarvw8eNG0FJRf4Q",
                      anchor: new this.props.google.maps.Point(32,32),
                      scaledSize: new this.props.google.maps.Size(64,64)
                    }} />)
            }
            </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBUqByN8IXznxHU8gOgELH9GIrlnlrMXZk")
})(App)
