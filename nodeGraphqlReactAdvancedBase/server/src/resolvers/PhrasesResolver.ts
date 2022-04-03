import { ApolloError } from "apollo-server-express";
import { Phrases } from "entity/Phrases";
import { Arg, Mutation, Query } from "type-graphql";
// import { Storage } from "@google-cloud/storage";
// import { TranslationServiceClient } from "@google-cloud/translate";

export class PhrasesResolver {
    @Query(() => [Phrases])
    async getPhrases() {
        // const allPhrases = await Phrases.find();
        // const toTranslate = allPhrases.map((phrase) => phrase.phrase);

        // Imports the Google Cloud client library.
        // const { Storage } = require("@google-cloud/storage");

        return Phrases.find();

        /*
        const startAt = new Date();

        // Instantiates a client. If you don't specify credentials when constructing
        // the client, the client library will look for credentials in the
        // environment.
        // const storage = new Storage();
        // Makes an authenticated API request.
        // async function listBuckets() {
        //     try {
        //         const results = await storage.getBuckets();

        //         const [buckets] = results;

        //         console.log("Buckets:");
        //         buckets.forEach((bucket: any) => {
        //             console.log(bucket.name);
        //         });
        //     } catch (err) {
        //         console.error("ERROR:", err);
        //     }
        // }
        // listBuckets();

        const projectId = "langyboost";
        const location = "global";
        // const text = "Hello my friend. How do you feel my friend?";

        // Imports the Google Cloud Translation library
        // const { TranslationServiceClient } = require("@google-cloud/translate");

        // Instantiates a client
        const translationClient = new TranslationServiceClient();
        // (async function translateText() {
        // Construct request
        const request = {
            parent: `projects/${projectId}/locations/${location}`,
            contents: ["First phrase is always hard.", "Second is usually easier."],
            mimeType: "text/plain", // mime types: text/plain, text/html
            sourceLanguageCode: "en",
            targetLanguageCode: "de",
        };

        // Run request
        const [response] = await translationClient.translateText(request);

        if (response.translations) {
            for (const translation of response.translations) {
                console.log(`Translation: ${translation.translatedText}`);
            }
        } else {
            console.log("No response");
        }
        // });

        console.log(new Date().getTime() - startAt.getTime(), " : duration");
        */
    }

    @Mutation(() => Boolean)
    async createPhrase(@Arg("phrase") phrase: string) {
        const phraseExists = await Phrases.findOne({ where: { phrase } });

        if (phraseExists) return new ApolloError("The phrase already exists");

        try {
            await Phrases.insert({ phrase });
        } catch (error) {
            console.log("Upps, there was an error" + error);

            return false;
        }

        return true;
    }
}
