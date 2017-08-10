import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const TriggerSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  value: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



/**
 * Statics
 */
TriggerSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((trigger) => {
        if (trigger) {
          return trigger;
        }
        const err = new APIError('No such trigger exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('Trigger', TriggerSchema);
