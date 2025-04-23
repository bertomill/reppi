// API route handlers for managing user notes - GET to fetch notes and POST to create new ones
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/notes - Get notes for the current user, optionally filtered by category
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
    
    // Get categoryId from query params
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    
    // Find all notes for the user, filtered by category if provided
    const notes = await prisma.note.findMany({
      where: { 
        userId: user.id,
        ...(categoryId ? { categoryId } : {})
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
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
    
    const { title, content, categoryId } = await request.json();
    
    // Basic validation
    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
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
    
    // Create the note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        categoryId,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
} 