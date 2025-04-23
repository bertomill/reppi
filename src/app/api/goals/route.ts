// API route handlers for managing user goals - GET to fetch goals and POST to create new ones
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/goals - Get all goals for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user from the database based on email
    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email as string 
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user from the database based on email
    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email as string 
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const { title, description, targetReps, endDate } = await request.json();
    
    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    if (!targetReps || targetReps < 1) {
      return NextResponse.json({ error: "Target reps must be at least 1" }, { status: 400 });
    }
    
    // Create the goal
    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || null,
        targetReps,
        currentReps: 0,
        startDate: new Date(),
        endDate: endDate || null,
        completed: false,
        userId: user.id,
      },
    });
    
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 