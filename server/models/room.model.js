import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const RoomSchema = new mongoose.Schema({
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
  weight: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



/**
 * Statics
 */
RoomSchema.statics = {

  getByHotel(hotelID) {
    return this.find({ hotelID })
      .sort({ weight: 1 })
      .exec()
      .then((iconsMatrix) => {
        if (iconsMatrix) {
          return iconsMatrix;
        }
        return null;
      });
  },

  get(id) {
    return this.findById(id)
      .exec()
      .then((room) => {
        if (room) {
          return room;
        }
        const err = new APIError('No such room exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

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
export default mongoose.model('Room', RoomSchema);
