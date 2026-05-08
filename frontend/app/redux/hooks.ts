import { useDispatch, useSelector, useStore } from 'react-redux';

/**
 * Custom Redux hooks for the application.
 * These act as wrappers for the standard react-redux hooks.
 */
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;