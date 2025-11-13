const {
  withEntitlementsPlist,
  withInfoPlist,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DEFAULT_MICROPHONE_USAGE_DESCRIPTION =
  'SimpleVox needs microphone access to make and receive business calls.';
const TWILIO_VOICE_POD = "pod 'TwilioVoice', '6.13.3'";

function ensureBackgroundModes(existing = [], required = []) {
  const set = new Set([...(existing || []), ...required]);
  return Array.from(set);
}

module.exports = function withTwilioVoiceIos(config, options = {}) {
  const {
    apsEnvironment = 'production',
    microphonePermission = DEFAULT_MICROPHONE_USAGE_DESCRIPTION,
  } = options;

  config = withEntitlementsPlist(config, (c) => {
    c.modResults['aps-environment'] = apsEnvironment;
    return c;
  });

  config = withInfoPlist(config, (c) => {
    c.modResults.UIBackgroundModes = ensureBackgroundModes(
      c.modResults.UIBackgroundModes,
      ['voip', 'audio']
    );

    if (!c.modResults.NSMicrophoneUsageDescription) {
      c.modResults.NSMicrophoneUsageDescription = microphonePermission;
    }

    return c;
  });

  config = withDangerousMod(config, [
    'ios',
    (c) => {
      const podfilePath = path.join(c.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      if (!contents.includes(TWILIO_VOICE_POD)) {
        contents = contents.replace(
          /use_expo_modules!/,
          `use_expo_modules!\n  ${TWILIO_VOICE_POD}`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return c;
    },
  ]);

  return config;
};
