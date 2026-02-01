import { create } from 'zustand';

interface StoreState {
    // Sidebar
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;

    // Brand selection
    selectedBrand: string;
    setSelectedBrand: (brand: string) => void;

    // Alerts
    alertCount: number;
    setAlertCount: (count: number) => void;

    // Real-time simulation
    isRealTimeEnabled: boolean;
    toggleRealTime: () => void;
}

export const useStore = create<StoreState>((set) => ({
    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    // Brand selection
    selectedBrand: 'TechStart Inc',
    setSelectedBrand: (brand) => set({ selectedBrand: brand }),

    // Alerts
    alertCount: 3,
    setAlertCount: (count) => set({ alertCount: count }),

    // Real-time simulation
    isRealTimeEnabled: true,
    toggleRealTime: () => set((state) => ({ isRealTimeEnabled: !state.isRealTimeEnabled })),
}));
