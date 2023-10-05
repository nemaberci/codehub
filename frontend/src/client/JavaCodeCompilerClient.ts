let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Compiles java source code
*/
class JavaCodeCompilerClient {
    static async compile(
        inputFolderName: string,
        entryPoint: string,
        outputFolderName: string,
        maxTime: number
    ): Promise<> {
        const answer = await fetch(
            `${url}/java_code_compiler/compile`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        inputFolderName, 
                        entryPoint, 
                        outputFolderName, 
                        maxTime, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default JavaCodeCompilerClient;