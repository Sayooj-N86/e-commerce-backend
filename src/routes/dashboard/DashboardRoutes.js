import express from "express";
import dashboardPrivateRouter from "./DashBoardPrivateRoutes.js";

const dashboardRoutes = express.Router()

dashboardRoutes.use(dashboardPrivateRouter);

export default dashboardRoutes;