import { jest } from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';

// Reanimated and Worklets need native modules that do not exist under Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);
