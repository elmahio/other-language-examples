import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {setJSExceptionHandler} from "react-native-exception-handler";
import elmahLogger from "./helper/elmahLogger";
import {catchError} from "./helper/error";

export default class App extends Component {
    constructor(props) {
        super(props);
        setJSExceptionHandler((error, isFatal) => {
            if (isFatal)
                alert(error);
            elmahLogger.log(error, isFatal ? "Fatal" : "Error")
        }, true)
    }

    couseHandledError = () => {
        return fetch("Some url", {method: "get"})
            .catch(catchError())
    };

    causeJSError = () => {
        throw new Error('THIS IS A CUSTOM UNHANDLED JS ERROR');
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Simple Elmah.io logger</Text>
                <TouchableOpacity style={styles.button} onPress={this.couseHandledError}>
                    <Text style={styles.text}>Couse handled error</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.causeJSError}>
                    <Text style={styles.text}>Couse Js error</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        padding: 10,
        width: "100%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e1e1e1",
        marginBottom: 20,
    }
});
