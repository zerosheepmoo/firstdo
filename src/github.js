const CLI = require('clui');
const Conf = require('conf');
const { Octokit } = require('@octokit/rest');
const Spinner = CLI.Spinner;
// deprecated
// const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require('./inquirer');
const pkg = require('../package.json');

const conf = new Conf(pkg.name);

module.exports = {
    getInstance: () => {
        return octokit;
    },
    getStoredGithubToken: async () => {
        const t = await conf.get('github.token');
        if (t) {
            const res = await inquirer.askResetPAT();
            return res.isReset === 'No' ? t : undefined;
        }
    },
    getPersonalAccesToken: async () => {
        const tokenObj = await inquirer.askPersonalAccessToken();
        const TOKEN = tokenObj.token;
        conf.set('github.token', TOKEN);
        return TOKEN;
    },
    githubAuth: (token) => {
        octokit = new Octokit({
            auth: token
        });
    },
};