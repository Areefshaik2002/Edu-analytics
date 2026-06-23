import api from "./api";
import type { Student, StudentDetail, StudentListResponse, AnalyticsResponse } from "../types";

export class StudentService {
  static async getStudents(page: number, limit: number, search?: string): Promise<StudentListResponse> {
    const response = await api.get<StudentListResponse>("/students", {
      params: { page, limit, search }
    });
    return response.data;
  }

  static async getStudentById(id: number): Promise<StudentDetail> {
    const response = await api.get<StudentDetail>(`/students/${id}`);
    return response.data;
  }

  static async createStudent(data: Omit<StudentDetail, "id">): Promise<Student> {
    const response = await api.post<Student>("/students", data);
    return response.data;
  }

  static async updateStudent(id: number, data: Omit<StudentDetail, "id">): Promise<Student> {
    const response = await api.put<Student>(`/students/${id}`, data);
    return response.data;
  }

  static async deleteStudent(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/students/${id}`);
    return response.data;
  }

  static async getStudentAnalytics(id: number): Promise<AnalyticsResponse> {
    const response = await api.get<AnalyticsResponse>(`/students/${id}/analytics`);
    return response.data;
  }
}
