const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const repoDir = 'C:/Users/marwa/DEVOPS';
const repoUrl = 'https://github.com/Marw1BS/devops-ci-cd.git';

const repoName = path.basename(repoUrl, '.git');
const fullPath = path.join(repoDir, repoName);

app.post('/webhook', (req, res) => {
  try {
    if (!fs.existsSync(repoDir)) fs.mkdirSync(repoDir, { recursive: true });
    process.chdir(repoDir);

    if (!fs.existsSync(fullPath)) {
      execSync(`git clone ${repoUrl}`);
    }

    process.chdir(fullPath);
    execSync('git checkout main');
    execSync('git pull origin main');

    try {
      execSync('docker compose down');
    } catch {}

    // Remplacement de l'utilisation de awk par des noms d'images fixes
    const imageNames = [
      'mrwnbnslm/monapp:frontend',
      'mrwnbnslm/monapp:backend'
    ];

    imageNames.forEach(image => {
      try {
        execSync(`docker rmi -f ${image}`);
      } catch {}
    });

    execSync('docker compose pull');
    execSync('docker compose up -d');

    res.status(200).send('Deployment completed');
  } catch (err) {
    console.error(err);
    res.status(500).send('Deployment failed');
  }
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
