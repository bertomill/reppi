// API route handlers for managing user objectives - GET to fetch objectives and POST to create new ones
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/objectives - Get objectives for the current user, filtered by date
export async function GET(request: NextRequest) {
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
    
    // Get date from query params (format: YYYY-MM-DD)
    const dateParam = request.nextUrl.searchParams.get('date');
    
    let whereClause: any = { userId: user.id };
    
    if (dateParam) {
      // Parse the date and create start and end of day timestamps
      const requestDate = new Date(dateParam);
      const startOfDay = new Date(requestDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(requestDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }
    
    // Find all objectives for the user with the given date
    const objectives = await prisma.objective.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    
    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch objectives' },
      { status: 500 }
    );
  }
}

// POST /api/objectives - Create a new objective
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
    
    const { title, categoryId, date } = await request.json();
    
    // Basic validation
    if (!title || !categoryId) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }
    
    // Verify the category exists and belongs to the user
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    if (category.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to use this category' },
        { status: 403 }
      );
    }
    
    // Create the objective
    const objective = await prisma.objective.create({
      data: {
        title,
        categoryId,
        date: date ? new Date(date) : new Date(),
        userId: user.id,
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(objective, { status: 201 });
  } catch (error) {
    console.error('Error creating objective:', error);
    return NextResponse.json(
      { error: 'Failed to create objective' },
      { status: 500 }
    );
  }
} 