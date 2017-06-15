/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Text,
  AsyncStorage,
  NavigatorIOS
} from 'react-native';

import update from 'react-addons-update';
import Geocoder from 'react-native-geocoder';

var SearchPage = require('./SearchPage');

class SearchResults extends Component {

    constructor(props) {
        super(props);
        this.loadEntered();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['']),
        };
    }
    
    onSearchTextChanged(event) {
        this.setState({ searchInput: event.nativeEvent.text });
    }
    
    onEndEditing(event) {
        this.geoSearch()
    }
    
    onRowPressed(row) {
        this.state.searchInput = row;
        this.geoSearch()
    }
    
    geoSearch() {
        Geocoder.geocodeAddress(this.state.searchInput).then(res => {
                                                             console.log(res[0]);
                                                             this.setState({ geoObject: JSON.stringify(res[0]) });
                                                             this.popNavigation();
                                                             })
        .catch(err => console.log(err))
    }
    
    async loadEntered(){
        const storage = await AsyncStorage.getItem('StorageRecentlyEntered');
        if(storage != null) {
            this.setState({
                          dataSource: this.state.dataSource.cloneWithRows(JSON.parse(storage))
                          })
            var loadSaved = JSON.parse(storage);
            this.setState(dataSource: loadSaved);
        }
    }
    
    async saveEntered(){
        try{
            const storage = await AsyncStorage.getItem('StorageRecentlyEntered');
            var arrayForSave = storage == null ? [] : JSON.parse(storage);
            const newArray = update(arrayForSave, {$push: [this.state.searchInput]});
            AsyncStorage.setItem('StorageRecentlyEntered', JSON.stringify(newArray.reverse()))
        } catch(e){
            console.log('caught error', e);
        }
    }
    
    popNavigation() {
        if (this.state.geoObject != null) {
            AsyncStorage.setItem('propertyInputSearch', this.state.geoObject);
            this.saveEntered()
        }
        this.props.navigator.pop({component: SearchPage});
    }
    
    renderRow(rowData, sectionID, rowID) {
        
        return (
                <TouchableHighlight onPress={() => this.onRowPressed(rowData)}
                underlayColor='#dddddd'>
                <View>
                <View style={styles.rowContainer}>
                <View  style={styles.textContainer}>
                <Text style={styles.title}
                numberOfLines={1}>{rowData}</Text>
                </View>
                </View>
                <View style={styles.separator}/>
                </View>
                </TouchableHighlight>
                );
    }
    
    render() {
        
        return (
                <View style={styles.container}>
                <View style={styles.flowRight}>
                    <TextInput style={styles.searchInput}
                    value={this.state.searchInput}
                    onChange={this.onSearchTextChanged.bind(this)}
                    onEndEditing={this.onEndEditing.bind(this)}
                    placeholder='Input via address'/>
                </View>
                <View style={styles.flowRight}>
                    <ListView style={styles.listviewStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}/>
                </View>
                </View>
            );
        
    }
}

var styles = StyleSheet.create({
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

                               listviewStyle: {
                               height: 500,
                               padding: 10,
                               marginTop: 10,
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
                               },
                               
                               rowContainer: {
                               flexDirection: 'row',
                               padding: 10
                               },
                               
                               title: {
                               fontSize: 20,
                               color: '#656565'
                               },
                               textContainer: {
                               flex: 1
                               },
                               });

module.exports = SearchResults;
