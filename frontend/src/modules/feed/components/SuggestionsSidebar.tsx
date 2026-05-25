import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SuggestionsSidebar() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Suggestions</CardTitle>
        <CardDescription>
          Phase 1 scaffold for people and hobby suggestions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="people" className="w-full">
          <TabsList>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="mt-4">
            <ScrollArea className="h-[260px] rounded-lg border border-border/60 p-3">
              <div className="space-y-3">
                {['Alex Miles', 'Nina Park'].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="" alt={name} />
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          2 shared hobbies
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Soon</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="hobbies" className="mt-4">
            <ScrollArea className="h-[260px] rounded-lg border border-border/60 p-3">
              <div className="space-y-2">
                {['Pottery', 'Trail running', 'Chess'].map((hobby) => (
                  <div
                    key={hobby}
                    className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2"
                  >
                    <p className="text-sm font-medium">{hobby}</p>
                    <Badge variant="secondary">Trending</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
