import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for easier Redux usage
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth-specific hooks
export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useUser = () => {
  return useSelector((state) => state.auth.user);
};
