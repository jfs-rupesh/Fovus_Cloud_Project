

import * as s3 from "@aws-cdk/aws-s3";
import { LambdaUtils } from "./LambdaUtils";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const scriptFileName = "script.py"; // Change to the name of your script file
const scriptFolderPath="scripts/"
const scriptFilePath = path.join(scriptFolderPath, scriptFileName);

console.log(scriptFilePath);

if (fs.existsSync(scriptFilePath)) {

    console.log("exists")
} else {
  console.error(`Script file '${scriptFileName}' not found.`);
}