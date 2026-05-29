import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

export function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-heading">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Oops! The page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>
            <Link to="/feed">go back to feed</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
