#!/usr/bin/env node
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
const tp = (...segments) => path.join(TEMPLATE_BASE, ...segments);
async function init() {
    // Ask queries
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
    // Setup package manager
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
    // Update package.json
    execSync(initCommand);
    const packageJsonFileContent = JSON.parse(await fs.readFile("package.json", { encoding: "utf8" }));
    packageJsonFileContent.type = "module";
    packageJsonFileContent.scripts = {
        dev: "node --watch src/index.js",
    };
    await fs.writeFile("package.json", JSON.stringify(packageJsonFileContent));
    // Install packages
    let db = "";
    if (answers.database === "nosql") {
        db = "mongoose";
    }
    else {
        db = "prisma @prisma/client @prisma/adapter-pg pg @prisma/client-runtime-utils";
    }
    const installationProcess = exec(`${installCommand} express cors dotenv @as-integrations/express5 @apollo/server graphql ${db}`);
    // Done installing packages
    installationProcess.on("exit", async (code) => {
        if (code === 0) {
            installationSpinner.succeed("Installation done");
        }
        else {
            installationSpinner.fail(`Process exited with code ${code}`);
        }
        // Setup codebase - GraphQL
        const codeGenerationSpinner = ora("Setting up codebase...").start();
        await fsExtra.copy(`${tp("graphql-temp")}/`, "./src/");
        // Setup codebase - Database
        if (answers.database === "sql") {
            const prismaProcess = exec(`${executionCommand} prisma init --datasource-provider postgresql --output ../generated/prisma`);
            prismaProcess.on("exit", async (code) => {
                if (code === 0) {
                    codeGenerationSpinner.succeed("All done :)");
                }
                else {
                    codeGenerationSpinner.fail(`Process exited with code ${code}`);
                }
                await fsExtra.copy(`${tp("postgres")}/prisma.js`, "./src/lib/prisma.js");
            });
        }
        else {
            const mongodbProcess = exec(`${installCommand} mongoose`);
            mongodbProcess.on("exit", async (code) => {
                if (code === 0) {
                    codeGenerationSpinner.succeed("All done :)");
                }
                else {
                    codeGenerationSpinner.fail(`Process exited with code ${code}`);
                }
                await fsExtra.copy(`${tp("mongodb")}/mongodb.js`, "./src/lib/mongodb.js");
            });
        }
    });
}
init();
//# sourceMappingURL=index.js.map