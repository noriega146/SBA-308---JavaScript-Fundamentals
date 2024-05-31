JavaScript Fundamentals

Github: https://github.com/noriega146/SBA-308---JavaScript-Fundamentals

Description: 

Script analizes,gather and processes learner submission data. The script processes this data and outputs an array of objects, 
each containing the "id": number, "avg": number, and the <assignment_id>: number.

If an AssignmentGroup does not belong to its course (mismatching course_id) script thorws an error. Other data validation occurs within the program.
Accounts for ther potential erros in data. EX. point_possible cannot equal 0 cannot divide by zero. 
Try/catch is used to handle these errors. 
If assignment not due its not included in avg.  
If submitted_at is past_due 10% percent is deducted from total point_possible
