import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {
    try {

        const userKey = req.user?._id || req.ip;

        const { success } = await ratelimit.limit(`my-rate-limit-${userKey}`);

        if(!success) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
    } catch (error) {
        console.error("Rate limit error: ", error);
        next(error);
    }
}

export default rateLimiter;