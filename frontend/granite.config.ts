import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';

export default defineConfig({
  scheme: 'intoss',
  appName: 'sign-before',
  plugins: [
    appsInToss({
      brand: {
        displayName: '사인전에',
        primaryColor: '#3182F6',
        icon: 'https://static.toss.im/appsintoss/28889/0e534dc6-5935-45a0-a5bc-810d58763f05.png',
      },
      navigationBar: {
        withBackButton: true,
        withHomeButton: true,
      },
      permissions: [
        { name: 'camera', access: 'access' },
        { name: 'photos', access: 'read' },
      ],
    }),
  ],
});
