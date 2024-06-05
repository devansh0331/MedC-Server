import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  certificate: String,
  issuer: String,
  description: String,
});

const Certificate = mongoose.model("Certificate", CertificateSchema);
export default Certificate;
