// API route handlers for managing user categories - GET to fetch categories and POST to create new ones
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/api/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/categories - Get all categories for the current user
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
    
    // Get category type from query params
    const type = request.nextUrl.searchParams.get('type');
    
    // Find all categories for the user, filtered by type if provided
    const categories = await prisma.category.findMany({
      where: { 
        userId: user.id,
        ...(type ? { type } : {})
      },
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
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
    
    const { name, type } = await request.json();
    
    // Basic validation
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }
    
    // Check if the category already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        type,
        userId: user.id,
      },
    });
    
    if (existingCategory) {
      return NextResponse.json(existingCategory);
    }
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        type,
        userId: user.id,
      },
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 