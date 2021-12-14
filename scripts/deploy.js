const path = require("path");
const shell = require('shelljs');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
require('../config/env');

const ignoreWarningMessages = [
    "Everything up-to-date",
    "Browserslist: caniuse-lite is outdated. Please run next command `npm update`"
]

const execAsync = async (command, cwd, options = {}) => {
    return new Promise((resolve, reject) => {

        if (!options || !options.silent) {
            console.log(cwd + ">" + command);
        }

        shell.cd(cwd);

        shell.exec(command, { async: true, ...options }, (exitCode, out, err) => {
            if (err) {
                if(ignoreWarningMessages.some(msg => err.includes(msg))){
                    resolve(err);
                }else {
                    reject(err)
                }
            } else {
                resolve(out);
            }
        })
    })
};

const main = async () => {
    const projectPath = path.resolve(__dirname, "../");

    const DEPLOY_PATH = process.env.DEPLOY_PATH;

    if (DEPLOY_PATH) {
        await execAsync("git pull", projectPath);

        await execAsync("git push", projectPath);

        await execAsync("call npm run build", projectPath);

        await execAsync("svn update", DEPLOY_PATH);

        console.log("复制文件中...");
        shell.cp("-rf", path.resolve(projectPath, "build/") + "\\*", DEPLOY_PATH)
        console.log("复制成功");

        const status = await execAsync("svn status", DEPLOY_PATH, { silent: true });
        if (status && status.includes("M       ")) {
            const username = await execAsync("git config user.name", projectPath, { silent: true });

            const jiraKey = process.env.JIRA_KEY || "";

            await execAsync(`svn commit -m "${jiraKey} auto build by ${username}"`, DEPLOY_PATH);
        }
    }
};

main().then();