import { getCourseData } from "@/app/lib/data";
import Course, { PopulatedCourse } from "@/components/ui/Course";
import { LoadingPage } from "@/components/ui/loading-spinner";

import { Suspense } from "react";


const CoursePage = async( {params}: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await params;
  
  const course : PopulatedCourse  = JSON.parse(await getCourseData(courseId));
  // const [course, setCourse] = React.useState<{
  //   courseName: string
  //   description: string
  //   createdAt: Date
  //   learners: { 
  //     _id: Types.ObjectId;
  //     learnerName: string; 
  //     username: string }[]
  // }>({
  //   courseName: '',
  //   description: '',
  //   createdAt: new Date(),
  //   learners: []
  // });



  
  

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">Course ID is missing</p>
        </div>
      </div>
    )
  }
  
  return (
    <Suspense fallback={<LoadingPage/>}>
      <Course course={course} />
    </Suspense>
  );
}

export default CoursePage