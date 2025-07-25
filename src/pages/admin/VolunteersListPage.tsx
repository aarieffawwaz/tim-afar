// src/pages/admin/VolunteersListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Definisikan tipe data untuk volunteer
interface Volunteer {
    id: string;
    name: string;
    email: string;
    country: string | null;
    created_at: string;
}

export default function VolunteersListPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Gagal memuat data volunteer.");
                }

                const data = await response.json();
                setVolunteers(data.users);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteers();
    }, [token]);

    if (isLoading) return <div className="p-8">Memuat data...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Daftar Volunteer</h1>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Negara</TableHead>
                            <TableHead>Tanggal Registrasi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {volunteers.map((volunteer) => (
                            <TableRow key={volunteer.id}>
                                <TableCell className="font-medium">{volunteer.name}</TableCell>
                                <TableCell>{volunteer.email}</TableCell>
                                <TableCell>{volunteer.country || '-'}</TableCell>
                                <TableCell>{new Date(volunteer.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        {/* Link ini akan kita fungsikan di langkah berikutnya */}
                                        <Link to={`/admin/volunteers/${volunteer.id}`}>Lihat Detail</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}