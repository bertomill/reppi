// API route handler for user registration - creates new user with hashed password and default categories
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Default categories for new users
const DEFAULT_OBJECTIVE_CATEGORIES = [
  'Fitness',
  'Work',
  'Learning',
  'Personal'
];

const DEFAULT_NOTE_CATEGORIES = [
  'Wisdom',
  'Meals',
  'Books',
  'Energy'
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create default categories for the new user
    const categoryPromises = [
      // Objective categories
      ...DEFAULT_OBJECTIVE_CATEGORIES.map(name => 
        prisma.category.create({
          data: {
            name,
            type: 'objective',
            userId: user.id
          }
        })
      ),
      
      // Note categories
      ...DEFAULT_NOTE_CATEGORIES.map(name => 
        prisma.category.create({
          data: {
            name,
            type: 'note',
            userId: user.id
          }
        })
      )
    ];
    
    await Promise.all(categoryPromises);

    // Create a copy of user object without the password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 