import { useState, useEffect } from "react";
import { StudentService } from "../services/studentService";
import type { AnalyticsResponse } from "../types";

export const useAnalytics = (initialStudentId: number | null = null) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(initialStudentId);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStudentId === null) {
      setAnalyticsData(null);
      return;
    }

    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await StudentService.getStudentAnalytics(selectedStudentId);
        setAnalyticsData(data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to retrieve student performance analytics.");
        setAnalyticsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedStudentId]);

  return {
    selectedStudentId,
    setSelectedStudentId,
    analyticsData,
    isLoading,
    error
  };
};
