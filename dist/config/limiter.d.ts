declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler;
declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export { generalLimiter, authLimiter };
