import React, {useState} from "react"

export function FeedbackForm() {
  const [toolName, setToolName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [timeSaved, setTimeSaved] = useState('');
  const [overallRating, setOverallRating] = useState('');

  const handleToolNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToolName(event.target.value);
  };

  const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDescription(event.target.value);
  };

  const handleTimeSavedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeSaved(event.target.value);
  };

  const handleOverallRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverallRating(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Tool Name:', toolName);
    console.log('Task Description:', taskDescription);
    console.log('Time Saved:', timeSaved);
    console.log('Overall Rating:', overallRating);
  };

  return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="toolName">Which tool are you reviewing?</label>
          <select id="toolName" value={toolName} onChange={handleToolNameChange}>
            <option value="ChatGPT">ChatGPT</option>
            <option value="CoPilot">GitHub Copilot</option>
          </select>
        </div>
        <div>
          <label htmlFor="taskDescription">Task description:</label>
          <textarea id="taskDescription" value={taskDescription} onChange={handleTaskDescriptionChange}/>
        </div>
        <div>
          <label htmlFor="timeSaved">How much time was saved?</label>
          <select id="timeSaved" value={timeSaved} onChange={handleTimeSavedChange}>
            <option value="">Select time saved</option>
            <option value="3">A few seconds</option>
            <option value="50">About a minute</option>
            <option value="150">A few minutes</option>
            <option value="500">Five Minutes</option>
            <option value="900">Quarter of an hour</option>
            <option value="1800">Half an hour</option>
            <option value="3600">About an hour</option>
            <option value="5000">More than an hour</option>
          </select>
        </div>
        <div>
          <label htmlFor="overallRating">Overall rating of interaction:</label>
          <div id="overallRating">
            <label>
              <input type="radio" name="overallRating" value="angry" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="angry">😠</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="sad" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="sad">😔</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="annoyed" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="annoyed">😒</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="neutral" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="neutral">😐</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="mildly pleased"
                     onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="mildly pleased">🙂</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="happy" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="happy">😃</span>
            </label>
            <label>
              <input type="radio" name="overallRating" value="joyful" onChange={handleOverallRatingChange}/>
              <span role="img" aria-label="joyful">😍</span>
            </label>
          </div>
        </div>
      </form>
  );
}