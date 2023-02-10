const DiscordDatabase = require("discord-cloud-database");
const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const openai = require("./openai");
require("dotenv").config();

// const delay = (time) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// };
const timeGreen = () => {
  return chalk.green(moment().format("HH:mm:ss"));
};
const timeRed = () => {
  return chalk.red(moment().format("HH:mm:ss"));
};

(async () => {
  const project = process.argv[2];
  console.log(`
++++++++++++++++++++++++++++++++++++++++++++++++
+ BOT AMA DISCORD OpenAI | Support Multi Akun  +
================================================
+ Author: M Khoirul Risqi                      +
+ Github: https://github.com/risqikhoirul      +
++++++++++++++++++++++++++++++++++++++++++++++++
  `);
  while (true) {
    const modulesToCheck = ["discord-cloud-database", "moment", "chalk", "axios", "dotenv"];

    for (const moduleName of modulesToCheck) {
      const modulePath = path.join(__dirname, "node_modules", moduleName);

      if (!fs.existsSync(modulePath)) {
        console.error(`Error: ${moduleName} is not installed. Please run "npm install ${moduleName}" or "npm install" and try again.`);
        process.exit(1);
      }
    }

    const Token = fs.readFileSync("outoken.txt", "utf-8").split("\n");

    let i = 0;
    while (i < Token.length) {
      const token = Token[i].trim();
      i++;
      const randomMsg = await openai(`make one question ama about ${project} crypto project`);
      const discordDatabase = new DiscordDatabase(token, { risqi: process.env.CHANNEL_ID });

      try {
        const readSend = await discordDatabase.insertOne(randomMsg, { name: "risqi" });

        const readSendMsg = await discordDatabase.findOne(readSend.id, { name: "risqi" });

        const usr = chalk.yellow(`${readSendMsg.author.username}#${readSendMsg.author.discriminator}`);
        console.log(`[ ${timeGreen()} ] [${usr}] Send Messege: ${readSendMsg.content}`);
      } catch (error) {
        if (error.error.discordError === true) {
          const usr = chalk.red("Token Failed");
          console.log(`[ ${timeRed()} ] [${usr}] Please Check Token!!!`);
        } else {
          console.error(error);
        }
      }
    }
    break;
  }
})();
