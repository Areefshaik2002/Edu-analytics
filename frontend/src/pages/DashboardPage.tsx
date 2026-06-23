import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { useAnalytics } from "../hooks/useAnalytics";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const {
    students,
    total,
    page,
    totalPages,
    search,
    setSearch,
    isLoading,
    successMessage,
    deleteStudent,
    clearMessages,
    setPage
  } = useStudents(1, 10);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { analyticsData, setSelectedStudentId, isLoading: isAnalyticsLoading } = useAnalytics();
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "students">(
    location.hash === "#students" ? "students" : "dashboard"
  );
  const studentTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash === "#students") {
      setActiveTab("students");
      setTimeout(() => {
        studentTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      setActiveTab("dashboard");
    }
  }, [location.hash]);

  const handleSelectStudent = (student: any) => {
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent(null);
      setSelectedStudentId(null);
    } else {
      setSelectedStudent(student);
      setSelectedStudentId(student.id);
    }
  };
  const getStats = () => {
    if (students.length === 0) {
      return { classAverage: 81.4, topSubject: "English", passRate: 96.2 };
    }
    
    let totalScore = 0;
    let passCount = 0;
    let subjectTotals = { Telugu: 0, Hindi: 0, English: 0, Social: 0 };
    
    students.forEach((s: any) => {
      const studentAvg = (s.teluguAverage + s.hindiAverage + s.englishAverage + s.socialStudiesAverage) / 4;
      totalScore += studentAvg;
      if (studentAvg >= 60) {
        passCount++;
      }
      subjectTotals.Telugu += s.teluguAverage;
      subjectTotals.Hindi += s.hindiAverage;
      subjectTotals.English += s.englishAverage;
      subjectTotals.Social += s.socialStudiesAverage;
    });

    const classAverage = Math.round((totalScore / students.length) * 10) / 10;
    const passRate = Math.round((passCount / students.length) * 1000) / 10;
    
    let topSubject = "Telugu";
    let maxAvg = subjectTotals.Telugu;
    if (subjectTotals.Hindi > maxAvg) { topSubject = "Hindi"; maxAvg = subjectTotals.Hindi; }
    if (subjectTotals.English > maxAvg) { topSubject = "English"; maxAvg = subjectTotals.English; }
    if (subjectTotals.Social > maxAvg) { topSubject = "Social Studies"; maxAvg = subjectTotals.Social; }

    return { classAverage, topSubject, passRate };
  };

  const stats = getStats();
  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      const success = await deleteStudent(studentToDelete.id);
      if (success) {
        if (selectedStudent && selectedStudent.id === studentToDelete.id) {
          setSelectedStudent(null);
          setSelectedStudentId(null);
        }
        setStudentToDelete(null);
      }
    }
  };

  // Helper function to build Chart.js configuration matching Stitch specifications
  const getChartData = (label: string, dataPoints: number[], color: string): ChartData<"line"> => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return {
      labels: months,
      datasets: [
        {
          label: label,
          data: dataPoints,
          borderColor: color,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: color,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "transparent";
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, `${color}20`); // 10-15% opacity
            gradient.addColorStop(1, `${color}00`); // 0% opacity
            return gradient;
          }
        }
      ]
    };
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0b1c30",
        titleFont: { family: "Inter", size: 11 },
        bodyFont: { family: "Inter", size: 12, weight: "bold" },
        padding: 8,
        cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Inter", size: 10 }, color: "#464555" }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "#e2dfff30" },
        ticks: { font: { family: "Inter", size: 10 }, color: "#464555", stepSize: 20 }
      }
    }
  };

  return (
    <div className="bg-background text-on-surface flex h-screen w-screen overflow-hidden relative">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 bottom-0 flex flex-col p-stack-md bg-surface-container-lowest border-r border-outline-variant w-sidebar-width z-50 transition-all duration-300 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col gap-stack-md flex-1">
          <div className="flex items-center gap-stack-sm mb-stack-lg px-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-[18px] font-bold text-primary">EduAnalytics</span>
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">SaaS Platform</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => {
                setActiveTab("dashboard");
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/");
              }}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95 duration-100 ${
                activeTab === "dashboard"
                  ? "text-primary bg-surface-container font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("students");
                navigate("/#students");
                studentTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95 duration-100 ${
                activeTab === "students"
                  ? "text-primary bg-surface-container font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined">group</span>
              <span className="font-label-md text-label-md">Student Management</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-background/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area Wrapper */}
      <div className="flex-1 lg:ml-sidebar-width flex flex-col h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-surface border-b border-outline-variant z-30">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-container-max mx-auto">
            
            {/* Hamburger for mobile & Search */}
            <div className="flex items-center gap-4 flex-1">
              <button 
                className="lg:hidden p-2 hover:bg-surface-container rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              
              <div className="relative w-full max-w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-md font-body-md transition-all"
                  placeholder="Search students by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => logout()}
                className="flex items-center gap-2 px-3 py-1.5 border border-error/20 text-error hover:bg-error/5 rounded-lg font-label-md text-label-md font-bold transition-all active:scale-95 duration-100"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Split Area */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* Left Main Dashboard Table Panel */}
          <section className="flex-1 overflow-y-auto p-stack-lg bg-background">
            <div className="max-w-6xl mx-auto flex flex-col h-full">
              
              {/* Notifications and messages */}
              {successMessage && (
                <div className="mb-4 p-3 bg-primary/10 text-primary border border-primary/20 rounded-lg flex justify-between items-center text-body-md">
                  <span>{successMessage}</span>
                  <button onClick={clearMessages} className="hover:opacity-75">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}

              {/* Section Header */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="font-headline-md text-headline-md text-on-surface mb-1">
                    {activeTab === "dashboard" ? "Student Performance Dashboard" : "Student Directory & Management"}
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {activeTab === "dashboard"
                      ? "Overview of educational analytics and class performance metrics"
                      : "Manage student profiles, enrollments, and academic marks across all students"}
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/students/new")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Student
                </button>
              </div>

              {/* Overview Dashboard Stats (Only shown when Dashboard tab is active) */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
                  {/* Card 1: Total Students */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">group</span>
                    </div>
                    <div>
                      <p className="font-headline-sm text-[20px] font-bold text-on-surface leading-tight">{total}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Total Students</p>
                    </div>
                  </div>

                  {/* Card 2: Class Average */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">analytics</span>
                    </div>
                    <div>
                      <p className="font-headline-sm text-[20px] font-bold text-on-surface leading-tight">{stats.classAverage}%</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Class Average</p>
                    </div>
                  </div>

                  {/* Card 3: Top Subject */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                    </div>
                    <div>
                      <p className="font-headline-sm text-[18px] font-bold text-on-surface leading-tight truncate max-w-[120px]">{stats.topSubject}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Top Subject</p>
                    </div>
                  </div>

                  {/* Card 4: Passing Rate */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center gap-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">check_circle</span>
                    </div>
                    <div>
                      <p className="font-headline-sm text-[20px] font-bold text-on-surface leading-tight">{stats.passRate}%</p>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">Passing Rate</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Card */}
              <div ref={studentTableRef} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="p-4 w-12"><input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" /></th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Name</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Age</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Class</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Telugu Avg</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Hindi Avg</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">English Avg</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant">Social Avg</th>
                        <th className="p-4 font-label-sm text-label-sm uppercase text-on-surface-variant text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {isLoading ? (
                        /* Skeleton UI for Loading State */
                        Array.from({ length: 5 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="p-4"><div className="h-4 w-4 bg-outline-variant/30 rounded" /></td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-outline-variant/30" />
                                <div className="h-4 w-28 bg-outline-variant/30 rounded" />
                              </div>
                            </td>
                            <td className="p-4"><div className="h-4 w-8 bg-outline-variant/30 rounded" /></td>
                            <td className="p-4"><div className="h-4 w-12 bg-outline-variant/30 rounded" /></td>
                            <td className="p-4"><div className="h-6 w-12 bg-outline-variant/30 rounded-full" /></td>
                            <td className="p-4"><div className="h-6 w-12 bg-outline-variant/30 rounded-full" /></td>
                            <td className="p-4"><div className="h-6 w-12 bg-outline-variant/30 rounded-full" /></td>
                            <td className="p-4"><div className="h-6 w-12 bg-outline-variant/30 rounded-full" /></td>
                            <td className="p-4 text-right"><div className="h-4 w-16 bg-outline-variant/30 rounded inline-block" /></td>
                          </tr>
                        ))
                      ) : students.length === 0 ? (
                        /* Empty State */
                        <tr>
                          <td colSpan={9} className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-[48px] opacity-40 mb-3">search_off</span>
                              <p className="font-headline-sm text-[16px] font-bold">No students found</p>
                              <p className="font-body-md mt-1 opacity-75">Try adjusting your search terms or register a new student.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        /* Student rows */
                        students.map((student) => {
                          const isSelected = selectedStudent && selectedStudent.id === student.id;
                          return (
                            <tr 
                              key={student.id} 
                              onClick={() => handleSelectStudent(student)}
                              className={`group cursor-pointer transition-colors ${
                                isSelected ? "active-row" : "hover:bg-surface-container-low"
                              }`}
                            >
                              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={!!isSelected}
                                  onChange={() => handleSelectStudent(student)}
                                  className="rounded border-outline-variant text-primary focus:ring-primary" 
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[12px]">
                                    {student.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                                  </div>
                                  <span className={`font-label-md text-label-md font-bold ${isSelected ? "text-primary" : ""}`}>
                                    {student.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 font-body-md text-body-md">{student.age}</td>
                              <td className="p-4 font-body-md text-body-md">{student.currentClass}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[12px] font-bold ${
                                  student.teluguAverage >= 80 ? "bg-secondary-container/20 text-on-secondary-container" : "bg-outline-variant/30 text-on-surface-variant"
                                }`}>
                                  {student.teluguAverage}%
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[12px] font-bold ${
                                  student.hindiAverage >= 80 ? "bg-secondary-container/20 text-on-secondary-container" : "bg-outline-variant/30 text-on-surface-variant"
                                }`}>
                                  {student.hindiAverage}%
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[12px] font-bold ${
                                  student.englishAverage >= 80 ? "bg-secondary-container/20 text-on-secondary-container" : "bg-outline-variant/30 text-on-surface-variant"
                                }`}>
                                  {student.englishAverage}%
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[12px] font-bold ${
                                  student.socialStudiesAverage >= 80 ? "bg-secondary-container/20 text-on-secondary-container" : "bg-outline-variant/30 text-on-surface-variant"
                                }`}>
                                  {student.socialStudiesAverage}%
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => navigate(`/students/edit/${student.id}`)}
                                  className="p-1 hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button 
                                  onClick={() => setStudentToDelete(student)}
                                  className="p-1 hover:text-error transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination footer */}
                {totalPages > 1 && (
                  <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of {total} students
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="p-2 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = page === pageNum;
                        return (
                          <button 
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded font-label-md text-label-md ${
                              isCurrent ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container-low"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="p-2 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Panel: Selected Student Details & Trends */}
          <aside className={`bg-surface-container-lowest flex flex-col transition-all duration-300 ease-in-out hidden xl:flex ${
            selectedStudent 
              ? "w-[380px] border-l border-outline-variant opacity-100" 
              : "w-0 border-l-0 opacity-0 overflow-hidden"
          }`}>
            {selectedStudent && (
              <div className="w-[380px] flex flex-col h-full overflow-y-auto scrollbar-hide">
                <div className="p-stack-lg border-b border-outline-variant bg-surface-container-low/30 relative">
                  <button 
                    onClick={() => handleSelectStudent(selectedStudent)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" 
                        alt={selectedStudent.name}
                        src={selectedStudent.name === "Arjun Kumar" 
                          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCvV808GDfSmFa68p2w7m8DYvaLaP3ANvlydZrPk33-ZXIhy1Wnh7UpIe-iRvVBxiFmTxBbdJfzDqERTkEJCSRAtw0mO8D3cuBMwvjJa66oSlhdUVWNW_fSIm6hPOIrvkCNBjrdb5q4MHqpMiub6Ir7l04MckWDWOzjyE_lK6a5H1S2f-d_XR_M6Q9jzKPPnICBhSLRIKtfmCgE1T3CqRGeIO1C8Kq4euBZRlZ4twK25H5XBwotFn1j_PB0Y5RtaEbUZHMoHdbZS740"
                          : "https://lh3.googleusercontent.com/aida/AP1WRLsxCEyn5AGClRWJEvucOoSxslj8RzQ-LL0JNYWSFZ0-rAoewvshu195RsMiPtrBxERsvDngMQ_iC2_7_w-QRrDl0sc31i5oEMTgxgIMbbPxnp7wx252j32fJl-gweKSlJGj5IE2qw9cNImcQ9vbT1Mv_n4j3w9ieljiF3kUo33h_JhGl2KSSGftdg-v9SSEddB_W28Z8FCRsWgt0mTr3gmzCsUaQHLw0CIj-1ObX0HgFjope42oC68Vwpta"
                        }
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary border-2 border-white rounded-full flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                      </div>
                    </div>
                    <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">{selectedStudent.name}</h2>
                    <div className="flex gap-2 mt-1 justify-center">
                      <span className="font-label-md text-label-md bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">Age: {selectedStudent.age}</span>
                      <span className="font-label-md text-label-md bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">Class: {selectedStudent.currentClass}</span>
                    </div>
                    <div className="mt-4 flex gap-4 w-full justify-center">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Overall Rank</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">#04</span>
                      </div>
                      <div className="w-[1px] bg-outline-variant h-10"></div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Attendance</span>
                        <span className="font-headline-sm text-headline-sm text-secondary font-bold">98%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Trends Charts */}
                <div className="p-stack-lg flex flex-col gap-stack-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">Performance Trend (6 Months)</h3>
                    <span className="font-label-md text-label-md text-on-surface-variant">Jan - Jun</span>
                  </div>

                  {isAnalyticsLoading ? (
                    <div className="p-12 text-center text-on-surface-variant animate-pulse">
                      <span>Loading analytics...</span>
                    </div>
                  ) : analyticsData ? (
                    <>
                      {/* Telugu Performance Trend */}
                      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-label-md text-label-md font-bold text-on-surface">Telugu</span>
                          <span className="font-label-md text-label-md text-primary">+3.2% ↑</span>
                        </div>
                        <div className="h-[120px] w-full">
                          <Line 
                            data={getChartData("Telugu", analyticsData.analytics.telugu, "#3525cd")}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Hindi Performance Trend */}
                      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-label-md text-label-md font-bold text-on-surface">Hindi</span>
                          <span className="font-label-md text-label-md text-secondary">+1.5% ↑</span>
                        </div>
                        <div className="h-[120px] w-full">
                          <Line 
                            data={getChartData("Hindi", analyticsData.analytics.hindi, "#006591")}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* English Performance Trend */}
                      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-label-md text-label-md font-bold text-on-surface">English</span>
                          <span className="font-label-md text-label-md text-error">-0.4% ↓</span>
                        </div>
                        <div className="h-[120px] w-full">
                          <Line 
                            data={getChartData("English", analyticsData.analytics.english, "#ba1a1a")}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Social Studies Performance Trend */}
                      <div className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-label-md text-label-md font-bold text-on-surface">Social Studies</span>
                          <span className="font-label-md text-label-md text-primary">+5.0% ↑</span>
                        </div>
                        <div className="h-[120px] w-full">
                          <Line 
                            data={getChartData("Social Studies", analyticsData.analytics.socialStudies, "#3525cd")}
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 text-on-surface-variant">No analytics data available</div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 bg-on-background/50 backdrop-blur-sm" onClick={() => setStudentToDelete(null)} />
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-xl w-full max-w-md relative z-10 animate-fade-in">
            <header className="mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 text-error rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">Delete Student Record</h3>
                <p className="text-body-md text-on-surface-variant mt-0.5">This action is permanent and cannot be undone.</p>
              </div>
            </header>
            <p className="text-body-md text-on-surface mb-6">
              Are you sure you want to delete all academic and profile files for <strong className="text-primary">{studentToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 border border-outline-variant bg-surface hover:bg-surface-container rounded-lg font-label-md text-label-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-error text-white hover:bg-error/95 rounded-lg font-label-md text-label-md font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
