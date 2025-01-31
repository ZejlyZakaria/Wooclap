import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseDetails } from "../../api-services/courses.api-service";  
import { duplicateCourseQuestion } from "../../api-services/courses.api-service"
import { Course } from "../../models/course.model";
import { Question } from "../../models/question.model";
import EditQuestionsModal from "../questions/EditQuestionsModal";
import "./style.css";

export const CourseDetails = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    async function getCourseDetails() {
      try {
        if (!code) {
          setError("Course code is missing");
          return;
        }
        const courseDetails = await fetchCourseDetails(code);
        setCourse(courseDetails);
      } catch {
        setError("Failed to fetch course details");
      }
    }

    getCourseDetails();
  }, [code]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  // Extract courseId
  const courseId = course?.code; 

  // Fonction to handle the modal closing
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    setCourse((prevCourse) => {
      if (!prevCourse) return null;
      const updatedQuestions = prevCourse.questions.map((q) =>
        q._id === updatedQuestion._id ? updatedQuestion : q
      );
      return { ...prevCourse, questions: updatedQuestions };
    });
    setIsModalOpen(false);
  };

  // Fonction to duplicate the question
  const handleDuplicateQuestion = async (questionId: string) => {
    try {
      if (!courseId) {
        setError("Course ID is missing");
        return;
      }
  
      // Call API
      const duplicatedQuestion = await duplicateCourseQuestion(courseId, questionId);
      
      if (!duplicatedQuestion) {
        setError("Failed to duplicate question");
        return;
      }
  
      setCourse((prevCourse) => {
        if (!prevCourse) return null;
  
        return {
          ...prevCourse,
          questions: [...prevCourse.questions, duplicatedQuestion], 
        };
      });
    } catch (error) {
      console.error("Error during duplication:", error);
      setError("Failed to duplicate question");
    }
  };
  

  return (
    <div className="container">
      <div> 
        <div className="header">
          <button onClick={() => navigate("/courses")}>
            Back to Courses
          </button>
          <div className="title_1">{course.title}</div>
        </div>
        <div className="title_2">Description</div>
        <div className="desc">{course.description}</div>
        <div className="title_2">Questions:</div>
        {course.questions.length > 0 ? (
          <div>
            {course.questions.map((question, index) => (
              <div
                className="question"
                key={question._id}
              >
                <div onClick={() => handleQuestionClick(question)}>
                  <strong>{index + 1} .</strong> {question.title}
                </div>
                <div className="duplicate_btn" onClick={() => handleDuplicateQuestion(question._id)}>
                  Duplicate
                </div>        
              </div>
              
            ))}
          </div>
        ) : (
          <p>No questions available.</p>
        )}
      </div>
      {/* Affichage du modal */}
      <EditQuestionsModal
        visible={isModalOpen}
        question={selectedQuestion}
        onClose={handleModalClose}
        onSave={handleSaveQuestion}
        courseId={courseId} // ✅ On passe bien courseId
      />
    </div>
  );
};
