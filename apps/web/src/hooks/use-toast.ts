

type ToastProps = {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
};

export function useToast() {
    // Placeholder state if we want to expand later
    // const [toasts, setToasts] = useState<ToastProps[]>([]);

    const toast = ({ title, description, variant }: ToastProps) => {
        console.log(`Toast: ${title} - ${description} (${variant})`);
        if (variant === 'destructive') {
            alert(`${title}: ${description}`);
        } else {
            // alert(`${title}: ${description}`);
        }
    };

    return { toast };
}
