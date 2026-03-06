const fs = require('fs');
const cp = require('child_process');

const envFile = fs.readFileSync('.env', 'utf-8');
const tursoUrl = envFile.match(/TURSO_DATABASE_URL="(.*?)"/)?.[1];
const tursoToken = envFile.match(/TURSO_AUTH_TOKEN="(.*?)"/)?.[1];
const nextAuthUrl = "https://apt-ai-gamma.vercel.app";
const nextAuthSecret = require('crypto').randomBytes(32).toString('hex');

function addEnv(key, value) {
    if (!value) return;
    console.log(`Setting ${key}...`);
    cp.execSync(`npx vercel env add ${key} production`, {
        input: value,
        stdio: ['pipe', 'inherit', 'inherit'],
        env: process.env
    });
}

addEnv('TURSO_DATABASE_URL', tursoUrl);
addEnv('TURSO_AUTH_TOKEN', tursoToken);
addEnv('NEXTAUTH_URL', nextAuthUrl);
addEnv('NEXTAUTH_SECRET', nextAuthSecret);
