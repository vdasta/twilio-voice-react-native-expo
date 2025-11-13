# Expo Implementation Guide

## Overview

This fork provides Expo support for the Twilio Voice React Native SDK using a **hybrid approach** that balances Expo compatibility with maintainability and alignment with upstream updates.

## Implementation Approach

### Design Philosophy

Rather than implementing the full Expo Modules API approach outlined in [twilio/twilio-voice-react-native#496](https://github.com/twilio/twilio-voice-react-native/issues/496), this fork uses a simpler hybrid strategy:

1. **iOS**: Expo Config Plugin for automatic setup
2. **Android**: Standard React Native module (compatible with Expo development builds)
3. **No Expo Modules API**: Uses standard React Native bridge for both platforms

### Why This Approach?

**Advantages:**
- ✅ Simpler to maintain and merge upstream updates
- ✅ Works with Expo development builds (managed workflow with custom native code)
- ✅ No need to rewrite native modules in Expo Modules API
- ✅ Maintains compatibility with bare React Native apps
- ✅ Reduces divergence from upstream Twilio SDK

**Trade-offs:**
- ⚠️ Requires Expo development builds (not compatible with Expo Go)
- ⚠️ Users must run `npx expo prebuild` to generate native projects

## What's Implemented

### 1. iOS Expo Config Plugin

**File**: `plugin/withTwilioVoiceIos.cjs`

This plugin automatically configures iOS projects during the prebuild phase:

- Adds required background modes (VoIP, audio)
- Configures push notification entitlements
- Adds microphone usage description
- Injects TwilioVoice pod dependency

**Usage in app.json/app.config.js:**
```json
{
  "expo": {
    "plugins": [
      "@simplevox/twilio-voice-expo/plugin/withTwilioVoiceIos"
    ]
  }
}
```

### 2. Expo Module Configuration

**File**: `expo-module.config.json`

Declares the package as an Expo-compatible module. Currently has empty module arrays because we're using the standard React Native bridge rather than Expo Modules API.

### 3. Package Configuration

**File**: `package.json`

Key configurations:
- `"expo"` field points to the iOS config plugin
- `peerDependencies` accepts any React Native version (`"react-native": "*"`)
- Built with RN 0.72.9 but compatible with newer versions

## Compatibility Matrix

| Expo SDK | React Native | Status | Notes |
|----------|--------------|--------|-------|
| SDK 53   | 0.79.6       | ✅ Tested | Requires development build |
| SDK 54   | 0.81.5       | ✅ Tested | Requires development build |
| SDK 55+  | TBD          | 🔄 Expected to work | Forward compatibility likely |

**Important**: This package is NOT compatible with Expo Go. Users must create a development build.

## For Users: Installation & Setup

### Prerequisites

- Expo SDK 53 or later
- Expo development build (not Expo Go)

### Installation

```bash
npm install @simplevox/twilio-voice-expo
# or
yarn add @simplevox/twilio-voice-expo
```

### Configuration

1. Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      "@simplevox/twilio-voice-expo/plugin/withTwilioVoiceIos"
    ]
  }
}
```

2. For Android, add Firebase configuration (required for push notifications):
   - Place `google-services.json` in your project root
   - The file will be copied during prebuild

3. Run prebuild to generate native projects:

```bash
npx expo prebuild
```

4. Create a development build:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Usage

Use the SDK exactly as documented in the [official Twilio Voice React Native SDK documentation](https://www.twilio.com/docs/voice/sdks/react-native).

```javascript
import { Voice } from '@simplevox/twilio-voice-expo';

// Use Voice API as normal
```

## For Maintainers: Development & Release

### Repository Structure

```
.
├── plugin/
│   └── withTwilioVoiceIos.cjs    # iOS Expo Config Plugin
├── expo-module.config.json        # Expo module declaration
├── android/                       # Standard RN Android module
├── ios/                          # Standard RN iOS module
├── src/                          # JavaScript/TypeScript source
└── lib/                          # Compiled output (generated)
```

### Development Workflow

#### 1. Syncing with Upstream

This fork tracks `twilio/twilio-voice-react-native`. To merge upstream updates:

```bash
# Add upstream remote (one-time setup)
git remote add upstream https://github.com/twilio/twilio-voice-react-native.git

