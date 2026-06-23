import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/students";

export const getStudentsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const data = await StudentService.getStudents(page, limit, search);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getStudentDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ status: "error", message: "Invalid student ID" });
      return;
    }

    const data = await StudentService.getStudentById(id);
    if (!data) {
      res.status(404).json({ status: "error", message: "Student not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, age, currentClass, marks } = req.body;

    if (!name || isNaN(parseInt(age)) || !currentClass || !marks) {
      res.status(400).json({
        status: "error",
        message: "Missing name, age, class or marks in request body"
      });
      return;
    }

    const student = await StudentService.createStudent(
      name,
      parseInt(age),
      currentClass,
      marks
    );

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { name, age, currentClass, marks } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ status: "error", message: "Invalid student ID" });
      return;
    }

    if (!name || isNaN(parseInt(age)) || !currentClass || !marks) {
      res.status(400).json({
        status: "error",
        message: "Missing name, age, class or marks in request body"
      });
      return;
    }

    const student = await StudentService.updateStudent(
      id,
      name,
      parseInt(age),
      currentClass,
      marks
    );

    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ status: "error", message: "Invalid student ID" });
      return;
    }

    await StudentService.deleteStudent(id);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getStudentAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ status: "error", message: "Invalid student ID" });
      return;
    }

    const data = await StudentService.getStudentAnalytics(id);
    if (!data) {
      res.status(404).json({ status: "error", message: "Student not found" });
      return;
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
