import { useState, useEffect, useCallback, useRef } from "react";
import { StudentService } from "../services/studentService";
import type { Student, StudentDetail } from "../types";

export const useStudents = (initialPage = 1, initialLimit = 10) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // CRUD operation states
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentDetail | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const searchRef = useRef(search);
  const lastFetched = useRef({ page: 0, search: "" });

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchStudents = useCallback(async (targetPage: number, query: string, force = false) => {
    if (!force && lastFetched.current.page === targetPage && lastFetched.current.search === query) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await StudentService.getStudents(targetPage, initialLimit, query);
      setStudents(data.students);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
      lastFetched.current = { page: data.page, search: query };
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to retrieve student records.");
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit]);

  // Fetch when page changes
  useEffect(() => {
    fetchStudents(page, searchRef.current);
  }, [page, fetchStudents]);

  // Watch search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchStudents(1, search);
    }, 300); // debounce search query
    return () => clearTimeout(timer);
  }, [search, fetchStudents]);

  const loadStudentDetail = async (id: number) => {
    setIsFormLoading(true);
    setError(null);
    try {
      const data = await StudentService.getStudentById(id);
      setSelectedStudentDetail(data);
      return data;
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load student details.");
      return null;
    } finally {
      setIsFormLoading(false);
    }
  };

  const createStudent = async (data: Omit<StudentDetail, "id">) => {
    setIsFormLoading(true);
    setError(null);
    try {
      await StudentService.createStudent(data);
      setSuccessMessage("Student successfully registered!");
      fetchStudents(1, search, true);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to register student.");
      return false;
    } finally {
      setIsFormLoading(false);
    }
  };

  const updateStudent = async (id: number, data: Omit<StudentDetail, "id">) => {
    setIsFormLoading(true);
    setError(null);
    try {
      await StudentService.updateStudent(id, data);
      setSuccessMessage("Student records successfully updated!");
      fetchStudents(page, search, true);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to update student records.");
      return false;
    } finally {
      setIsFormLoading(false);
    }
  };

  const deleteStudent = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await StudentService.deleteStudent(id);
      setSuccessMessage("Student record deleted successfully.");
      const isLastItemOnPage = students.length === 1;
      const targetPage = isLastItemOnPage && page > 1 ? page - 1 : page;
      fetchStudents(targetPage, search, true);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to delete student record.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    students,
    total,
    page,
    totalPages,
    search,
    setSearch,
    isLoading,
    error,
    successMessage,
    selectedStudentDetail,
    setSelectedStudentDetail,
    isFormLoading,
    fetchStudents,
    loadStudentDetail,
    createStudent,
    updateStudent,
    deleteStudent,
    clearMessages,
    setPage
  };
};
