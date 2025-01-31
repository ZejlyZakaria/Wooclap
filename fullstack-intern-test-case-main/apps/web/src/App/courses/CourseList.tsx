import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import { fetchCourses, searchCourses } from '../../api-services/courses.api-service';
import { Course } from "../../models/course.model";
import { DataType } from "../../models/data-type.model";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import * as S from './CourseList.styles'

type CourseListItem = DataType<Pick<Course, 'code'>>

const columns: ColumnsType<CourseListItem> = [
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  // Step 1 - add a description // add the description as the third column
  {
    title: 'Description', 
    dataIndex: 'description', 
    key: 'description', 
  }
];

function transformCoursesToDatasource(courses: Course[]): CourseListItem[] {
  if (Array.isArray(courses)) {
    return courses.map(course => ({
      key: course.code,
      code: course.code,
      title: course.title,
      description: course.description, // // Step 1 - add a description
    }));
  } else {
    console.error('Invalid courses data:', courses);
    return []; // Retourne un tableau vide si `courses` n'est pas un tableau
  }
}


export const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesDataSource, setCoursesDataSource] = useState<CourseListItem[]>([]);
  //
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function getCourses() {
      try {
        const coursesPayload = await fetchCourses();
        console.log('Fetched courses:', coursesPayload); // Log de la réponse
        setCourses(coursesPayload);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]); // En cas d'erreur, assurez-vous que `courses` est un tableau vide
      }
    }
    getCourses();
  }, []);
  

  useEffect(() => {
    setCoursesDataSource(transformCoursesToDatasource(courses));
  }, [courses]);

  function handleCourseClick(course: CourseListItem) {
    navigate(`./${course.code}`);
  }

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.trim() === "") {
          // Si la recherche est vide, charger tous les cours
          const allCourses = await fetchCourses();
          console.log('All courses fetched:', allCourses);
          setCourses(allCourses);
        } else {
          // Sinon, effectuer une recherche
          const searchedCourses = await searchCourses(query);
          console.log('Searched courses:', searchedCourses);
          setCourses(searchedCourses);
        }
      }, 300),
    []
  );
  

  // Gérer l'entrée utilisateur et déclencher la recherche débouncée
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query); // Appeler la fonction débouncée
  };

  // Nettoyer la fonction débouncée pour éviter les appels inutiles
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <S.Wrapper>
      {/* Uncomment the following code for step 6 and implement the missing parts to enable search */}
      <S.SearchInput
        defaultValue={searchQuery}
        onChange={handleSearchChange}
        placeholder='Search for a course by ID or name'
        prefix={<S.SearchIcon icon={faSearch} />}
      />

      <Card>
        <Table
          columns={columns}
          dataSource={coursesDataSource}
          onRow={course => ({
            onClick: () => handleCourseClick(course),
          })}
          scroll={{ y: '80vh' }}
        />
      </Card>
    </S.Wrapper>
  );
};
