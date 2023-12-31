import "dotenv/config";

export const env = {
  port: Number(process.env.APP_PORT) || 3001,
  host: Number(process.env.APP_HOST) || "localhost",
  env: process.env.NODE_ENV || "development",
  secret: process.env.JWT_SECRET || "s3CrEtk3y",
  refresh: process.env.JWT_REFRESH || "R3frE5H",
  cloudinaryName: process.env.CLOUDINARY_NAME || "",
  cloudinaryKey: process.env.CLOUDINARY_KEY || "",
  cloudinarySecret: process.env.CLOUDINARY_SECRET || "",
  s3Access: process.env.S3_ACCESS_KEY || "",
  s3Secret: process.env.S3_SECRET_KEY || "",
  s3Region: process.env.S3_REGION || "",
};

export const database = {
  pgHost: process.env.PG_HOST || "localhost",
  pgPort: Number(process.env.PG_PORT) || 5432,
  pgUser: process.env.PG_USERNAME || "postgres",
  pgPass: process.env.PG_PASSWORD || "",
  pgDBName: process.env.PG_DBNAME || "ngekost",
};
