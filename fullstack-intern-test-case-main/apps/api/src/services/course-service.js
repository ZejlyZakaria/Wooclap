const CourseModel = require("../db/models/course-model");

/**
 * Retrieve the list of all courses
 * @returns {Promise<Array<Course>>} List of courses
 */
const getAll = () => {
  return CourseModel.find({}).select("code title description"); // Step 2 - hide unnecessary data
};

/**
 * Retrieve a course by its ID
 * @param {String} courseId Course ID
 * @returns {Promise<Course>} Course
 */
const getById = (courseId) => {
  return CourseModel.findById(courseId);
};

/**
 * Retrieve a course by its code
 * @param {String} courseCode Course code
 * @returns {Promise<Course>} Course
 */
const getByCode = (courseCode) => {
  return CourseModel.findOne({ code: courseCode });
};

/**
 * Create a new course
 * @param {Course} course Course properties
 * @returns {Promise<Course>} Created course
 */
const create = (course) => {
  const newCourse = new CourseModel({
    ...course,
  });

  return newCourse.save();
};

/**
 * Update a course
 * @param {String} courseId Course ID
 * @param {Object} partialCourse Course properties to update
 * @returns {Promise<Course>} Updated course
 */
const update = async (courseId, partialCourse) => {
  await CourseModel.findOneAndUpdate(
    { _id: courseId },
    {
      $set: {
        ...partialCourse,
      },
      upsert: true,
    }
  );

  return CourseModel.findById(courseId);
};

/**
 * Delete a course
 * @param {String} courseId Course ID
 */
const remove = async (courseId) => {
  await CourseModel.deleteOne({ _id: courseId });
};

/**
 * Search for courses by code or title
 * @param {String} query Search query
 * @returns {Promise<Array<Course>>} 
 * */
const search = async (query) => {
  const regex = new RegExp(query, "i"); 
  return CourseModel.find({
    $or: [{ code: regex }, { title: regex }],
  });
};

/**
 * Get course by code
 * @param {String} code Course code
 * @returns {Promise<Course>} Course
 * */
const getCourseByCode = async (code) => {
  return CourseModel.findOne({ code });
};

module.exports = {
  getAll,
  getById,
  getByCode,
  create,
  update,
  remove,
  search,
  getCourseByCode,
};
