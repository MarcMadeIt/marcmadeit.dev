import { connectToMongo } from "./index.js";


export default async function handler(controllerFunction) {
    return async function (req, res) {
        try {
            // Ensure MongoDB connection before handling the request
            await connectToMongo();

            // Execute the main controller function
            await controllerFunction(req, res);
        } catch (error) {
            console.error(`Error in ${controllerFunction.name}:`, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}