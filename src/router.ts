import Router from "koa-router";
import { inbound } from "./controllers/inboundController";
import { healthCheck } from "./controllers/healthCheckController";
import { outbound } from "./controllers/outboundController";
import { auth } from "./middlewares/authController";
import { validation } from "./middlewares/validationController";

const router = new Router();

// Health Checks
router.get("/", healthCheck);
// Inbound
router.post("/inbound/sms", auth, validation, inbound);
// Outbound
router.post("/outbound/sms", auth, validation, outbound);

export default router;
