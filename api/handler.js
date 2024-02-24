export default async function handler(controllerFunction) {
    return async function (req, res) {
        try {
            await controllerFunction(req, res);
        } catch (error) {
            console.error(`Error in ${controllerFunction.name}:`, error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}