# Fetch upstream tags
git fetch upstream --tags

# Merge upstream tag (e.g., 1.8.0)
git merge upstream/1.8.0

# Resolve conflicts if any
# Test thoroughly
# Update CHANGELOG.md
```

**Important**: Always test with Expo SDK after merging upstream changes.

#### 2. Building the Package

```bash
# Install dependencies
npm install

# Build constants and errors
npm run build:constants
npm run build:errors

# Build the package
npm run prepare

# Run full check suite
npm run check
```

#### 3. Testing

Before releasing, test with:
- Expo SDK 53 app
- Expo SDK 54 app
- Both iOS and Android platforms
- Development builds (not Expo Go)

#### 4. Versioning Strategy

This fork uses a modified version scheme:

```
<upstream-version>-svox.<fork-iteration>
```

Example: `1.7.0-svox.1`

- `1.7.0`: Upstream Twilio SDK version
- `svox`: SimpleVox identifier
- `1`: Fork iteration number

Increment the fork iteration for:
- Expo-specific fixes
- Documentation updates
- Build configuration changes

Reset to `.1` when syncing a new upstream version.

#### 5. Release Process

```bash
# 1. Ensure all checks pass
npm run check

# 2. Update version in package.json
# Example: 1.7.0-svox.2

# 3. Update CHANGELOG.md with changes

# 4. Commit changes
git add .
git commit -m "chore: release v1.7.0-svox.2"

# 5. Create git tag
git tag v1.7.0-svox.2

# 6. Push to repository
git push origin main --tags

# 7. Publish to npm (if configured)
npm publish
```

### React Native Version Strategy

**Current Strategy**: Build with RN 0.72.9, support newer versions via peer dependencies.

#### Why Not Update to Latest RN?

1. **Upstream Alignment**: Twilio SDK 1.7.0 uses RN 0.72.9
2. **Forward Compatibility**: Native modules built with older RN typically work with newer versions
3. **Easier Merges**: Staying aligned with upstream simplifies merging updates
4. **Library vs App**: As a library, the package compiles with the consumer's RN version

#### When to Update RN Version

Update the devDependency RN version when:
- Upstream Twilio updates their RN version
- Breaking changes in newer RN versions affect the SDK
- Testing reveals compatibility issues

**Process**:
```bash
# Update package.json
npm install --save-dev react-native@<new-version>

# Rebuild and test
npm run check

# Test with Expo SDK using that RN version
```

### Known Issues & Limitations

#### 1. Expo Go Not Supported

This package requires native modules and cannot run in Expo Go. Users must create development builds.

**User Impact**: Requires `npx expo prebuild` and building native apps.

#### 2. Android Config Plugin Not Implemented

Unlike iOS, there's no Android config plugin. Android setup is manual:
- Users must add `google-services.json` manually
- Firebase configuration must be done in `app.json`

**Future Enhancement**: Consider adding Android config plugin for:
- Automatic `google-services.json` placement
- Firebase configuration injection
- Permission declarations

#### 3. No Expo Modules API Implementation

The package uses standard React Native bridge, not Expo Modules API.

**Implications**:
- Cannot use Expo Modules API features (e.g., SharedObjects, Events)
- Lifecycle management uses standard RN approach
- No performance benefits from Expo Modules API

**Why Not Implement**: Adds complexity and divergence from upstream. Current approach works well.

### Troubleshooting

#### Build Failures After Upstream Merge

**Symptom**: TypeScript errors, missing types, or build failures after merging upstream.

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules lib
npm install
npm run prepare
npm run check
```

#### Expo Prebuild Issues

**Symptom**: Config plugin not applying changes.

