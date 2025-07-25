// src/pages/admin/MatchmakingDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react"; // <-- 1. Impor ikon Loader2
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Tipe data sesuai API response
interface ActivityDetail {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
}

interface RecommendedVolunteer {
  id: string;
  name: string;
  match_score: number;
  match_reasons: string[];
}

export default function MatchmakingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [recommended, setRecommended] = useState<RecommendedVolunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false); // <-- 2. State baru untuk proses assignment

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects/recommended/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        const fullActivityDetailsResponse = await fetch(
          `${API_BASE_URL}/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fullActivityData = await fullActivityDetailsResponse.json();

        setActivity(fullActivityData.project);
        setRecommended(data.recommended_volunteers);
      } catch (error) {
        console.error("Failed to fetch matchmaking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleSelectVolunteer = (volunteerId: string) => {
    setSelectedVolunteers((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(volunteerId)) {
        newSelected.delete(volunteerId);
      } else {
        newSelected.add(volunteerId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedVolunteers(new Set(recommended.map((v) => v.id)));
    } else {
      setSelectedVolunteers(new Set());
    }
  };

  const handleAssign = async () => {
    if (selectedVolunteers.size === 0) {
      toast.warning("Please select at least one volunteer to assign.");
      return;
    }

    setIsAssigning(true); // <-- 3. Set loading true di awal
    const volunteerIds = Array.from(selectedVolunteers);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/projects/${id}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ volunteerIds }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign volunteers.");
      }

      toast.success(
        `${volunteerIds.length} volunteer(s) have been successfully assigned.`
      );

      navigate("/admin/matchmaking");
    } catch (error) {
      console.error("Error assigning volunteers:", error);
      toast.error((error as Error).message);
    } finally {
      setIsAssigning(false); // <-- 4. Set loading false di akhir
    }
  };

  if (isLoading) return <div className="p-8">Loading matchmaking data...</div>;
  if (!activity) return <div className="p-8">Activity not found.</div>;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link to="/admin/matchmaking">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Detail Volunteer Matching: {activity.title}</CardTitle>
          <CardDescription>
            {activity.description || "No description available."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <span className="font-semibold">Required Skills:</span>{" "}
            {activity.required_skills?.join(", ") || "None"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended Volunteers</CardTitle>
          {/* --- 5. Perbarui Tombol Assign --- */}
          <Button
            onClick={handleAssign}
            disabled={selectedVolunteers.size === 0 || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              `Assign Selected (${selectedVolunteers.size})`
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    onCheckedChange={(checked) =>
                      handleSelectAll(Boolean(checked))
                    }
                    checked={
                      recommended.length > 0 &&
                      selectedVolunteers.size === recommended.length
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name & Match Reasons</TableHead>
                <TableHead className="text-right">AI Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommended.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() =>
                        handleSelectVolunteer(volunteer.id)
                      }
                      checked={selectedVolunteers.has(volunteer.id)}
                      aria-label={`Select ${volunteer.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{volunteer.name}</p>
                    <ul className="list-disc pl-5 mt-1 text-xs text-muted-foreground">
                      {volunteer.match_reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{volunteer.match_score}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
