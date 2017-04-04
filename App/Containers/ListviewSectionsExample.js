import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import Camera from 'react-native-camera'
import RNFetchBlob from 'react-native-fetch-blob'
import Config from 'react-native-config'
const alert = alert()

export default class CameraScreen extends Component {
  sendImageToAPI (uri) {
    const url = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/tag'
    console.log(Config.VisionAPI)

    RNFetchBlob.fetch('POST', url, {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': '87772d46cfd54a429858218e1ee87254'
    }, RNFetchBlob.wrap(uri))
    .then((resp) => {
      alert(resp.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
      .then((data) => alert(data))
      .then((data) => { this.setState({isRecording: false}); alert(data) })
      .catch(err => alert(err))
      this.setState({
        isRecording: true
      })
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <Text style={styles.capture} >[CAPTUREE]</Text>
          </TouchableHighlight>
          <Text style={styles.capture} onPress={this.startRecording.bind(this)}>[Video]</Text>
        </Camera>
      </View>
    )
  }

  takePicture () {
    const options = {}
    this.camera.capture({metadata: options})
    .then((data) => this.sendImageToAPI(data.path))
    .catch(err => console.error(err))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
})
