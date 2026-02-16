'use client';
import Link from 'next/link';
import {
  Image as ImageIcon,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-muted-foreground mt-2">
          Get started by translating an image or view your recent jobs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Translate Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Quick Translate
            </CardTitle>
            <CardDescription>
              Upload an image and get instant translation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/translate">
              <Button className="w-full gap-2">
                Start Translating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Translations</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>All time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              <span>Images processed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Plan</p>
              <p className="font-medium capitalize">{user?.tier || 'Free'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/settings">
              <Button variant="outline">Manage Account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
