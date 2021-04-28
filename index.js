#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./src/files');
const github = require('./src/github');
const repo = require('./src/repo');

// console 클리어
clear();

// 제목
console.log(
    chalk.magentaBright.bgBlack(
        figlet.textSync('firstdo', { font: 'Graffiti', horizontalLayout: 'full' })
    )
);

// .git 확인
if (files.directoryExists('.git')) {
    console.log(chalk.red('깃 레포지토리가 이미 있음!'));
    process.exit();
}

const getGithubToken = async () => {
    // config store 에서 token fetch
    let token = await github.getStoredGithubToken();
    if (token) {
        return token;
    }

    // 저장된 토큰이 없다면, 토큰 입력 요함
    token = await github.getPersonalAccesToken();
    return token;
};

const run = async () => {
    try {
        // authentication token 가져오기
        const token = await getGithubToken();
        github.githubAuth(token);

        // 원격 레포지토리 생성
        const url = await repo.createRemoteRepo();

        // .gitignore 생성
        await repo.createGitignore();

        // 로컬 레포지토리 설정 후 push
        await repo.setupRepo(url);

        console.log(chalk.green('All done!'));
    } catch (err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.red('로그인이 안됨. 올바른 토큰 입력바람!'));
                    break;
                case 422:
                    console.log(chalk.red('이미 똑같은 이름의 레포지토리가 있음!'));
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
};

run();