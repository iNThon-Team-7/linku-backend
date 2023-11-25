module.exports = {
  apps: [
    {
      name: 'linku-backend',
      script: './dist/main.js',
      watch: true,
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
