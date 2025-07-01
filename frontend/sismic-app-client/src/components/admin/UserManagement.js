import React, { useState, useEffect } from 'react';
import { getVisitorUsers, deleteUser } from '../../api/user';
import toast from 'react-hot-toast';

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
        if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.')) {
            try {
                await deleteUser(userId);
                toast.success('Usuario eliminado correctamente.');
                fetchUsers(); // Volver a cargar la lista de usuarios
            } catch (error) {
                toast.error('No se pudo eliminar al usuario.');
            }
        }
    };

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div>
            <h3>Usuarios Visitantes</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)} className="delete-btn">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;