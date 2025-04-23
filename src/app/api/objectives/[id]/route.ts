// API route handlers for managing individual objectives - PATCH to update an objective and DELETE to remove it
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// PATCH /api/objectives/[id] - Update an objective
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    // Get the objective to check ownership
    const objective = await prisma.objective.findUnique({
      where: { id },
    });
    
    if (!objective) {
      return NextResponse.json(
        { error: 'Objective not found' },
        { status: 404 }
      );
    }
    
    if (objective.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this objective' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Update the objective
    const updatedObjective = await prisma.objective.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(updatedObjective);
  } catch (error) {
    console.error('Error updating objective:', error);
    return NextResponse.json(
      { error: 'Failed to update objective' },
      { status: 500 }
    );
  }
}

// DELETE /api/objectives/[id] - Delete an objective
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
    
    // Get the objective to check ownership
    const objective = await prisma.objective.findUnique({
      where: { id },
    });
    
    if (!objective) {
      return NextResponse.json(
        { error: 'Objective not found' },
        { status: 404 }
      );
    }
    
    if (objective.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this objective' },
        { status: 403 }
      );
    }
    
    // Delete the objective
    await prisma.objective.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting objective:', error);
    return NextResponse.json(
      { error: 'Failed to delete objective' },
      { status: 500 }
    );
  }
} 