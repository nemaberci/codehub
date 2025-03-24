// React component at /user/auth/success
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/challenges'); // Redirect to challenges page after login success
    }
  }, [params, navigate]);

  return <div>Logging you in...</div>;
}