import { exec } from "node:child_process";
import JavaCodeCompilerService from "../api/JavaCodeCompilerService";
import FileHandlingClient from "../../client/FileHandlingClient";
import { CompileBody } from "../types/EndpointInputTypes";
import os from "node:os";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

export default class JavaCodeCompilerImpl implements JavaCodeCompilerService {
    async compile(body: CompileBody): Promise<boolean> {
        const tempDir = os.tmpdir();
        const inputFolderName = randomUUID();
        fs.mkdirSync(`${tempDir}/${inputFolderName}`);
        const folderContent = await FileHandlingClient.downloadFolderContent(
            "",
            body.inputFolderName
        )
        exec(
            `javac ${body.inputFolderName}/`
        )
        throw new Error("Method not implemented.");
    }
}