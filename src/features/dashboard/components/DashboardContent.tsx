'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';

type Goal = {
  id: string;
  title: string;
  description: string | null;
  targetReps: number;
  currentReps: number;
  startDate: string;
  endDate: string | null;
  completed: boolean;
};

export default function DashboardContent() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch('/api/goals');
        if (response.ok) {
          const data = await response.json();
          setGoals(data);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGoals();
  }, []);
  
  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight">
            Welcome, {session?.user?.name || 'User'}!
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Workout Goals</h2>
              
              {loading ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">Loading your goals...</p>
                </div>
              ) : goals.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Goals Yet</CardTitle>
                    <CardDescription>
                      You haven't created any goals yet. Start tracking your reps by creating a new goal.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href="/goals/new">
                      <Button>Create New Goal</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {goals.map((goal) => (
                    <Card key={goal.id}>
                      <CardHeader>
                        <CardTitle>{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription>{goal.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>{goal.currentReps} / {goal.targetReps} reps</span>
                              <span>{Math.round((goal.currentReps / goal.targetReps) * 100)}%</span>
                            </div>
                            <Progress value={(goal.currentReps / goal.targetReps) * 100} />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Started: {format(new Date(goal.startDate), 'PPP')}</p>
                            {goal.endDate && (
                              <p>Target completion: {format(new Date(goal.endDate), 'PPP')}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/goals/${goal.id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  <Link href="/goals/new" className="flex h-full">
                    <Card className="w-full border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <CardContent className="flex flex-col items-center py-8">
                        <div className="rounded-full border border-primary/20 p-3 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                        </div>
                        <p className="text-primary font-medium">Add New Goal</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 