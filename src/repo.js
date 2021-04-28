const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git')();
const Spinner = CLI.Spinner;
const touch = require("touch");

const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new Spinner('원격 레포지토리 만드는 중...');
        status.start();

        try {
            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.ssh_url;
        } finally {
            status.stop();
        }
    },
    createGitignore: async () => {
        // lodash _.without alternative
        const without = (array, ...filtered) => {
            let arr = array;
            for (let i = 0; i < filtered.length; i++) {
                arr = arr.filter( n => n != filtered[i]);
            }
            return arr;
        };
        const filelist = without(fs.readdirSync('.'), '.git', '.gitignore');

        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);

            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                touch('.gitignore');
            }
        } else {
            touch('.gitignore');
        }
    },
    setupRepo: async (url) => {
        const status = new Spinner('로컬 레포지토리 초기화 and 원격에 push 중...');
        status.start();

        try {
            await git.init()
            await git.add('.gitignore');
            await git.add('./*');
            await git.commit('Initial commit');
            await git.addRemote('origin', url);
            await git.push(['-u', 'origin', 'master'], () => console.log('done'));
        } finally {
            status.stop();
        }
    },
};