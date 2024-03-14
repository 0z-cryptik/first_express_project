import { useState, useEffect } from "react";

export const Courses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = (await fetch("/api/courses"));
      const data = await response.json()
      console.log(data);
      setCourses(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (courses)
    return (
      <main className="ml-5">
        <h1 className="text-4xl mx-auto w-fit my-3">Available Courses</h1>
        {courses.map((course, i) => (
          <div key={i} className="mb-5">
            <h1 className="text-2xl">{course.title}</h1>
            <p>{course.description}</p>
            <p>{course.cost}$</p>
          </div>
        ))}
      </main>
    );
};
