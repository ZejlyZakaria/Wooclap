import React, { useState, useEffect } from "react";
import "./EditQuestionsModal.css";
import { Question, Choice } from "../../models/question.model";


interface EditQuestionsModalProps {
  visible: boolean;
  question: Question | null; 
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void; 
  courseId: string;
}

const EditQuestionsModal: React.FC<EditQuestionsModalProps> = ({
  visible,
  question,
  onClose,
  onSave,
  courseId, 
}) => {
  const [title, setTitle] = useState<string>("");
  const [choices, setChoices] = useState<Choice[]>([]);

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setChoices(question.choices);
    }
  }, [question]);

  const handleChoiceChange = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean 
  ) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = {
      ...updatedChoices[index],
      [field]: value,
    };
    setChoices(updatedChoices);
  };
  


  const handleRemoveChoice = (index: number) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    setChoices(updatedChoices);
  };



  const handleSave = async () => {
    if (!question) return;
  
    const updatedQuestion = {
      title,
      choices,
    };
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/courses/${courseId}/questions/${question._id}`, 
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      onSave(data); 
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };
  
  

  if (!visible || !question) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-top">
        <h2>Edit Question</h2>
        <label className="title">
          <strong>Title:</strong>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title"
          />
        </label>
        <div className="choices-section">
          <h3>Choices:</h3>
          {choices.map((choice, index) => (
            <div key={choice._id} className="choice-item">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, "text", e.target.value)}
                placeholder={`Choice ${index + 1}`}
              />
              <div className="correct-remove">
                <label className="checkbox"> 
                  <input         
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={(e) => handleChoiceChange(index, "isCorrect", e.target.checked)}
                  />
                  <span>Correct</span>
                </label>
                <button onClick={() => handleRemoveChoice(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))} 
        </div>
        </div>
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionsModal;
