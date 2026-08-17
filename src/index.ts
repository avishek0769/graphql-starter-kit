import inquirer from "inquirer";
import ora from "ora";
import { exec, execSync } from "child_process";
import fs from "fs/promises";
import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_BASE = path.join(__dirname, "../template");

const tp = (...segments: [string]) => path.join(TEMPLATE_BASE, ...segments);

async function init() {
    const answers = await inquirer.prompt([
        {
            type: "select",
            message: "Choose package manager -",
            name: "packageManager",
            choices: [
                { name: "npm", value: "npm" },
                { name: "yarn", value: "yarn" },
                { name: "pnpm", value: "pnpm" },
            ],
        },
        {
            type: "select",
            message: "Choose database integration -",
            name: "database",
            choices: [
                { name: "MongoDB (Mongoose)", value: "nosql" },
                { name: "PostgreSQL (Prisma)", value: "sql" },
            ],
        },
    ]);

    let initCommand = "";
    let installCommand = "";
    let executionCommand = "";

    switch (answers.packageManager) {
        case "npm":
            initCommand = "npm init -y";
            installCommand = "npm install";
            executionCommand = "npx";
            break;
        case "yarn":
            initCommand = "yarn init";
            installCommand = "yarn add";
            executionCommand = "yarn dlx";
            break;
        case "pnpm":
            initCommand = "pnpm init";
            installCommand = "pnpm add";
            executionCommand = "pnpm dlx";
            break;
    }

    const installationSpinner = ora("Installing necessary packages...").start();

    execSync(initCommand);
    const packageJsonFileContent = JSON.parse(await fs.readFile("package.json", { encoding: "utf8" }));
    packageJsonFileContent.type = "module";
    packageJsonFileContent.scripts = {
        dev: "node --watch index.js",
    };
    await fs.writeFile("package.json", JSON.stringify(packageJsonFileContent));

    
}
