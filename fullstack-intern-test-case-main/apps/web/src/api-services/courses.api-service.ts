// courses.api-service.ts

import { Course } from "../models/course.model";
import { Question } from "../models/question.model";

// Fetch all courses
export async function fetchCourses() {
  const res = await fetch("http://localhost:3000/api/courses");

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    return data as Course[];
  } else {
    console.error("Fetched data is not an array:", data);
    return [];
  }
}

// Search courses by query
export async function searchCourses(query: string) {
  const res = await fetch(
    `http://localhost:3000/api/courses/search?query=${query}`
  );

  if (!res.ok) {
    throw new Error("Failed to search courses");
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    return data as Course[];
  } else {
    console.error("Search result is not an array:", data);
    return [];
  }
}

// Fetch course details by code
export async function fetchCourseDetails(code: string) {
  const res = await fetch(`http://localhost:3000/api/courses/${code}`);

  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }

  return res.json() as Promise<Course>;
}

// Fetch all questions for a specific course
export async function fetchCourseQuestions(courseId: string) {
  const res = await fetch(
    `http://localhost:3000/api/courses/${courseId}/questions`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  const data = await res.json();

  if (Array.isArray(data)) {
    return data as Question[];
  } else {
    console.error("Fetched questions data is not an array:", data);
    return [];
  }
}

// Update a specific question in a course
export async function updateCourseQuestion(
  courseId: string,
  questionId: string,
  updatedData: Partial<Question>
) {
  const res = await fetch(
    `http://localhost:3000/api/courses/${courseId}/questions/${questionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update the question");
  }

  return res.json() as Promise<Question>;
}

// Add a new question to a course
export async function addCourseQuestion(
  courseId: string,
  newQuestionData: Partial<Question>
) {
  const res = await fetch(
    `http://localhost:3000/api/courses/${courseId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestionData),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add a new question");
  }

  return res.json() as Promise<Question>;
}

// Delete a specific question from a course
export async function deleteCourseQuestion(courseId: string, questionId: string) {
  const res = await fetch(
    `http://localhost:3000/api/courses/${courseId}/questions/${questionId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete the question");
  }

  return res.json();
}

// Duplicate a specific question in a course
export async function duplicateCourseQuestion(
  courseId: string,
  questionId: string
) {
  try {
    // Appel API pour dupliquer la question
    const res = await fetch(
      `http://localhost:3000/api/courses/${courseId}/questions/${questionId}/duplicate`,  // Route correcte
      {
        method: "POST",  // Utilise POST pour ajouter une nouvelle question
      }
    );

    if (!res.ok) {
      throw new Error("Failed to duplicate the question");
    }

    return res.json() as Promise<Question>;  // Retourne la question dupliquée
  } catch (error) {
    console.error("Error duplicating the question:", error);
    throw error;
  }
}


