const mongoose = require("mongoose");

const QuestionModel = require("../db/models/question-model");
const CourseModel = require("../db/models/course-model");

/**
 * Retrieve the list of all questions from a course
 * @returns {Promise<Array<Question>>} List of questions
 */
const getAllByCourse = (courseId) => {
  return QuestionModel.find({ course: courseId });
};

/**
 * Retrieve a question by its ID
 * @param {String} questionId Question ID
 * @returns {Promise<Question>} Question
 */
const getById = (questionId) => {
  return QuestionModel.findById(questionId);
};

/**
 * Create a new question in a specific course
 * @param {Question} question Question properties
 * @returns {Promise<Question>} Created question
 */
const create = async (courseId, question) => {
  const newQuestion = new QuestionModel({
    ...question,
    course: courseId,
  });

  await CourseModel.updateOne(
    { _id: courseId },
    { $addToSet: { questions: newQuestion._id } }
  );

  return newQuestion.save();
};

/**
 * Update a question
 * @param {String} questionId Question ID
 * @param {Object} partialQuestion Question properties to update
 * @returns {Promise<Question>} Updated question
 */
const update = async (questionId, partialQuestion) => {
  await QuestionModel.findOneAndUpdate(
    { _id: questionId },
    {
      $set: {
        ...partialQuestion,
      },
      upsert: true,
    }
  );

  return QuestionModel.findById(questionId);
};

/**
 * Delete a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 */
const remove = async (courseId, questionId) => {
  await CourseModel.updateOne(
    { _id: courseId },
    { $pull: { questions: questionId } }
  );
  await QuestionModel.deleteOne({ _id: questionId });
};


/**
 * Duplicate a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 * @returns {Promise<Question>} Duplicated question
 */
const duplicate = async (courseCode, questionId) => {
  // Récupérer la question originale
  const originalQuestion = await QuestionModel.findById(questionId);
  if (!originalQuestion) {
    throw new Error("Question not found");
  }

  // Verify if the course exist
  const course = await CourseModel.findOne({ code: courseCode });
  if (!course) {
    throw new Error("Course not found");
  }

  // Verify if the choices is an array before using .map()
  const choices = Array.isArray(originalQuestion.choices) ? originalQuestion.choices : [];

  // Create a new copie of the question by a new id
  const duplicatedQuestion = new QuestionModel({
    title: `${originalQuestion.title} (Copy)`,
    choices: choices.map(choice => ({
      ...choice,
      _id: new mongoose.Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    course: course._id, 
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Save the new question
  await duplicatedQuestion.save();

  // Add the duplicated question to the course
  await CourseModel.updateOne(
    { _id: course._id },
    { $addToSet: { questions: duplicatedQuestion._id } }
  );

  return duplicatedQuestion;
};



module.exports = {
  getAllByCourse,
  getById,
  create,
  update,
  remove,
  duplicate,
};
