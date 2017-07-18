import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const IconsMatrixSchema = new mongoose.Schema({
  hotelID: {
    type: String,
    required: true
  },
  roomCategory: {
    type: String
  },
  roomName: {
    type: String
  },
  pax: {
    type: String,
    required: true,
  },
  icons: {
    type: Array
  },
  weight: {
    type: Number
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

  getByHotelPax(hotelID, pax) {
    return this.find({ hotelID, pax })
      .sort({ weight: 1 })
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
