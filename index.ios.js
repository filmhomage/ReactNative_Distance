/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var React = require('react');
var ReactNative = require('react-native');
var SearchPage = require('./SearchPage');

var styles = ReactNative.StyleSheet.create({
                                           container: {
                                           flex: 1
                                           }
                                           });

class ReactNative_Distance extends React.Component {
    render() {
        return (
                <ReactNative.NavigatorIOS
                style={styles.container}
                initialRoute={{
                title: 'ReactNative_Distance',
                component: SearchPage,
                }}/>
                );
    }
}

ReactNative.AppRegistry.registerComponent('ReactNative_Distance', function() { return ReactNative_Distance });
