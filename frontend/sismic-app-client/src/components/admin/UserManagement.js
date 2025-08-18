import React, { useState, useEffect } from "react";
import { getVisitorUsers, deleteUser } from "../../api/user";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';
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
  Box, // <-- agregado
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Creamos versiones animadas de los componentes de tabla
const MotionTableBody = motion(TableBody);
const MotionTableRow = motion(TableRow);

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

  // Variantes de animación (contenedor y filas)
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
        boxShadow: '0 2px 16px 0 #00bcd422',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800,
          letterSpacing: '-0.3px',
          filter: 'drop-shadow(0 2px 12px #00e5ff33)',
        }}
      >
        Gestión de Usuarios
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(10,18,30,0.65)',
          borderRadius: '1rem',
          boxShadow: '0 2px 16px 0 #00bcd422',
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            '& th': {
              color: '#e3f7fa',
              fontWeight: 700,
              borderBottom: '1px solid rgba(0,188,212,0.25)',
            },
            '& td': {
              color: '#b3e5fc',
              borderBottom: '1px solid #0e2a36',
            },
          }}
          aria-label="tabla de usuarios"
        >
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Fecha de Registro</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* Aplicamos variantes al cuerpo de la tabla */}
          <MotionTableBody
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {users.length > 0 ? (
              users.map((user) => (
                // Cada fila con su propia animación
                <MotionTableRow
                  key={user.id}
                  variants={listItemVariants}
                  whileHover={{
                    scale: 1.01,
                    y: -2,
                    boxShadow: '0 10px 26px rgba(0,188,212,0.18)',
                    backgroundColor: 'rgba(0,188,212,0.06)',
                  }}
                  transition={{ duration: 0.25 }}
                  sx={{
                    borderRadius: '10px',
                  }}
                >
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{new Date(user.date_joined).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      sx={{
                        transition: 'transform .15s ease',
                        '&:hover': { transform: 'scale(1.07)' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </MotionTableRow>
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
          </MotionTableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
