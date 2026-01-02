module.exports = {
  apps: [{
    name: process.env.PM2_APP || 'innoviaburst',
    script: 'serve',
    // args: `-s ${process.env.BUILD_DIR || 'dist'} -l ${process.env.APP_PORT || 8000}`,
    args: ` ${process.env.BUILD_DIR || 'dist'} ${process.env.APP_PORT || 8000}  --spa --name ${process.env.PM2_APP || 'innoviaburst'}`,
    cwd: process.env.APP_DIR || '/var/www/innoviaburst',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.APP_PORT || 8000
    },
    out_file: `${process.env.APP_DIR || '/var/www/innoviaburst'}/pm2-out.log`,
    error_file: `${process.env.APP_DIR || '/var/www/innoviaburst'}/pm2-error.log`,
    merge_logs: true
  }]
}
