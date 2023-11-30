import { Solution } from "../../client/returnedTypes";
import SolutionService from "../api/SolutionService";
import { SolveBody } from "../types/EndpointInputTypes";
import FileHandlingClient from '../../client/FileHandlingClient';
import { sign } from "jsonwebtoken";
import { exec } from "child_process";
import { randomUUID } from "crypto";

export default class SolutionImpl implements SolutionService {
    async solve(body: SolveBody): Promise<Solution> {

        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY, 
            "internal-keys", 
            "private2.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        let token = sign({}, text, { expiresIn: "1h", algorithm: "RS256" });
        let folderName = randomUUID().toString();

        const command = `kubectl run builder-test --image=europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/micro-service-builder --env="FILE_HANDLER_URL=${
            (process.env as any).FILE_HANDLING_API_URL
        }" --env="TOKEN=${
            token
        }" --env="ENTRY_POINT=${
            body.solutionSource.entryPointFileLocation
        }" --env="SOURCE_FOLDER_NAME=${
            body.solutionSource.sourceFileLocations[0] // todo: fix this, why is it an array
        }" --env="EXECUTABLE_FOLDER_NAME=${
            folderName
        }"`;

        exec(command);
        console.log(command);

        return {
            id: folderName
        };

    }

}