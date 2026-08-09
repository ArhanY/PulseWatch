const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    apiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Api',
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

incidentSchema.index({ apiId: 1, status: 1 });

incidentSchema.pre('save', function syncStatus(next) {
  if (this.resolvedAt) {
    this.status = 'resolved';
    if (this.duration == null) {
      this.duration = this.resolvedAt.getTime() - this.startedAt.getTime();
    }
  } else {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Incident', incidentSchema);
