// Central frontend config. Use Vite env `VITE_BACKEND_URL` to override in deploy.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default BACKEND_URL
