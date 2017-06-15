/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    AsyncStorage,
    Keyboard,
    NavigatorIOS,
    AlertIOS
} from 'react-native';

import geolib from 'geolib';

var SearchResults = require('./SearchResults');

class SearchPage extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
        message: '',
        geoFromLatitude: 0,
        geoFromLongitude: 0,
        geoToLatitude: 0,
        geoToLongitude: 0,
        popSearchFrom: false
        };
    }
    
    onSearchTextAChanged(event) {
        this.setState({ searchA: event.nativeEvent.text });
    }
    
    onSearchTextBChanged(event) {
        this.setState({ searchB: event.nativeEvent.text });
    }

    onFocusTextA(event) {
        this.state.popSearchFrom = true;
        this.props.navigator.push({
                                  title: 'From',
                                  component: SearchResults,
                                  passProps: {propertyInput: this.state.searchA}
                                  });
        Keyboard.dismiss(0);
    }
    
    onFocusTextB(event) {
        this.state.popSearchFrom = false;
        this.props.navigator.push({
                                  title: 'To',
                                  component: SearchResults,
                                  passProps: {propertyInput: this.state.searchB}
                                  });
        Keyboard.dismiss(0);
    }
    
    onButtonClearAPressed(event) {
        this.setState({ searchA: '' });
        this.setState({ message: ''});
    }
    
    onButtonClearBPressed(event) {
        this.setState({ searchB: '' });
        this.setState({ message: ''});
    }

    onSearchPressed() {
        if(this.state.searchA && this.state.searchB) {
            this.calculateDistance();
        } else {
            AlertIOS.alert('Please input to both!');
        }
    }

    calculateDistance() {

        var distance = geolib.getDistanceSimple(
                                           {latitude: this.state.geoFromLatitude, longitude: this.state.geoFromLongitude},
                                           {latitude: this.state.geoToLatitude, longitude: this.state.geoToLongitude},
                                           );
        this.setState({message: "distance : " + distance/1000 + " km"});
    }

    async componentWillReceiveProps(nextProps) {
        
        const propertyGeo = await AsyncStorage.getItem('propertyInputSearch');
        if(propertyGeo != null) {
            
            var geoObject = JSON.parse(propertyGeo);
            var coordinate = geoObject.position
            var address = geoObject.formattedAddress
            
            if(this.state.popSearchFrom) {
                this.state.geoFromLatitude = coordinate.lat
                this.state.geoFromLongitude = coordinate.lng
                this.setState({ searchA: address });
            } else {
                this.state.geoToLatitude = coordinate.lat
                this.state.geoToLongitude = coordinate.lng
                this.setState({ searchB: address });
            }
            AsyncStorage.setItem('propertyInputSearch', '');
        }
    }

    render() {

    return (
            
      <View style={styles.container}>
        <Text style={styles.description}>
          Calculate distance from A to B!
        </Text>
        <View style={styles.flowRight}>
            <TextInput
            style={styles.searchInput}
            value={this.state.searchA}
            onChange={this.onSearchTextAChanged.bind(this)}
            onFocus={this.onFocusTextA.bind(this)}
            placeholder='Input via address from'/>
          <TouchableHighlight style={styles.button}
              underlayColor='#99d9f4'>
            <Text
              style={styles.buttonText}
              onPress={this.onButtonClearAPressed.bind(this)}>
              CLEAR
            </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.flowRight}>
            <TextInput
            style={styles.searchInput}
            value={this.state.searchB}
            onChange={this.onSearchTextBChanged.bind(this)}
            onFocus={this.onFocusTextB.bind(this)}
            placeholder='Input via address to'/>
            
            <TouchableHighlight style={styles.button}
                underlayColor='#99d9f4'>
                <Text
                style={styles.buttonText}
                onPress={this.onButtonClearBPressed.bind(this)}>
                CLEAR
                </Text>
            </TouchableHighlight>
        </View>
        <View style={styles.flowRight}>
            <TouchableHighlight style={styles.button}
            underlayColor='#99d9f4'>
            <Text
            style={styles.buttonText}
            onPress={this.onSearchPressed.bind(this)}>
            SEARCH
            </Text>
            </TouchableHighlight>
        </View>
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
                               description: {
                               marginBottom: 20,
                               fontSize: 18,
                               textAlign: 'center',
                               color: '#656565'
                               },
                               container: {
                               padding: 30,
                               marginTop: 65,
                               alignItems: 'center'
                               },
                               flowRight: {
                               flexDirection: 'row',
                               alignItems: 'center',
                               alignSelf: 'stretch'
                               },
                               buttonText: {
                               fontSize: 18,
                               color: 'white',
                               alignSelf: 'center'
                               },
                               button: {
                               height: 36,
                               flex: 1,
                               flexDirection: 'row',
                               backgroundColor: '#48BBEC',
                               borderColor: '#48BBEC',
                               borderWidth: 1,
                               borderRadius: 8,
                               marginBottom: 10,
                               alignSelf: 'stretch',
                               justifyContent: 'center'
                               },
                               searchInput: {
                               height: 36,
                               padding: 4,
                               marginRight: 5,
                               flex: 4,
                               fontSize: 18,
                               borderWidth: 1,
                               borderColor: '#48BBEC',
                               borderRadius: 8,
                               color: '#48BBEC'
                               }
                               });

module.exports = SearchPage;
