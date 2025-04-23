// API route handler for managing rep logs - POST to create a new rep log and update associated goal progress
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// POST /api/repLogs - Create a new rep log and update goal progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const { goalId, count, notes } = await request.json();
    
    // Validate required fields
    if (!goalId || !count || count <= 0) {
      return NextResponse.json(
        { error: 'Goal ID and a positive rep count are required' },
        { status: 400 }
      );
    }
    
    // Verify the goal exists and belongs to the user
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    if (goal.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to access this goal' },
        { status: 403 }
      );
    }
    
    // Create the rep log
    const repLog = await prisma.repLog.create({
      data: {
        count,
        notes,
        goalId,
        userId: user.id,
      },
    });
    
    // Update the goal's current rep count
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentReps: { increment: count },
        // If the current reps meet or exceed the target, mark as completed
        completed: goal.currentReps + count >= goal.targetReps,
      },
    });
    
    return NextResponse.json(
      { repLog, updatedGoal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rep log:', error);
    return NextResponse.json(
      { error: 'Failed to create rep log' },
      { status: 500 }
    );
  }
} 