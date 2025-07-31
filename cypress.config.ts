import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      // Test user credentials - you can edit these later
      ADMIN_EMAIL: 'admin',
      ADMIN_PASSWORD: 'admin@123',
      ORG_EMAIL: 'john1@gmail.com', 
      ORG_PASSWORD: 'Password@123',
      LEARNER_EMAIL: 'l1@gmail.com',
      LEARNER_PASSWORD: 'Password123',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
