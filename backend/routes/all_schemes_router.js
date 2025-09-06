import express from "express";
import {
	getAllSchemes_all,
	getSchemeById_all,
	createScheme_all,
	updateScheme_all,
	deleteScheme_all,
} from "../controllers/scheme.controller.js";

const all_schemes_router = express.Router();

all_schemes_router.get("/", getAllSchemes_all);
all_schemes_router.get("/:id", getSchemeById_all);
all_schemes_router.post("/", createScheme_all);
all_schemes_router.put("/:id", updateScheme_all);
all_schemes_router.delete("/:id", deleteScheme_all);

export default all_schemes_router;
