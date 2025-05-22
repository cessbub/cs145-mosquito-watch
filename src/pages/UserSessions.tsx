
import React, { useState } from 'react';
import { useUserSessions, UserSession } from '@/hooks/useUserSessions';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { Clock } from 'lucide-react';

const UserSessions = () => {
  const { sessions, loading, error, filters, setFilters } = useUserSessions();
  const [emailFilter, setEmailFilter] = useState('');
  
  const handleFilterChange = (isActive: boolean | null) => {
    setFilters({ ...filters, active: isActive });
  };
  
  const handleEmailFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, email: emailFilter || null });
  };
  
  const renderStatus = (session: UserSession) => {
    if (session.is_active) {
      return <Badge className="bg-green-500">Active</Badge>;
    }
    return <Badge variant="outline">Ended</Badge>;
  };

  if (loading && sessions.length === 0) {
    return <Loading message="Loading user sessions..." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-mosquito-300" />
        <h1 className="text-2xl font-bold">User Sessions</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            Track user login and logout activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant={filters.active === null ? "default" : "outline"}
                onClick={() => handleFilterChange(null)}
              >
                All
              </Button>
              <Button 
                variant={filters.active === true ? "default" : "outline"}
                onClick={() => handleFilterChange(true)}
              >
                Active
              </Button>
              <Button 
                variant={filters.active === false ? "default" : "outline"}
                onClick={() => handleFilterChange(false)}
              >
                Ended
              </Button>
            </div>
            
            <form onSubmit={handleEmailFilterSubmit} className="flex gap-2 ml-auto">
              <Input
                placeholder="Filter by email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="w-auto min-w-[200px]"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
          
          {error ? (
            <div className="p-4 text-red-500 bg-red-50 rounded">Error: {error}</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableCaption>A list of all user sessions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Logout Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No sessions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.email}</TableCell>
                        <TableCell>{session.login_time_formatted}</TableCell>
                        <TableCell>{session.logout_time_formatted}</TableCell>
                        <TableCell>{session.duration}</TableCell>
                        <TableCell>{renderStatus(session)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSessions;
