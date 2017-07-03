import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const IconsMatrixSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true
  },
  matrixType: {
    type: String,
    required: true
  },
  matrix: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

IconsMatrixSchema.method({
});

/**
 * Statics
 */
IconsMatrixSchema.statics = {

  getByHotel(hotelId) {
    return this.find({ hotelId })
      .exec()
      .then((iconsMatrix) => {
        if (iconsMatrix) {
          return iconsMatrix;
        }
        return null;
      });
  }

  // /**
  //  * List rules in descending order of 'createdAt' timestamp.
  //  * @param {number} skip - Number of rules to be skipped.
  //  * @param {number} limit - Limit number of rules to be returned.
  //  * @returns {Promise<Rule[]>}
  //  */
  // list({ skip = 0, limit = 50 } = {}) {
  //   return this.find()
  //     .sort({ createdAt: -1 })
  //     .skip(+skip)
  //     .limit(+limit)
  //     .exec();
  // }
};

/**
 * @typedef Rule
 */
export default mongoose.model('IconsMatrix', IconsMatrixSchema);
