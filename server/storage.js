import { 
  users, 
  subjects, 
  tasks, 
  studySessions, 
  userStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { addDays, format } from "date-fns";

export class DatabaseStorage {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser) {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Subject methods
  async getSubjects(userId) {
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async getSubject(id) {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(insertSubject) {
    const [subject] = await db
      .insert(subjects)
      .values(insertSubject)
      .returning();
    return subject;
  }

  async updateSubject(id, updateData) {
    const [updated] = await db
      .update(subjects)
      .set(updateData)
      .where(eq(subjects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSubject(id) {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.rowCount > 0;
  }

  // Task methods
  async getTasks(userId) {
    return await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(eq(tasks.userId, userId));
  }

  async getTask(id) {
    const [task] = await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask) {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    
    return await this.getTask(task.id);
  }

  async updateTask(id, updateData) {
    const currentTask = await this.getTask(id);
    if (!currentTask) return undefined;

    if (updateData.status === "completed" && currentTask.status !== "completed") {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updated) return undefined;
    return await this.getTask(updated.id);
  }

  async deleteTask(id) {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  async getTasksByStatus(userId, status) {
    const allTasks = await this.getTasks(userId);
    return allTasks.filter(task => task.status === status);
  }

  async getUpcomingTasks(userId, days = 7) {
    const now = new Date();
    const futureDate = addDays(now, days);

    return await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.dueDate, format(now, 'yyyy-MM-dd')),
          lte(tasks.dueDate, format(futureDate, 'yyyy-MM-dd'))
        )
      );
  }

  // Study session methods
  async getStudySessions(userId) {
    return await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.userId, userId));
  }

  async getStudySession(id) {
    const [session] = await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.id, id));
    return session || undefined;
  }

  async createStudySession(insertSession) {
    const [session] = await db
      .insert(studySessions)
      .values(insertSession)
      .returning();
    
    return await this.getStudySession(session.id);
  }

  async updateStudySession(id, updateData) {
    const [updated] = await db
      .update(studySessions)
      .set(updateData)
      .where(eq(studySessions.id, id))
      .returning();
    
    if (!updated) return undefined;
    return await this.getStudySession(updated.id);
  }

  async deleteStudySession(id) {
    const result = await db.delete(studySessions).where(eq(studySessions.id, id));
    return result.rowCount > 0;
  }

  async getTodaysSessions(userId) {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    return await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(
        and(
          eq(studySessions.userId, userId),
          gte(studySessions.startTime, todayStr),
          lte(studySessions.startTime, todayStr + ' 23:59:59')
        )
      );
  }

  // User stats methods
  async getUserStats(userId, date) {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(and(eq(userStats.userId, userId), eq(userStats.date, date)));
    return stats || undefined;
  }

  async createOrUpdateUserStats(insertStats) {
    const existing = await this.getUserStats(insertStats.userId, insertStats.date);

    if (existing) {
      const [updated] = await db
        .update(userStats)
        .set(insertStats)
        .where(and(eq(userStats.userId, insertStats.userId), eq(userStats.date, insertStats.date)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userStats)
        .values(insertStats)
        .returning();
      return created;
    }
  }

  async getWeeklyStats(userId) {
    const today = new Date();
    const weekAgo = addDays(today, -7);

    return await db
      .select()
      .from(userStats)
      .where(
        and(
          eq(userStats.userId, userId),
          gte(userStats.date, format(weekAgo, 'yyyy-MM-dd')),
          lte(userStats.date, format(today, 'yyyy-MM-dd'))
        )
      )
      .orderBy(desc(userStats.date));
  }
}

export const storage = new DatabaseStorage();