import React, { useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Reply, Edit, Trash2 } from 'lucide-react';

export interface MessageActionsProps {
  isFromMe?: boolean;
  classNames?: string;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  classNames = '',
  isFromMe = false,
  onDropdownOpen,
  onDropdownClose,
}) => {
  const onReply = useCallback(() => {
    console.log('reply');
  }, []);

  const onEdit = useCallback(() => {
    console.log('edit');
  }, []);

  const onDelete = useCallback(() => {
    console.log('delete');
  }, []);

  const [, setIsDropdownOpen] = useState(false);

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      setIsDropdownOpen(open);
      if (open) {
        onDropdownOpen?.();
      } else {
        onDropdownClose?.();
      }
    },
    [onDropdownOpen, onDropdownClose]
  );

  return (
    <div className={classNames}>
      <DropdownMenu onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Message actions"
            className="w-6 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isFromMe ? 'end' : 'start'} className="w-48">
          {onReply && (
            <DropdownMenuItem onClick={onReply} className="cursor-pointer">
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
