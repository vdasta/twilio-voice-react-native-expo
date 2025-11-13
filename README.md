# @simplevox/twilio-voice-expo
[![NPM](https://img.shields.io/npm/v/%40simplevox/twilio-voice-expo.svg?color=blue)](https://www.npmjs.com/package/%40simplevox/twilio-voice-expo)

SimpleVox's Expo-friendly distribution of Twilio's Voice React Native SDK allows you to add real-time voice and PSTN calling to your React Native apps while targeting the latest Expo SDK.

- [Documentation](https://www.twilio.com/docs/voice/sdks/react-native)
- [API Reference](https://github.com/twilio/twilio-voice-react-native/blob/latest/docs/api/voice-react-native-sdk.md)
- [Reference App](https://github.com/twilio/twilio-voice-react-native-app)

Please check out the following if you are new to Twilio's Programmable Voice or React Native.

- [Programmable Voice](https://www.twilio.com/docs/voice/sdks)
- [React Native](https://reactnative.dev/docs/getting-started)

## Installation
The package is available through [npm](https://www.npmjs.com/package/@simplevox/twilio-voice-expo).

```sh
yarn add @simplevox/twilio-voice-expo
```

Once the package has been installed to your React Native application, there are further steps that you will need to take for both iOS and Android platforms. Please see Twilio's official documentation for platform-specific setup details.

### Expo config plugin

Add the config plugin to your Expo project's `app.json`/`app.config.js` to automatically configure the required entitlements, background modes, and `TwilioVoice` pod dependency (Expo SDK 54 or newer):

```json
{
  "expo": {
    "plugins": [
      ["@simplevox/twilio-voice-expo", {
        "apsEnvironment": "production"
      }]
    ]
  }
}
```

The optional `apsEnvironment` parameter defaults to `production`. You can also override the microphone permission prompt with the `microphonePermission` option.

## Supporting Documentation

This lightweight fork does not bundle the upstream markdown guides. For end-to-end setup, migration, and customization guidance, refer to Twilio's maintained documentation and quickstarts:

- [React Native Voice SDK docs](https://www.twilio.com/docs/voice/sdks/react-native)
- [Voice quickstart applications](https://github.com/twilio/twilio-voice-react-native-app)

## Issues and Support
Please check out our [common issues](/COMMON_ISSUES.md) page or file any issues you find here on Github. For general inquiries related to the Voice SDK you can file a support ticket.

Please ensure that you are not sharing any [Personally Identifiable Information(PII)](https://www.twilio.com/docs/glossary/what-is-personally-identifiable-information-pii) or sensitive account information (API keys, credentials, etc.) when reporting an issue.

Please check out our [known issues](/KNOWN_ISSUES.md) for known bugs and workarounds.

## Related
- [Reference App](https://github.com/twilio/twilio-voice-react-native-app)
- [Twilio Voice JS](https://github.com/twilio/twilio-voice.js)
- [Twilio Voice iOS](https://github.com/twilio/voice-quickstart-ios)
- [Twilio Voice Android](https://github.com/twilio/voice-quickstart-android)

## License
See [LICENSE](/LICENSE)
