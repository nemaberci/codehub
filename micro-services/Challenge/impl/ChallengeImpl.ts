import { Challenge } from "../../client/returnedTypes";
import { UploadBody } from "../types/EndpointInputTypes";
import ChallengeService from "../api/ChallengeService";
import {Firestore} from "@google-cloud/firestore";

const firestore = new Firestore({
    projectId:"codehub-400314"
});

export default class ChallengeImpl implements ChallengeService {
    async upload(body: UploadBody): Promise<Challenge> {
        const document = firestore.doc('Challenge/'+Math.ceil(Math.random()*1000)); //TODO

        // Enter new data into the document.
        await document.set({
           name: body.name,
           description: body.description,
           short_descripton: body.shortDescription
        });
        console.log('Entered new data into the document');

        // Update an existing document.
        /*await document.update({
            body: 'My first Firestore app',
        });
        console.log('Updated an existing document');

        // Read the document.
        const doc = await document.get();
        console.log('Read the document');

        // Delete the document.
        await document.delete();
        console.log('Deleted the document');*/

        return {id:"0"} // TODO
    }
}