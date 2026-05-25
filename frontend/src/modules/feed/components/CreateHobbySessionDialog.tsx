import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateHobbySessionDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Create hobby session</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New hobby session</DialogTitle>
          <DialogDescription>
            Phase 1 scaffold. Full form validation, image upload, and API wiring
            will be added in Phase 2.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hobby">Hobby</Label>
            <Select>
              <SelectTrigger id="hobby" className="w-full">
                <SelectValue placeholder="Select hobby" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="drawing">Drawing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="datetime-local" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="datetime-local" disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How did the session go?"
              disabled
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" disabled>
            Save session (Phase 2)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
