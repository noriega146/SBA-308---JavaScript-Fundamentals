function getLearnerData(course, assignmentGroup, submissions) {
    try {
      // Validate the course ID
      if (course.id !== assignmentGroup.course_id) {
        throw new Error('AssignmentGroup course_id does not match CourseInfo id');
      }
  
      const currentDate = new Date();
      const learnerData = {};
  
      submissions.forEach(submission => {
        try {
          // Find the corresponding assignment for the current submission
          const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
          if (!assignment) {
            console.error(`Assignment with ID ${submission.assignment_id} not found`);
            return; // Skip this submission if assignment is not found
          }
  
          // Validate points_possible
          if (typeof assignment.points_possible !== 'number' || assignment.points_possible <= 0) {
            console.error(`Invalid points_possible for assignment ${assignment.id}`);
            return; // Skip this assignment if validation fails
          }
  
          const dueDate = new Date(assignment.due_at);
          if (dueDate > currentDate) return; // Skip assignments not yet due
  
          // Initialize learner data structure if it doesn't exist
          if (!learnerData[submission.learner_id]) {
            learnerData[submission.learner_id] = { id: submission.learner_id, scores: {}, totalScore: 0, totalPossible: 0 };
          }
  
          const learner = learnerData[submission.learner_id];
  
          // Validate score
          let score = submission.submission.score;
          if (typeof score !== 'number' || score < 0) {
            console.error(`Invalid score for submission by learner ${submission.learner_id} for assignment ${assignment.id}`);
            return; // Skip this submission if validation fails
          }
  
          // Apply late penalty if the submission was late
          if (new Date(submission.submission.submitted_at) > dueDate) {
            score -= assignment.points_possible * 0.1; // Deduct 10% of the total points possible
          }
          score = Math.max(0, score); // Ensure the score does not go negative
  
          // Calculate the percentage score for this assignment
          learner.scores[assignment.id] = score / assignment.points_possible;
          learner.totalScore += score; // Add to the learner's total score
          learner.totalPossible += assignment.points_possible; // Add to the total possible points
  
        } catch (error) {
          console.error('Error processing submission:', error.message);
        }
      });
  
      // Format the results into the required output structure
      const results = [];
      for (const learnerId in learnerData) {
        const learner = learnerData[learnerId];
        const result = { id: learner.id, avg: learner.totalScore / learner.totalPossible };
        for (const assignmentId in learner.scores) {
          result[assignmentId] = learner.scores[assignmentId];
        }
        results.push(result);
      }
  
      return results;
  
    } catch (error) {
      console.error('An error occurred while processing learner data:', error.message);
      return []; // Return an empty array if an error occurs
    }
  }
  
  // Sample Data
  const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  