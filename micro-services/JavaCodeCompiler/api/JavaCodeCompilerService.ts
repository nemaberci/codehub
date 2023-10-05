import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface JavaCodeCompilerService {
    compile(body: EndpointInputTypes.CompileBody): Promise<EndpointReturnedTypes.CompileReturned>
}