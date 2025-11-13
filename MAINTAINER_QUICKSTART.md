# Maintainer Quick Reference

Quick commands and workflows for maintaining this fork.

## Daily Development

### Build & Test
```bash
# Full check (run before committing)
npm run check

# Quick build
npm run prepare

# Run tests only
npm test

# Type check only
npm run check:type

# Lint only
npm run check:lint
```

### Common Issues

**TypeScript errors in test/app?**
```bash
# The check:type script should use tsconfig.build.json
# Verify in package.json:
"check:type": "tsc --noEmit --project tsconfig.build.json"
```

**api-documenter not found?**
```bash
# Reinstall the GitHub dependency
npm uninstall @microsoft/api-documenter
npm install --save-dev github:twilio/api-documenter#v0.0.1
```

**Uncommitted API changes?**
```bash
# This is expected after code changes
# Commit the generated files:
git add api/ docs/api/ lib/
git commit -m "docs: update API documentation"
```

## Syncing with Upstream

### One-Time Setup
```bash
git remote add upstream https://github.com/twilio/twilio-voice-react-native.git
```

### Merge Upstream Release
```bash
# Fetch latest
git fetch upstream --tags

# Check available versions
git tag -l | grep -v svox | tail -10

# Merge specific version (e.g., 1.8.0)
git merge upstream/1.8.0

# If conflicts, resolve and:
git add .
git commit -m "chore: merge upstream 1.8.0"

# Test thoroughly
npm run check

# Update version and changelog
# Then commit
```

## Release Process

### 1. Pre-Release Checklist
- [ ] All tests pass: `npm run check`
- [ ] Tested with Expo SDK 53 and 54
- [ ] CHANGELOG.md updated
- [ ] Version follows pattern: `<upstream>-svox.<iteration>`

### 2. Version & Tag
```bash
# Update package.json version
# Example: 1.7.0-svox.2

# Commit
git add package.json CHANGELOG.md
git commit -m "chore: release v1.7.0-svox.2"

# Tag
git tag v1.7.0-svox.2

# Push
git push origin main --tags
```

### 3. Publish (if configured)
```bash
npm publish
```

## Versioning Rules

Format: `<upstream-version>-svox.<fork-iteration>`

Examples:
- `1.7.0-svox.1` - First fork release based on upstream 1.7.0
- `1.7.0-svox.2` - Second iteration (bug fixes, docs)
- `1.8.0-svox.1` - First fork release based on upstream 1.8.0

**When to increment:**
- `.1` → `.2`: Expo-specific fixes, docs, build changes
- `1.7.0` → `1.8.0`: Syncing new upstream version (reset to `.1`)

## Testing Matrix

### Minimum Testing Before Release

**Expo SDK 53 (RN 0.79.6)**
- [ ] iOS build succeeds
- [ ] Android build succeeds
- [ ] Outgoing call works

**Expo SDK 54 (RN 0.81.5)**
- [ ] iOS build succeeds
- [ ] Android build succeeds
- [ ] Outgoing call works

### Test App Setup
```bash
# Create test app
npx create-expo-app test-app --template blank
cd test-app

# Install fork (local)
npm install ../path/to/twilio-voice-react-native-expo

# Or from npm
npm install @simplevox/twilio-voice-expo

# Add plugin to app.json
{
  "expo": {
    "plugins": [
      "@simplevox/twilio-voice-expo/plugin/withTwilioVoiceIos"
    ]
  }
}

# Prebuild
npx expo prebuild

# Run
npx expo run:ios
npx expo run:android
```

## Troubleshooting

### Build Fails After Upstream Merge
```bash
rm -rf node_modules lib
npm install
npm run prepare
```

### npm audit Shows Vulnerabilities
```bash
# Check severity
npm audit

# Fix non-breaking
npm audit fix

# Most are devDependencies - safe to ignore for library
```

### Config Plugin Not Working
```bash
# Clean and rebuild
rm -rf android ios
npx expo prebuild --clean
```

## Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `package.json` | Version, deps, scripts | Version bumps, dep updates |
| `CHANGELOG.md` | Release notes | Every release |
| `README.md` | User documentation | Feature changes |
| `EXPO_IMPLEMENTATION.md` | Technical guide | Architecture changes |
| `plugin/withTwilioVoiceIos.cjs` | iOS config plugin | iOS setup changes |
| `expo-module.config.json` | Expo module config | Rarely (if adding Expo Modules API) |
| `tsconfig.build.json` | Build TS config | Build scope changes |

## Important Notes

1. **Never update RN version** without upstream doing so first
2. **Always test with Expo** after upstream merges
3. **Keep changes minimal** to ease future merges
4. **Document everything** in CHANGELOG and EXPO_IMPLEMENTATION.md
5. **Test both platforms** before releasing

## Resources

- Full guide: `EXPO_IMPLEMENTATION.md`
- Upstream: https://github.com/twilio/twilio-voice-react-native
- Expo guide: https://github.com/twilio/twilio-voice-react-native/issues/496
