import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  certificate: String,
  issuer: String,
  description: String,
});

const Certificate = mongoose.model("Certificate", CertificateSchema);
export default Certificate;
