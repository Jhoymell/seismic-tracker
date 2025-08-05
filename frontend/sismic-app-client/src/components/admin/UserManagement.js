import React, { useState, useEffect } from "react";
import { getVisitorUsers, deleteUser } from "../../api/user";
import toast from "react-hot-toast";
//Importaciones de MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getVisitorUsers();
      setUsers(data);
    } catch (error) {
      toast.error("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await deleteUser(userId);
        toast.success("Usuario eliminado correctamente.");
        fetchUsers(); // Volver a cargar la lista de usuarios
      } catch (error) {
        toast.error("No se pudo eliminar al usuario.");
      }
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de usuarios">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Fecha de Registro</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>
                  {new Date(user.date_joined).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary">
                  No hay usuarios visitantes.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagement;
