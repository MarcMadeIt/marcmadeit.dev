import { getBlogs } from "../controllers/blog.control";

export default async (req, res) => {
    // Du kan behandle request-objektet her, hvis det er nødvendigt
    // ...

    // Kald controller-funktionen og send svar tilbage
    await getBlogs(req, res);
};