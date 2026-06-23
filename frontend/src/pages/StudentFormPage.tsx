import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "../hooks/useStudents";
import { useAuth } from "../hooks/useAuth";

const SUBJECTS = ["Telugu", "Hindi", "English", "Social Studies"];
const MONTHS = ["January", "February", "March", "April", "May", "June"];

export const StudentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const { 
    createStudent, 
    updateStudent, 
    loadStudentDetail, 
    isFormLoading, 
    error 
  } = useStudents();

  // Profile fields
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [currentClass, setCurrentClass] = useState("10-A");

  // Marks grid: marks[subject][month] = score
  const [marks, setMarks] = useState<{ [subject: string]: { [month: string]: number } }>(() => {
    const initialGrid: { [subject: string]: { [month: string]: number } } = {};
    SUBJECTS.forEach((sub) => {
      initialGrid[sub] = {};
      MONTHS.forEach((mon) => {
        initialGrid[sub][mon] = 75; // default starting score
      });
    });
    return initialGrid;
  });

  // Load existing student detail on edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadData = async () => {
        const student = await loadStudentDetail(parseInt(id));
        if (student) {
          setName(student.name);
          setAge(student.age);
          setCurrentClass(student.currentClass);
          setMarks(student.marks);
        }
      };
      loadData();
    }
  }, [id, isEditMode]);

  const handleMarkChange = (subject: string, month: string, value: string) => {
    let score = parseInt(value) || 0;
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    setMarks((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [month]: score
      }
    }));
  };

  // Calculate monthly averages (columns averages)
  const getMonthlyAverage = (month: string): number => {
    let totalScore = 0;
    SUBJECTS.forEach((sub) => {
      totalScore += marks[sub][month] || 0;
    });
    return Math.round((totalScore / SUBJECTS.length) * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || age === "" || isNaN(Number(age))) return;

    const payload = {
      name,
      age: Number(age),
      currentClass,
      marks
    };

    let success = false;
    if (isEditMode) {
      success = await updateStudent(parseInt(id), payload);
    } else {
      success = await createStudent(payload);
    }

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Side Navigation Bar */}
      <aside className="fixed left-0 top-0 bottom-0 flex flex-col p-stack-md bg-surface-container-lowest border-r border-outline-variant w-[240px] z-50">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-[18px] font-bold text-primary leading-tight">EduAnalytics</h1>
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">SaaS Platform</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label-md text-label-md active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button 
            onClick={() => navigate("/#students")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-primary font-bold bg-surface-container font-label-md text-label-md active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined">group</span>
            Student Management
          </button>
          <button 
            onClick={() => alert("Reports dashboard module is coming soon!")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label-md text-label-md active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined">assessment</span>
            Reports
          </button>
        </nav>
        <div className="mt-auto pt-4 space-y-1 border-t border-outline-variant">
          <button 
            onClick={() => alert("Settings module is coming soon!")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
          <button 
            onClick={() => alert("Support channel is coming soon!")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">contact_support</span>
            Support
          </button>
        </div>
      </aside>

      {/* Main Form Area Wrapper */}
      <main className="ml-[240px] min-h-screen flex flex-col">
        
        {/* Top Header Bar */}
        <header className="bg-surface border-b border-outline-variant sticky top-0 z-40">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-container-max mx-auto">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search students, metrics..." type="text"/>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors relative">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">help</span>
              </button>
              <div className="h-8 w-px bg-outline-variant mx-1"></div>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right">
                  <p className="font-label-md text-label-md text-on-surface leading-none">Prof. Rajesh Kumar</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Administrator</p>
                </div>
                <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Rajesh Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6ROX8DbUja_k7W9MrQNapE7y7O1yHJmY_etnsfT6YsARRsFy3HrF7U1aregQpUa71zqti2rdk-tHTGsxFgVhtUmGx6B5C0SWf-NeSWT8fdhlm5_73og9B2MnzAUf7Rc6OCuiUmVjG0-1_nKKLf_6lsWqHUitM6yjIBzMQHyGy87mxolCfr20bXk7Dt0SnO7YyBXnmEZUzJvBL2y7RbhWWB_bvYqaqPC96LBUH5Zt81bYbEfqv46L0ElVOHZSx8qbsbjQmoy38TIIM"/>
                <button onClick={() => logout()} className="text-primary font-bold text-body-md hover:underline decoration-2 underline-offset-4">Logout</button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-margin-page flex-1 max-w-container-max mx-auto w-full">
          
          <form onSubmit={handleSubmit}>
            
            {/* Form Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
              <div>
                <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <button type="button" onClick={() => navigate("/")} className="font-label-md text-label-md hover:text-primary transition-colors">Students</button>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="font-label-md text-label-md text-primary font-bold">{isEditMode ? "Edit Profile" : "Register Student"}</span>
                </nav>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  {isEditMode ? "Edit Student Record" : "Register Student Record"}
                </h2>
                <p className="text-on-surface-variant font-body-md mt-1">Manage personal details and monthly academic performance metrics.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => navigate("/")} 
                  className="px-6 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isFormLoading}
                  className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 font-bold disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Student
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl text-body-md">
                {error}
              </div>
            )}

            {/* Bento Form Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              
              {/* Left Column: Personal Information */}
              <div className="lg:col-span-4 space-y-gutter">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h3 className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-bold">Profile Information</h3>
                  </div>

                  <div className="space-y-stack-md">
                    {/* Name */}
                    <div className="space-y-stack-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5">Full Name</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-3 focus:ring-primary/10 outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Sharma"
                        required
                      />
                    </div>

                    {/* Age and Class */}
                    <div className="grid grid-cols-2 gap-stack-md">
                      <div className="space-y-stack-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5">Age</label>
                        <input 
                          type="number"
                          className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-3 focus:ring-primary/10 outline-none transition-all"
                          value={age}
                          onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="14"
                          required
                          min={5}
                          max={25}
                        />
                      </div>
                      <div className="space-y-stack-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5">Class</label>
                        <select 
                          className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-3 focus:ring-primary/10 outline-none transition-all cursor-pointer"
                          value={currentClass}
                          onChange={(e) => setCurrentClass(e.target.value)}
                        >
                          <option value="8-A">8th Grade (A)</option>
                          <option value="8-B">8th Grade (B)</option>
                          <option value="9-A">9th Grade (A)</option>
                          <option value="9-B">9th Grade (B)</option>
                          <option value="10-A">10th Grade (A)</option>
                          <option value="10-B">10th Grade (B)</option>
                          <option value="11-A">11th Grade (A)</option>
                          <option value="11-B">11th Grade (B)</option>
                        </select>
                      </div>
                    </div>

                    {/* Student ID (Mock UI Indicator) */}
                    <div className="space-y-stack-xs pt-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5">Student ID</label>
                      <div className="px-4 py-2.5 bg-surface-container-low border border-dashed border-outline-variant rounded-lg font-body-md text-on-surface-variant flex items-center justify-between">
                        <span>{isEditMode ? `EDU-2026-00${id}` : "EDU-2026-[auto]"}</span>
                        <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary">content_copy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-stack-lg relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Academic Summary</h4>
                    <p className="text-body-md text-on-surface-variant mb-4">Overall performance is trending upwards by 12% compared to the previous semester.</p>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-primary text-on-primary rounded-full font-label-md text-label-md">Grade A</div>
                      <div className="flex items-center gap-1 text-secondary font-bold text-label-md uppercase">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        Excellent
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[120px]">analytics</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Marks Entry Grid */}
              <div className="lg:col-span-8">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="px-stack-lg py-5 border-b border-outline-variant bg-surface-container-low/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">table_chart</span>
                      </div>
                      <div>
                        <h3 className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-bold">Marks Entry Grid</h3>
                        <p className="text-[12px] text-on-surface-variant">Academic Year 2026 (Jan - Jun)</p>
                      </div>
                    </div>
                  </div>

                  {/* Marks Input Grid Table */}
                  <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/50">
                          <th className="px-6 py-4 border-b border-outline-variant font-label-md text-label-md text-on-surface-variant w-40 sticky left-0 z-20 bg-surface-container-low">Subject</th>
                          {MONTHS.map((mon) => (
                            <th key={mon} className="px-4 py-4 border-b border-outline-variant font-label-md text-label-md text-on-surface-variant text-center">{mon}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {SUBJECTS.map((sub) => (
                          <tr key={sub} className="hover:bg-surface-container-low/20 transition-colors group">
                            <td className="px-6 py-4 font-body-md text-on-surface font-semibold sticky left-0 z-20 bg-surface-container-lowest group-hover:bg-surface-container-low/50 transition-colors">
                              {sub}
                            </td>
                            {MONTHS.map((mon) => (
                              <td key={mon} className="px-2 py-3">
                                <input 
                                  type="number"
                                  className="grid-input w-full text-center py-2 px-1 bg-surface border border-outline-variant/50 rounded-lg font-label-md focus:outline-none transition-all"
                                  value={marks[sub]?.[mon] ?? ""}
                                  onChange={(e) => handleMarkChange(sub, mon, e.target.value)}
                                  min={0}
                                  max={100}
                                  required
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-surface-container-low/20 font-bold">
                          <td className="px-6 py-4 sticky left-0 z-20 bg-surface-container-low font-label-md text-label-md uppercase">Monthly Average</td>
                          {MONTHS.map((mon) => (
                            <td key={mon} className="px-4 py-4 text-center text-primary font-headline-sm">
                              {getMonthlyAverage(mon)}
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </form>

        </div>
      </main>
    </div>
  );
};
export default StudentFormPage;
