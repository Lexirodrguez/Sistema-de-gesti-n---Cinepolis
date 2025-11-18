// API Base URL
const API_BASE = '/api';

// Función para hacer login
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Importante: incluir cookies
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (data.success) {
            // Guardar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error en login:', error);
        return false;
    }
}

// Función para hacer logout
async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        // Limpiar localStorage
        localStorage.removeItem('user');
        
        // Redirigir al login
        window.location.href = '/login';
    } catch (error) {
        console.error('Error en logout:', error);
        // Aún así redirigir al login
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

// Función para verificar si el usuario está autenticado
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        
        if (data.success) {
            // Actualizar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        } else {
            localStorage.removeItem('user');
            return false;
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('user');
        return false;
    }
}

// Función para obtener el usuario actual
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Función para verificar si el usuario es administrador
function isAdmin() {
    const user = getCurrentUser();
    return user && user.rol === 'administrador';
}

// Función para hacer peticiones autenticadas a la API
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        credentials: 'include', // Siempre incluir cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE}${url}`, {
        ...defaultOptions,
        ...options
    });

    // Si la respuesta es 401, redirigir al login
    if (response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return null;
    }

    return response;
}

// Función para proteger rutas (verificar autenticación antes de cargar)
async function protectRoute() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

