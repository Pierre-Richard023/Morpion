import { useEffect } from "react"



interface ResultModalProps {
    message: string
    onClose: () => void
}


const ResultModal = ({ message, onClose }: ResultModalProps) => {

    if (!message) return null;


    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <>
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-transparent px-6 py-3 text-lg  ">
                    <div className="  text-6xl font-bold text-secondary drop-shadow-[3px_3px_0_#000] uppercase">
                        {message}
                    </div>
                </div>
            </div>
        </>
    )
}


export default ResultModal