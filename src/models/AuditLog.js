import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      default: 'admin@example.com',
    },
    action: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: String,
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    details: String,
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
