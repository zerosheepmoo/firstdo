const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    askResetPAT: () => {
        return inquirer.prompt({
            name: 'isReset',
            type: 'list',
            message: 'Personal Access Token 을 초기화 하시겠습니까?',
            choices: ['No', 'Yes'],
            default: 'No'
        });
    },
    askPersonalAccessToken: () => {
        const questions = [
            {
                name: 'token',
                type: 'password',
                message: 'Personal Access Token 을 입력해주세요.',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your personal access token.';
                    }
                } 
            }
        ];
        return inquirer.prompt(questions);
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: '레포지토리 명을 입력하세요:',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository.';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: '(선택사항) 레포지토리의 description 을 입력해주세요:'
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public 아님 private?:',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        return inquirer.prompt(questions);
    },
    askIgnoreFiles: (filelist) => {
        const questions = [
          {
            type: 'checkbox',
            name: 'ignore',
            message: 'ignore 할 폴더나 파일을 선택하세요.',
            choices: filelist,
            default: ['node_modules', 'bower_components', '.DS_Store']
          }
        ];
        return inquirer.prompt(questions);
      },
};