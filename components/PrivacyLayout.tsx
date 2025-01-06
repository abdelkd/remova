import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

const PolicyLayout = ({ icon: Icon, title, lastUpdated, children }: Props) => (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
        <Badge variant="outline">v1.0</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">{children}</div>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default PolicyLayout;
