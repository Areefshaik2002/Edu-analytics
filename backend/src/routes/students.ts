import { Router } from "express";
import {
  getStudentsList,
  getStudentDetail,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAnalytics
} from "../controllers/students";
import { authGuard } from "../middleware/auth";

const router = Router();

// Apply AuthGuard globally to protect all student-related endpoints
router.use(authGuard);

router.get("/", getStudentsList);
router.get("/:id", getStudentDetail);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/:id/analytics", getStudentAnalytics);

export default router;
