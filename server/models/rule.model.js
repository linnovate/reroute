import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Rule Schema
 */
const RuleSchema = new mongoose.Schema({
  name: {
    type: String
  },
  ruleObj: {
    type: Object
  },
  priority: {
    type: Number
  },
  _on: {
    type: Boolean
  },
  condition: {
    type: String,
    required: true
  },
  consequence: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
RuleSchema.method({
});

/**
 * Statics
 */
RuleSchema.statics = {
  /**
   * Get rule
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Rule, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((rule) => {
        if (rule) {
          return rule;
        }
        const err = new APIError('No such rule exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List rules in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of rules to be skipped.
   * @param {number} limit - Limit number of rules to be returned.
   * @returns {Promise<Rule[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Rule
 */
export default mongoose.model('Rule', RuleSchema);
