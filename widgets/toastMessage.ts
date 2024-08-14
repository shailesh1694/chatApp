import { toast } from "react-toastify"

type TostType = "info" | "warn" | "success" | "error"

export const toastMessage = (
    message: string, type: TostType
) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
