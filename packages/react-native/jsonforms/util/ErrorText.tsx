import React from "react";
import { StyleSheet, Text } from "react-native";

export const ErrorText = (props) => (
    <Text style={styles.errorText}> {props.errors}</Text>
);

const styles = StyleSheet.create({
    errorText: { color: "red" },
});
