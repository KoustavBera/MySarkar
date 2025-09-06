// models/AllScheme.js
import mongoose from "mongoose";

const allSchemeSchema = new mongoose.Schema({}, { strict: false });
// `strict: false` → keeps your existing MongoDB flexible structure

export default mongoose.model("AllScheme", allSchemeSchema, "all_schemes");
// the third param ensures it points to collection "all_schemes"