**Solution**:
```bash
# Clean prebuild cache
rm -rf android ios
npx expo prebuild --clean
```

#### npm audit Vulnerabilities

**Current Status**: 8 vulnerabilities in devDependencies (as of last check)

**Action**: Most are in devDependencies and don't affect published package:
- `twilio-release-tool` (lodash issues) - devDependency only
- `react-native` transitive dependencies - resolved in consumer's app

Run `npm audit fix` periodically, but avoid `--force` unless necessary.

### Testing Checklist

Before releasing a new version, verify:

#### Build & Package
- [ ] `npm run check` passes without errors
- [ ] `npm run prepare` builds successfully
- [ ] No uncommitted API documentation changes
- [ ] TypeScript compilation succeeds
- [ ] All tests pass (517 tests)
- [ ] ESLint passes with no errors

#### Expo SDK 53 Testing
- [ ] iOS development build compiles
- [ ] Android development build compiles
- [ ] Outgoing calls work on iOS
- [ ] Outgoing calls work on Android
- [ ] Incoming calls work on iOS (with push notifications)
- [ ] Incoming calls work on Android (with FCM)
- [ ] Background modes work correctly on iOS
- [ ] App doesn't crash on call disconnect

#### Expo SDK 54 Testing
- [ ] iOS development build compiles
- [ ] Android development build compiles
- [ ] Basic call functionality works
- [ ] No deprecation warnings in console

#### Documentation
- [ ] README.md is up to date
- [ ] CHANGELOG.md includes all changes
- [ ] Version number follows convention
- [ ] EXPO_IMPLEMENTATION.md reflects current state

### Future Enhancements

Potential improvements for future versions:

#### 1. Android Config Plugin
Add `plugin/withTwilioVoiceAndroid.cjs` to:
- Auto-configure Firebase
- Add required permissions
- Handle `google-services.json` placement

#### 2. Expo Modules API Migration
Consider migrating to Expo Modules API if:
- Upstream Twilio adopts it
- Significant performance benefits identified
- Expo Modules API becomes standard in RN ecosystem

**Effort**: High (requires rewriting native modules)
**Benefit**: Better Expo integration, potential performance improvements

#### 3. Expo Go Support
Explore if subset of features could work in Expo Go:
- Outgoing calls only (no push notifications)
- Development/testing mode

**Limitation**: VoIP push notifications require native code

#### 4. Automated Testing
Set up CI/CD for:
- Automated builds with multiple Expo SDK versions
- Integration tests with Expo development builds
- Automated npm publishing

### Resources

#### Upstream Documentation
- [Twilio Voice React Native SDK](https://github.com/twilio/twilio-voice-react-native)
- [Twilio Voice SDK Docs](https://www.twilio.com/docs/voice/sdks/react-native)
- [Issue #496: Expo Support Guide](https://github.com/twilio/twilio-voice-react-native/issues/496)

#### Expo Documentation
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [Android Lifecycle Listeners](https://docs.expo.dev/modules/android-lifecycle-listeners/)

#### Related Projects
- [Twilio Voice React Native Reference App](https://github.com/twilio/twilio-voice-react-native-app)
- [Expo SDK Changelog](https://expo.dev/changelog)

### Support & Contributing

#### Reporting Issues

When reporting issues, include:
- Expo SDK version
- React Native version
- iOS/Android version
- Steps to reproduce
- Error messages and logs

#### Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly with Expo SDK 53 and 54
4. Update documentation
5. Submit a pull request

#### Contact

For questions about this fork:
- GitHub Issues: [vdasta/twilio-voice-react-native-expo](https://github.com/vdasta/twilio-voice-react-native-expo/issues)
- Upstream Issues: [twilio/twilio-voice-react-native](https://github.com/twilio/twilio-voice-react-native/issues)

---

**Last Updated**: November 2025  
**Fork Version**: 1.7.0-svox.1  
**Upstream Version**: 1.7.0
